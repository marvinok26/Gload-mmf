// src/screens/common/OnboardingScreen.js
import React, { useState, useRef } from 'react';
import { View, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import { STORAGE_KEYS } from '../../constants/app.constants';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Crypto Profit App',
    description: 'Start earning daily profits with our crypto mining platform',
    image: require('../../assets/images/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Purchase Miners',
    description: 'Buy miners to start generating daily profits automatically',
    image: require('../../assets/images/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Invite Friends',
    description: 'Share your referral code and earn commissions from your network',
    image: require('../../assets/images/onboarding3.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentIndex + 1;
    if (nextSlideIndex < slides.length) {
      slidesRef.current.scrollToIndex({ index: nextSlideIndex });
      setCurrentIndex(nextSlideIndex);
    }
  };

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const renderSlide = ({ item }) => {
    return (
      <View className="w-screen items-center justify-center px-6">
        <Image 
          source={item.image} 
          className="w-3/4 h-60"
          resizeMode="contain"
        />
        <View className="mt-8">
          <Typography variant="h1" className="text-center mb-4">{item.title}</Typography>
          <Typography variant="body" className="text-center text-gray-500">{item.description}</Typography>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Skip button */}
        <View className="absolute right-6 top-6 z-10">
          <TouchableOpacity onPress={finishOnboarding}>
            <Typography className="text-gray-500">Skip</Typography>
          </TouchableOpacity>
        </View>
        
        {/* Slides */}
        <FlatList
          ref={slidesRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={updateCurrentSlideIndex}
        />
        
        {/* Indicator and buttons */}
        <View className="mb-12 mx-6">
          {/* Indicator */}
          <View className="flex-row justify-center mb-8">
            {slides.map((_, index) => (
              <View 
                key={index} 
                className={`h-2 w-2 rounded-full mx-1 ${
                  currentIndex === index ? 'bg-blue-600 w-4' : 'bg-gray-300'
                }`} 
              />
            ))}
          </View>
          
          {/* Buttons */}
          {currentIndex === slides.length - 1 ? (
            <Button
              title="Get Started"
              onPress={finishOnboarding}
            />
          ) : (
            <Button
              title="Next"
              onPress={goToNextSlide}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;