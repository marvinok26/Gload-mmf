// src/hooks/useMiner.js
import { useContext } from 'react';
import { MinerContext } from '../context/MinerContext';

export const useMiner = () => {
  const context = useContext(MinerContext);
  
  if (!context) {
    throw new Error('useMiner must be used within a MinerProvider');
  }
  
  return context;
};