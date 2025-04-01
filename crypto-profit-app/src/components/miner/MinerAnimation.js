// src/components/miner/MinerAnimation.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../ui/Typography';

const MinerAnimation = ({ active = true, tier = 'basic' }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const particleAnim3 = useRef(new Animated.Value(0)).current;
  
  // Get tier-based colors
  const getTierColors = () => {
    if (tier === 'basic') {
      return {
        primary: '#3B82F6', // blue-500
        secondary: '#93C5FD', // blue-300
        tertiary: '#DBEAFE', // blue-100
        icon: '#FFFFFF' // white
      };
    } else if (tier === 'advanced') {
      return {
        primary: '#8B5CF6', // purple-500
        secondary: '#C4B5FD', // purple-300
        tertiary: '#EDE9FE', // purple-100
        icon: '#FFFFFF' // white
      };
    } else {
      return {
        primary: '#F59E0B', // amber-500
        secondary: '#FCD34D', // amber-300
        tertiary: '#FEF3C7', // amber-100
        icon: '#FFFFFF' // white
      };
    }
  };
  
  const colors = getTierColors();
  
  useEffect(() => {
    if (active) {
      startAnimations();
    } else {
      stopAnimations();
    }
    
    return () => {
      stopAnimations();
    };
  }, [active]);
  
  const startAnimations = () => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();
    
    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    
    // Particle animations
    animateParticle(particleAnim1, 0);
    animateParticle(particleAnim2, 500);
    animateParticle(particleAnim3, 1000);
  };

  const animateParticle = (anim, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();
  };
  
  const stopAnimations = () => {
    pulseAnim.stopAnimation();
    rotateAnim.stopAnimation();
    particleAnim1.stopAnimation();
    particleAnim2.stopAnimation();
    particleAnim3.stopAnimation();
  };
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  const getParticleColor = (index) => {
    if (index === 0) return colors.secondary;
    if (index === 1) return colors.tertiary;
    return colors.primary;
  };
  
  return (
    <View className="items-center justify-center h-40 relative">
      {/* Mining glow effect (when active) */}
      {active && (
        <View className="absolute w-32 h-32 rounded-full opacity-30" 
              style={{ backgroundColor: colors.tertiary }} />
      )}
      
      {/* Main miner */}
      <Animated.View 
        style={{ 
          transform: [
            { scale: pulseAnim },
            { rotate }
          ]
        }}
        className="items-center justify-center z-10"
      >
        <View className="w-24 h-24 rounded-xl items-center justify-center shadow-md"
              style={{ backgroundColor: colors.primary }}>
          <Ionicons name="server" size={42} color={colors.icon} />
        </View>
      </Animated.View>
      
      {/* Particles */}
      {active && (
        <>
          <Animated.View
            style={{
              position: 'absolute',
              opacity: particleAnim1.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
              transform: [
                { 
                  translateY: particleAnim1.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [0, -50] 
                  }) 
                },
                { 
                  translateX: particleAnim1.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [0, 30] 
                  }) 
                },
                { scale: particleAnim1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.5] }) }
              ]
            }}
          >
            <View className="w-4 h-4 rounded-full" style={{ backgroundColor: getParticleColor(0) }} />
          </Animated.View>
          
          <Animated.View
            style={{
              position: 'absolute',
              opacity: particleAnim2.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
              transform: [
                { 
                  translateY: particleAnim2.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [0, -40] 
                  }) 
                },
                { 
                  translateX: particleAnim2.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [0, -20] 
                  }) 
                },
                { scale: particleAnim2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.5] }) }
              ]
            }}
          >
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: getParticleColor(1) }} />
          </Animated.View>
          
          <Animated.View
            style={{
              position: 'absolute',
              opacity: particleAnim3.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
              transform: [
                { 
                  translateY: particleAnim3.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [0, -30] 
                  }) 
                },
                { 
                  translateX: particleAnim3.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [0, 10] 
                  }) 
                },
                { scale: particleAnim3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.5] }) }
              ]
            }}
          >
            <View className="w-5 h-5 rounded-full" style={{ backgroundColor: getParticleColor(2) }} />
          </Animated.View>
        </>
      )}
      
      <View className="mt-4">
        <Typography variant="caption" className={active ? 'text-green-600 font-semibold' : 'text-gray-500'}>
          {active ? 'Mining in progress' : 'Mining inactive'}
        </Typography>
      </View>
    </View>
  );
};

export default MinerAnimation;