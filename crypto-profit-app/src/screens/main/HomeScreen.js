// src/screens/main/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useMiner } from '../../hooks/useMiner';
import Typography from '../../components/ui/Typography';
import Card from '../../components/ui/Card';
import MinerAnimation from '../../components/miner/MinerAnimation';
import ProfitCounter from '../../components/miner/ProfitCounter';
import BalanceDisplay from '../../components/wallet/BalanceDisplay';
import api from '../../services/api.service';
import Button from '../../components/ui/Button';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, refreshUserData } = useAuth();
    const { activeMiners, totalMiningPower, loadUserMiners } = useMiner();
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
      todayProfit: 0,
      yesterdayProfit: 0,
      weeklyProfit: 0,
      activeMiners: 0,
    });
  
    useEffect(() => {
      loadData();
    }, []);
  
    const loadData = async () => {
      try {
        const response = await api.get('/api/user/stats');
        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
  
    const onRefresh = async () => {
      setRefreshing(true);
      try {
        await Promise.all([
          refreshUserData(),
          loadUserMiners(),
          loadData(),
        ]);
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
          <View className="px-4 pt-4 pb-3 bg-blue-600">
            <Typography variant="h1" className="text-white text-xl font-bold">Mining Dashboard</Typography>
          </View>
          
          {/* Balance and Stats */}
          <View className="mx-3 -mt-2 z-10">
            <Card className="mb-3 rounded-lg shadow-sm">
              <View className="p-3">
                <BalanceDisplay 
                  balance={user?.balance || 0}
                  todayProfit={stats.todayProfit}
                />
              </View>
            </Card>
          </View>
          
          {/* Stats Cards */}
          <View className="flex-row mx-3 mb-3">
            <View className="flex-1 mr-2">
              <Card className="rounded-lg shadow-sm">
                <View className="p-3 items-center">
                  <Typography variant="label" className="text-slate-500 text-xs">Active Miners</Typography>
                  <Typography variant="h2" className="text-xl font-bold">{activeMiners?.length || 0}</Typography>
                </View>
              </Card>
            </View>
            <View className="flex-1 ml-2">
              <Card className="rounded-lg shadow-sm">
                <View className="p-3 items-center">
                  <Typography variant="label" className="text-slate-500 text-xs">Total Profit</Typography>
                  <Typography variant="h2" className="text-xl font-bold">{user?.totalProfit?.toFixed(2) || '0.00'}</Typography>
                </View>
              </Card>
            </View>
          </View>
          
          {/* Mining Animation */}
          <View className="mx-3 mb-3">
            <Card className="rounded-lg shadow-sm">
              <View className="p-3">
                <Typography variant="h2" className="text-base font-semibold">Mining Status</Typography>
                <View className="py-2 items-center">
                  <MinerAnimation active={activeMiners?.length > 0} />
                </View>
                <ProfitCounter 
                  profit={stats.todayProfit} 
                  miningPower={totalMiningPower || 0}
                />
              </View>
            </Card>
          </View>
          
          {/* Weekly Performance - Simplified */}
          <View className="mx-3 mb-3">
            <Card className="rounded-lg shadow-sm">
              <View className="p-3">
                <Typography variant="h2" className="text-base font-semibold mb-2">Performance</Typography>
                
                <View className="flex-row justify-between items-center">
                  <Typography variant="caption" className="text-slate-500">Yesterday</Typography>
                  <Typography variant="body" className="text-green-600 font-medium">
                    +{stats.yesterdayProfit?.toFixed(2) || '0.00'}
                  </Typography>
                </View>
                
                <View className="flex-row justify-between items-center mt-1">
                  <Typography variant="caption" className="text-slate-500">This Week</Typography>
                  <Typography variant="body" className="text-green-600 font-medium">
                    +{stats.weeklyProfit?.toFixed(2) || '0.00'}
                  </Typography>
                </View>
              </View>
            </Card>
          </View>
          
          {/* CTA Card - Only shown when needed */}
          {activeMiners?.length === 0 && (
            <View className="mx-3 mb-3">
              <Card className="bg-blue-50 border border-blue-200 rounded-lg">
                <View className="p-3">
                  <Typography variant="h3" className="text-blue-800 font-semibold text-sm">
                    Start Mining Today!
                  </Typography>
                  <Button
                    title="Get Your First Miner"
                    onPress={() => navigation.navigate('miner')}
                    className="mt-2"
                  />
                </View>
              </Card>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default HomeScreen;