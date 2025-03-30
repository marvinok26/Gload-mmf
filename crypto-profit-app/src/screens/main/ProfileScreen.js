// src/screens/main/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DepositAddress from '../../components/wallet/DepositAddress';
import WithdrawForm from '../../components/wallet/WithdrawForm';
import ReferralCode from '../../components/referral/ReferralCode';
import ReferralList from '../../components/referral/ReferralList';
import api from '../../services/api.service';
import { TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
  const { user, refreshUserData, logout } = useAuth();
  const { depositAddress, refreshDepositAddress } = useWallet();
  const [refreshing, setRefreshing] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0
  });
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet'); // wallet, referral, settings

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const response = await api.get('/api/referrals/info');
      
      if (response.success) {
        setReferralStats(response.statistics);
      }
      
      const listResponse = await api.get('/api/referrals/list');
      if (listResponse.success) {
        setReferrals(listResponse.referrals);
      }
    } catch (error) {
      console.error('Failed to load referral data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshUserData(),
        refreshDepositAddress(),
        loadReferralData()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const renderWalletTab = () => (
    <>
      {/* Balance Card */}
      <Card className="mb-3 rounded-lg shadow-sm">
        <View className="p-3">
          <Typography variant="label" className="text-slate-500 text-xs">
            Available Balance
          </Typography>
          <Typography className="text-xl font-bold text-slate-800 mb-2">
            {user?.balance?.toFixed(2) || '0.00'} USDT
          </Typography>
          
          <View className="flex-row">
            <Button
              title="Deposit"
              variant="primary"
              onPress={() => setShowWithdrawForm(false)}
              className="flex-1 mr-1 bg-blue-600 py-1"
            />
            <Button
              title="Withdraw"
              variant="outline"
              onPress={() => setShowWithdrawForm(true)}
              className="flex-1 ml-1 border border-slate-300 py-1"
            />
          </View>
        </View>
      </Card>
      
      {/* Deposit or Withdraw Form */}
      <Card className="rounded-lg shadow-sm">
        <View className="p-3">
          {showWithdrawForm ? (
            <>
              <Typography variant="h3" className="text-sm font-semibold mb-2">Withdraw Funds</Typography>
              <WithdrawForm onSuccess={() => setShowWithdrawForm(false)} />
            </>
          ) : (
            <>
              <Typography variant="h3" className="text-sm font-semibold mb-2">Deposit Address</Typography>
              <DepositAddress address={depositAddress} />
            </>
          )}
        </View>
      </Card>
    </>
  );

  const renderReferralTab = () => (
    <>
      {/* Referral Code */}
      <Card className="mb-3 rounded-lg shadow-sm">
        <View className="p-3">
          <Typography variant="h3" className="text-sm font-semibold mb-2">Your Referral Code</Typography>
          <ReferralCode 
            code={user?.referralCode} 
            totalReferrals={referralStats.totalReferrals}
            totalEarnings={referralStats.totalEarnings}
          />
        </View>
      </Card>
      
      {/* Referrals List - Compact */}
      <Card className="rounded-lg shadow-sm">
        <View className="p-3">
          <Typography variant="h3" className="text-sm font-semibold mb-2">Your Referrals</Typography>
          <ReferralList referrals={referrals} loading={refreshing} compact={true} />
        </View>
      </Card>
    </>
  );

  const renderSettingsTab = () => (
    <>
      <Card className="mb-3 rounded-lg shadow-sm">
        <View className="p-3">
          <Typography variant="h3" className="text-sm font-semibold mb-2">Account Settings</Typography>
          
          <Button
            title="Edit Profile"
            variant="outline"
            className="mb-2 border border-slate-300 py-1"
          />
          <Button
            title="Security Settings"
            variant="outline"
            className="mb-2 border border-slate-300 py-1"
          />
          <Button
            title="Logout"
            variant="secondary"
            onPress={handleLogout}
            className="bg-red-500 py-1"
          />
        </View>
      </Card>
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with User Info */}
        <View className="px-4 pt-4 pb-2 bg-blue-600">
          <Typography variant="h1" className="text-white text-xl font-bold">{user?.name || 'User'}</Typography>
          <Typography variant="body" className="text-white text-opacity-90 text-xs">
            {user?.email || 'Loading...'}
          </Typography>
        </View>
        
        {/* Tab Navigation */}
        <View className="flex-row mx-3 mt-2 mb-3 bg-white rounded-lg overflow-hidden">
          <TouchableOpacity 
            className={`flex-1 py-2 px-2 items-center ${activeTab === 'wallet' ? 'bg-blue-600' : 'bg-white'}`}
            onPress={() => setActiveTab('wallet')}
          >
            <Typography className={`text-xs font-medium ${activeTab === 'wallet' ? 'text-white' : 'text-slate-600'}`}>
              Wallet
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 px-2 items-center ${activeTab === 'referral' ? 'bg-blue-600' : 'bg-white'}`}
            onPress={() => setActiveTab('referral')}
          >
            <Typography className={`text-xs font-medium ${activeTab === 'referral' ? 'text-white' : 'text-slate-600'}`}>
              Referrals
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 px-2 items-center ${activeTab === 'settings' ? 'bg-blue-600' : 'bg-white'}`}
            onPress={() => setActiveTab('settings')}
          >
            <Typography className={`text-xs font-medium ${activeTab === 'settings' ? 'text-white' : 'text-slate-600'}`}>
              Settings
            </Typography>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <View className="mx-3 mb-3">
          {activeTab === 'wallet' && renderWalletTab()}
          {activeTab === 'referral' && renderReferralTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;