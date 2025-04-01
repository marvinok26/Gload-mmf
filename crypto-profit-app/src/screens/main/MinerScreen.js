// src/screens/main/MinerScreen.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useMiner } from '../../hooks/useMiner';
import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import MinerCard from '../../components/miner/MinerCard';
import MinerStatusIndicator from '../../components/miner/MinerStatusIndicator';
import MinerSection from '../../components/miner/MinerSection';
import MinerAnimation from '../../components/miner/MinerAnimation';
import { Ionicons } from '@expo/vector-icons';
import { getMinersActivationProgress, activateMinerDaily } from '../../services/miner.service';
import { 
  BASIC_MINERS, 
  ADVANCED_MINERS, 
  PREMIUM_MINERS 
} from '../../constants/api.constants';

const MinerScreen = () => {
  const { user } = useAuth();
  const { 
    miners, 
    userMiners, 
    purchaseMiner, 
    toggleMinerStatus,
    loadMiners,
    loadUserMiners
  } = useMiner();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMiner, setSelectedMiner] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [activationProgress, setActivationProgress] = useState({});
  const [showActiveMinerDetails, setShowActiveMinerDetails] = useState(null);
  
  // Track which tier sections are expanded
  const [expandedTiers, setExpandedTiers] = useState({
    basic: false,
    advanced: false,
    premium: false
  });

  useEffect(() => {
    loadData();
    updateActivationProgress();
    
    // Update activation progress every minute
    const interval = setInterval(() => {
      updateActivationProgress();
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  // Separate useEffect for userMiners to prevent unnecessary reloads
  useEffect(() => {
    if (userMiners && userMiners.length > 0) {
      // Initial progress from the miners data
      const progress = {};
      userMiners.forEach(miner => {
        if (miner.isActive) {
          progress[miner.id] = miner.activationProgress || 0;
        }
      });
      setActivationProgress(progress);
    }
  }, [userMiners]);

  const updateActivationProgress = async () => {
    const progress = await getMinersActivationProgress();
    setActivationProgress(progress);
  };

  const loadData = async () => {
    await Promise.all([
      loadMiners(),
      loadUserMiners()
    ]);
  };

  const handlePurchase = async () => {
    if (!selectedMiner) return;
    
    if ((user?.balance || 0) < selectedMiner.price) {
      Alert.alert(
        'Insufficient Balance', 
        'You need to deposit more USDT to purchase this miner. Would you like to go to your wallet?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Wallet', onPress: () => {
            // Navigate to wallet/deposit screen
            console.log('Navigate to wallet/deposit screen');
          }}
        ]
      );
      return;
    }
    
    setPurchasing(true);
    try {
      const result = await purchaseMiner(selectedMiner.minerId, selectedMiner.price);
      
      if (result.success) {
        Alert.alert(
          'Success', 
          `You've successfully purchased a ${selectedMiner.name}!`,
          [
            { text: 'OK', onPress: () => {
              setSelectedMiner(null);
              // Refresh user miners data
              loadUserMiners();
            }}
          ]
        );
      } else {
        Alert.alert('Purchase Failed', result.error || 'Failed to purchase miner');
      }
    } catch (error) {
      console.error('Error purchasing miner:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setPurchasing(false);
    }
  };

  const handleToggleMiner = async (userMinerId, active) => {
    try {
      const result = await toggleMinerStatus(userMinerId, active);
      
      if (result.success) {
        // If activating, reset progress
        if (active) {
          setActivationProgress({
            ...activationProgress,
            [userMinerId]: 0
          });
          
          Alert.alert(
            'Miner Activated', 
            'Your miner has been activated! It will generate profits for the next 24 hours.'
          );
        }
        
        // Refresh user miners data
        await loadUserMiners();
      } else {
        Alert.alert('Status Update Failed', result.error || 'Failed to update miner status');
      }
    } catch (error) {
      console.error('Error toggling miner status:', error);
      Alert.alert('Error', 'Failed to update miner status');
    }
  };
  
  const handleActivate = async (userMinerId) => {
    try {
      // Only allow activation if progress is 100%
      if (activationProgress[userMinerId] < 1) {
        Alert.alert('Not Ready', 'This miner is not ready for activation yet. Please wait until the 24-hour period is complete.');
        return;
      }
      
      const result = await activateMinerDaily(userMinerId);
      
      if (result.success) {
        // Reset progress
        setActivationProgress({
          ...activationProgress,
          [userMinerId]: 0
        });
        
        Alert.alert(
          'Daily Activation', 
          'Miner has been activated for another day! Continue to earn profits.'
        );
        
        // Refresh user miners data
        await loadUserMiners();
      } else {
        Alert.alert('Activation Failed', result.error || 'Failed to activate miner');
      }
    } catch (error) {
      console.error('Error activating miner:', error);
      Alert.alert('Error', 'Failed to activate miner');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
      await updateActivationProgress();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Get miner lists - either from API or fallback to constants
  const basicMiners = miners?.filter(m => m.price >= 5 && m.price <= 50) || BASIC_MINERS;
  const advancedMiners = miners?.filter(m => m.price > 50 && m.price <= 100) || ADVANCED_MINERS;
  const premiumMiners = miners?.filter(m => m.price > 100) || PREMIUM_MINERS;

  // Toggle a tier's expanded state
  const toggleTier = (tier) => {
    setExpandedTiers(prev => ({
      ...prev,
      [tier]: !prev[tier]
    }));
  };

  // Count active miners
  const activeMinersCount = userMiners?.filter(m => m.isActive).length || 0;
  
  // Format miner for detailed view
  const getDetailedMiner = (minerId) => {
    return userMiners?.find(m => m.id === minerId);
  };

  // Calculate tier based on price
  const getMinerTier = (price) => {
    if (price >= 110) return 'premium';
    if (price >= 60) return 'advanced';
    return 'basic';
  };

  // Get expiry based on tier
  const getMinerExpiry = (tier) => {
    if (tier === 'premium') return '3 months';
    if (tier === 'advanced') return '2 months';
    return '1 month';
  };

  // Render a tier header with expand/collapse functionality
  const renderTierHeader = (title, description, tierKey, minerCount) => (
    <TouchableOpacity onPress={() => toggleTier(tierKey)}>
      <Card className={`rounded-xl overflow-hidden border mb-2 ${
        tierKey === 'basic' ? 'border-blue-200' : 
        tierKey === 'advanced' ? 'border-purple-200' : 
        'border-amber-200'
      }`}>
        <View className="p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons 
                name={
                  tierKey === 'basic' ? 'flash-outline' : 
                  tierKey === 'advanced' ? 'trending-up-outline' : 
                  'diamond-outline'
                } 
                size={20} 
                color={
                  tierKey === 'basic' ? '#3B82F6' : 
                  tierKey === 'advanced' ? '#8B5CF6' : 
                  '#F59E0B'
                } 
              />
              <Typography variant="h2" className="text-lg font-semibold ml-2">{title}</Typography>
            </View>
            <View className="flex-row items-center">
              <Typography variant="caption" className="text-xs text-gray-500 mr-2">
                {minerCount} options
              </Typography>
              <Ionicons 
                name={expandedTiers[tierKey] ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#6B7280" 
              />
            </View>
          </View>
          <Typography variant="caption" className="text-slate-600">{description}</Typography>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Typography variant="h1" className="text-xl font-bold">Miners</Typography>
          <Typography variant="body" className="text-slate-500">
            Purchase miners to start earning daily profits
          </Typography>
        </View>
        
        {/* User's Miners */}
        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Typography variant="h2" className="text-lg font-semibold">Your Miners</Typography>
            <View className="bg-blue-100 px-2 py-1 rounded-full">
              <Typography variant="body" className="text-blue-700 text-xs font-medium">
                Active: {activeMinersCount}/{userMiners?.length || 0}
              </Typography>
            </View>
          </View>
          
          {userMiners?.length > 0 ? (
            <>
              {/* If a miner is selected for detailed view */}
              {showActiveMinerDetails ? (
                <Card className="mb-4 rounded-xl shadow-sm overflow-hidden">
                  <View className="bg-blue-600 px-4 py-2 flex-row justify-between items-center">
                    <Typography variant="h3" className="font-semibold text-white">
                      {getDetailedMiner(showActiveMinerDetails)?.name || 'Miner Details'}
                    </Typography>
                    <TouchableOpacity 
                      onPress={() => setShowActiveMinerDetails(null)}
                      className="p-1"
                    >
                      <Ionicons name="close" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  <View className="p-4">
                    {/* Miner animation */}
                    <MinerAnimation 
                      active={getDetailedMiner(showActiveMinerDetails)?.isActive || false}
                      tier={getMinerTier(getDetailedMiner(showActiveMinerDetails)?.price || 0)}
                    />
                    
                    {/* Miner stats */}
                    <View className="mt-4 bg-gray-50 p-3 rounded-lg">
                      <View className="flex-row justify-between mb-2">
                        <Typography variant="caption" className="text-slate-600">Daily Profit:</Typography>
                        <Typography variant="caption" className="font-semibold text-green-600">
                          ${getDetailedMiner(showActiveMinerDetails)?.dailyProfit?.toFixed(2) || '0.00'} USDT
                        </Typography>
                      </View>
                      
                      <View className="flex-row justify-between mb-2">
                        <Typography variant="caption" className="text-slate-600">Expires In:</Typography>
                        <Typography variant="caption" className="font-semibold">
                          {getMinerExpiry(getMinerTier(getDetailedMiner(showActiveMinerDetails)?.price || 0))}
                        </Typography>
                      </View>
                      
                      <View className="flex-row justify-between">
                        <Typography variant="caption" className="text-slate-600">Status:</Typography>
                        <Typography 
                          variant="caption" 
                          className={getDetailedMiner(showActiveMinerDetails)?.isActive ? 
                            "font-semibold text-green-600" : "font-semibold text-red-600"}
                        >
                          {getDetailedMiner(showActiveMinerDetails)?.isActive ? 'Active' : 'Inactive'}
                        </Typography>
                      </View>
                    </View>
                    
                    {/* Activation progress */}
                    <View className="mt-4">
                      <Typography variant="caption" className="font-semibold mb-2">
                        Activation Status
                      </Typography>
                      
                      <MinerStatusIndicator 
                        active={getDetailedMiner(showActiveMinerDetails)?.isActive || false}
                        progress={activationProgress[showActiveMinerDetails] || 0}
                        onActivate={() => handleActivate(showActiveMinerDetails)}
                      />
                    </View>
                    
                    {/* Activation button */}
                    {!getDetailedMiner(showActiveMinerDetails)?.isActive && (
                      <Button
                        title="Activate Miner"
                        onPress={() => handleToggleMiner(showActiveMinerDetails, true)}
                        className="bg-blue-600 py-2 mt-4 rounded-lg"
                      />
                    )}
                  </View>
                </Card>
              ) : (
                // List of user's miners
                userMiners.map((miner) => (
                  <Card key={miner.id} className="mb-3 rounded-xl shadow-sm overflow-hidden">
                    <View className="p-3">
                      <View className="flex-row justify-between">
                        <TouchableOpacity 
                          className="flex-1" 
                          onPress={() => setShowActiveMinerDetails(miner.id)}
                        >
                          <View>
                            <Typography variant="h3" className="font-semibold">{miner.name}</Typography>
                            <Typography variant="caption" className="text-slate-600 text-xs mt-1">
                              Daily Profit: <Typography className="text-green-600">${miner.dailyProfit?.toFixed(2) || '0.00'} USDT</Typography>
                            </Typography>
                          </View>
                        </TouchableOpacity>
                        
                        <View className="ml-2">
                          <MinerStatusIndicator 
                            active={miner.isActive} 
                            progress={activationProgress[miner.id] || 0}
                            onActivate={() => handleActivate(miner.id)}
                          />
                        </View>
                      </View>
                      
                      {!miner.isActive && (
                        <Button
                          title="Activate Miner"
                          onPress={() => handleToggleMiner(miner.id, true)}
                          className="bg-blue-600 py-2 mt-2 rounded-lg"
                        />
                      )}
                    </View>
                  </Card>
                ))
              )}
            </>
          ) : (
            <Card className="rounded-xl shadow-sm">
              <View className="p-4 items-center">
                <Typography variant="body" className="text-slate-500 text-center">
                  You don't have any miners yet. Purchase a miner to start earning!
                </Typography>
              </View>
            </Card>
          )}
        </View>
        
        {/* Available Miners */}
        <View className="mx-4 mb-4">
          <Typography variant="h1" className="text-xl font-bold mb-2">Available Miners</Typography>
          
          {/* Basic Miners - Collapsible Section */}
          {renderTierHeader(
            "Basic Miners", 
            "Entry-level miners from $5-$50 with 2-40% daily returns. Lasts for 1 month.", 
            "basic",
            basicMiners.length
          )}
          
          {expandedTiers.basic && basicMiners.map((miner) => (
            <MinerCard
              key={miner.minerId}
              miner={miner}
              selected={selectedMiner?.minerId === miner.minerId}
              onSelect={() => setSelectedMiner(miner)}
            />
          ))}
          
          {/* Advanced Miners - Collapsible Section */}
          {renderTierHeader(
            "Advanced Miners", 
            "Intermediate miners from $60-$100 with 50-90% daily returns. Lasts for 2 months.", 
            "advanced",
            advancedMiners.length
          )}
          
          {expandedTiers.advanced && advancedMiners.map((miner) => (
            <MinerCard
              key={miner.minerId}
              miner={miner}
              selected={selectedMiner?.minerId === miner.minerId}
              onSelect={() => setSelectedMiner(miner)}
            />
          ))}
          
          {/* Premium Miners - Collapsible Section */}
          {renderTierHeader(
            "Premium Miners", 
            "High-performance miners from $110-$600 with 100-200% daily returns. Lasts for 3 months.", 
            "premium",
            premiumMiners.length
          )}
          
          {expandedTiers.premium && premiumMiners.map((miner) => (
            <MinerCard
              key={miner.minerId}
              miner={miner}
              selected={selectedMiner?.minerId === miner.minerId}
              onSelect={() => setSelectedMiner(miner)}
            />
          ))}
          
          {(!miners || miners.length === 0) && !MOCK_MINERS.length && (
            <Card className="rounded-xl shadow-sm">
              <View className="p-4 items-center">
                <Typography variant="body" className="text-slate-500">
                  Loading available miners...
                </Typography>
              </View>
            </Card>
          )}
        </View>
        
        {/* Purchase Button */}
        {selectedMiner && (
          <View className="mx-4 mb-6 mt-2">
            <Button
              title={`Purchase ${selectedMiner.name} for $${selectedMiner.price} USDT`}
              onPress={handlePurchase}
              loading={purchasing}
              disabled={purchasing || (user?.balance || 0) < selectedMiner.price}
              className={`${(user?.balance || 0) < selectedMiner.price ? 'bg-blue-400' : 'bg-blue-600'} py-3 rounded-xl`}
            />
            
            {(user?.balance || 0) < selectedMiner.price && (
              <View className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Typography variant="caption" className="text-amber-700 text-center">
                  Insufficient balance. Please deposit more USDT to purchase this miner.
                </Typography>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MinerScreen;