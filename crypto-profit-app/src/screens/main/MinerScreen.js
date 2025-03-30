// src/screens/main/MinerScreen.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useMiner } from '../../hooks/useMiner';
import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import MinerCard from '../../components/miner/MinerCard';
import MinerStatusIndicator from '../../components/miner/MinerStatusIndicator';

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadMiners(),
      loadUserMiners()
    ]);
  };

  const handlePurchase = async () => {
    if (!selectedMiner) return;
    
    setPurchasing(true);
    try {
      const result = await purchaseMiner(selectedMiner.minerId, selectedMiner.price);
      
      if (result.success) {
        setSelectedMiner(null);
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
      await toggleMinerStatus(userMinerId, active);
    } catch (error) {
      console.error('Error toggling miner status:', error);
      Alert.alert('Error', 'Failed to update miner status');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
        </View>
        
        {/* User's Miners */}
        <View className="mx-3 mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Typography variant="h2" className="text-base font-semibold">Your Miners</Typography>
            <Typography variant="body" className="text-xs text-slate-500">
              Active: {userMiners?.filter(m => m.isActive).length || 0}/{userMiners?.length || 0}
            </Typography>
          </View>
          
          {userMiners?.length > 0 ? (
            userMiners.map((miner) => (
              <Card key={miner.id} className="mb-2 rounded-lg shadow-sm">
                <View className="p-3">
                  <View className="flex-row justify-between items-center">
                    <Typography variant="h3" className="text-sm font-semibold">{miner.name}</Typography>
                    <MinerStatusIndicator active={miner.isActive} />
                  </View>
                  
                  <View className="flex-row justify-between items-center mt-1">
                    <Typography variant="caption" className="text-slate-600 text-xs">
                      Profit: {miner.dailyProfit?.toFixed(2) || '0.00'}/day
                    </Typography>
                    <Button
                      title={miner.isActive ? "Off" : "On"}
                      variant={miner.isActive ? "secondary" : "primary"}
                      onPress={() => handleToggleMiner(miner.id, !miner.isActive)}
                      className={`py-1 px-3 ${miner.isActive ? "bg-slate-200" : "bg-blue-600"}`}
                    />
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <Card className="rounded-lg shadow-sm">
              <View className="p-3 items-center">
                <Typography variant="body" className="text-slate-500 text-sm">
                  No miners yet
                </Typography>
              </View>
            </Card>
          )}
        </View>
        
        {/* Available Miners */}
        <View className="mx-3 mb-3">
          <Typography variant="h2" className="text-base font-semibold mb-2">Available Miners</Typography>
          
          {miners?.length > 0 ? (
            miners.map((miner) => (
              <TouchableOpacity 
                key={miner.minerId} 
                onPress={() => setSelectedMiner(miner)}
                activeOpacity={0.7}
                className="mb-2"
              >
                <Card className={`rounded-lg shadow-sm ${selectedMiner?.minerId === miner.minerId ? "border-2 border-blue-500" : "border border-slate-100"}`}>
                  <View className="p-3">
                    <View className="flex-row justify-between items-center">
                      <Typography variant="h3" className="text-sm font-semibold">{miner.name}</Typography>
                      <Typography variant="h3" className="text-blue-700 font-semibold">{miner.price} USDT</Typography>
                    </View>
                    
                    <View className="flex-row justify-between items-center mt-1">
                      <Typography variant="caption" className="text-slate-600 text-xs">
                        Profit rate: {(miner.profitRate * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" className="text-green-600 text-xs">
                        Est. {(miner.price * miner.profitRate).toFixed(2)}/day
                      </Typography>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card className="rounded-lg shadow-sm">
              <View className="p-3 items-center">
                <Typography variant="body" className="text-slate-500 text-sm">
                  Loading miners...
                </Typography>
              </View>
            </Card>
          )}
        </View>
        
        {/* Purchase Button */}
        {selectedMiner && (
          <View className="mx-3 mb-3">
            <Button
              title={`Purchase ${selectedMiner.name} for ${selectedMiner.price} USDT`}
              onPress={handlePurchase}
              loading={purchasing}
              disabled={purchasing || (user?.balance || 0) < selectedMiner.price}
              className={`${(user?.balance || 0) < selectedMiner.price ? 'bg-blue-400' : 'bg-blue-600'} rounded-lg`}
            />
            
            {(user?.balance || 0) < selectedMiner.price && (
              <Typography variant="caption" className="text-red-500 text-center mt-1 text-xs">
                Insufficient balance
              </Typography>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MinerScreen;