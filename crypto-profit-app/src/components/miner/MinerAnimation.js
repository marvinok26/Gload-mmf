// src/components/miner/MinerAnimation.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../ui/Typography';

const MinerAnimation = ({ active = true }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const particleAnim3 = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (active) {
      startAnimations();
    } else {
      stopAnimations();
    }
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
  
  return (
    <View className="items-center justify-center h-40">
      {/* Main miner */}
      <Animated.View 
        style={{ 
          transform: [
            { scale: pulseAnim },
            { rotate }
          ]
        }}
        className="items-center justify-center"
      >
        <View className="bg-blue-500 w-20 h-20 rounded-lg items-center justify-center">
          <Ionicons name="server" size={36} color="#FFFFFF" />
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
            <View className="w-3 h-3 rounded-full bg-yellow-400" />
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
            <View className="w-3 h-3 rounded-full bg-green-400" />
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
            <View className="w-3 h-3 rounded-full bg-blue-400" />
          </Animated.View>
        </>
      )}
      
      <View className="mt-4">
        <Typography variant="caption" className={active ? 'text-green-600' : 'text-gray-500'}>
          {active ? 'Mining in progress' : 'Mining inactive'}
        </Typography>
      </View>
    </View>
  );
};

export default MinerAnimation;