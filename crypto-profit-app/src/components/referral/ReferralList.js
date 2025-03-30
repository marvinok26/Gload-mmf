// src/components/referral/ReferralList.js
import React from 'react';
import { View, FlatList } from 'react-native';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';

// src/components/referral/ReferralList.js (continued)
const ReferralItem = ({ referral }) => {
    const getStatusColor = () => {
      switch (referral.status) {
        case 'rewarded':
          return 'text-green-600';
        case 'active':
          return 'text-blue-600';
        default:
          return 'text-gray-600';
      }
    };
    
    const getStatusIcon = () => {
      switch (referral.status) {
        case 'rewarded':
          return <Ionicons name="checkmark-circle" size={16} color="#10B981" />;
        case 'active':
          return <Ionicons name="person" size={16} color="#3B82F6" />;
        default:
          return <Ionicons name="time-outline" size={16} color="#6B7280" />;
      }
    };
    
    return (
      <Card className="mb-2">
        <View className="p-3">
          <View className="flex-row justify-between items-center">
            <Typography variant="body" className="font-medium">{referral.name}</Typography>
            <View className="flex-row items-center">
              {getStatusIcon()}
              <Typography variant="caption" className={`ml-1 ${getStatusColor()}`}>
                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
              </Typography>
            </View>
          </View>
          
          <Typography variant="caption" className="text-gray-500 mt-1">
            Joined: {new Date(referral.date).toLocaleDateString()}
          </Typography>
          
          {referral.commission && (
            <Typography variant="caption" className="text-green-600 mt-1">
              Commission: {referral.commission.toFixed(2)} USDT
            </Typography>
          )}
        </View>
      </Card>
    );
  };
  
  const ReferralList = ({ referrals, loading }) => {
    if (loading) {
      return (
        <View className="p-4 items-center">
          <Typography>Loading referrals...</Typography>
        </View>
      );
    }
    
    if (!referrals || referrals.length === 0) {
      return (
        <View className="p-4 items-center">
          <Typography variant="body" className="text-gray-500 text-center">
            You haven't referred anyone yet. Share your referral code to start earning!
          </Typography>
        </View>
      );
    }
    
    return (
      <View className="w-full">
        <Typography variant="h3" className="mb-2">Your Referrals</Typography>
        
        <FlatList
          data={referrals}
          renderItem={({ item }) => <ReferralItem referral={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        />
      </View>
    );
  };
  
  export default ReferralList;