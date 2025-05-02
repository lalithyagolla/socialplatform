import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

export type PointsActivity = 'watched' | 'shared' | 'comment' | 'save' | 'report' | 'purchase';

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  activity: PointsActivity;
  contentId?: string;
  contentTitle?: string;
  createdAt: string;
}

interface PointsContextType {
  points: number;
  transactions: PointsTransaction[];
  loadingPoints: boolean;
  errorPoints: string | null;
  earnPoints: (amount: number, activity: PointsActivity, contentId?: string) => Promise<void>;
  spendPoints: (amount: number, activity: PointsActivity, contentId?: string) => Promise<boolean>;
  fetchTransactions: () => Promise<void>;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [errorPoints, setErrorPoints] = useState<string | null>(null);

  const fetchPoints = async () => {
    if (!user) return;
    
    try {
      setLoadingPoints(true);
      const response = await api.get('/points/balance');
      setPoints(response.data.balance);
    } catch (err) {
      console.error('Failed to fetch points:', err);
      setErrorPoints('Failed to load your credit points.');
    } finally {
      setLoadingPoints(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setLoadingPoints(true);
      const response = await api.get('/points/transactions');
      setTransactions(response.data.transactions);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setErrorPoints('Failed to load your transaction history.');
    } finally {
      setLoadingPoints(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPoints();
    } else {
      setPoints(0);
      setTransactions([]);
    }
  }, [user]);

  const earnPoints = async (amount: number, activity: PointsActivity, contentId?: string) => {
    if (!user) return;
    
    try {
      setLoadingPoints(true);
      const response = await api.post('/points/earn', { amount, activity, contentId });
      setPoints(response.data.newBalance);
      await fetchTransactions();
    } catch (err) {
      console.error('Failed to earn points:', err);
      setErrorPoints('Failed to earn points. Please try again.');
    } finally {
      setLoadingPoints(false);
    }
  };

  const spendPoints = async (amount: number, activity: PointsActivity, contentId?: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setLoadingPoints(true);
      
      if (points < amount) {
        setErrorPoints('Not enough points for this action.');
        return false;
      }
      
      const response = await api.post('/points/spend', { amount, activity, contentId });
      setPoints(response.data.newBalance);
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error('Failed to spend points:', err);
      setErrorPoints('Failed to spend points. Please try again.');
      return false;
    } finally {
      setLoadingPoints(false);
    }
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        transactions,
        loadingPoints,
        errorPoints,
        earnPoints,
        spendPoints,
        fetchTransactions
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};