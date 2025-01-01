import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type BalanceContextType = {
    cardBalance: number;
    setCardBalance: (value: number) => void;
    cashBalance: number;
    setCashBalance: (value: number) => void;
    loadData: () => Promise<void>;
};

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
    const [cardBalance, setCardBalanceState] = useState<number>(0);
    const [cashBalance, setCashBalanceState] = useState<number>(0);

    const saveData = useCallback(async (newCardBalance: number, newCashBalance: number) => {
        try {
            const balanceData = { cardBalance: newCardBalance, cashBalance: newCashBalance };
            await AsyncStorage.setItem('totalBalanceData', JSON.stringify(balanceData));
        } catch (error) {
            Alert.alert('Error', 'Failed to save balance data.');
        }
    }, []);

    const setCardBalance = (value: number) => {
        setCardBalanceState(value);
        saveData(value, cashBalance);
    };

    const setCashBalance = (value: number) => {
        setCashBalanceState(value);
        saveData(cardBalance, value);
    };

    const loadData = useCallback(async () => {
        try {
            const storedData = await AsyncStorage.getItem('totalBalanceData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setCardBalanceState(parsedData.cardBalance || 0);
                setCashBalanceState(parsedData.cashBalance || 0);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load balance data.');
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <BalanceContext.Provider value={{ cardBalance, setCardBalance, cashBalance, setCashBalance, loadData }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalance = () => {
    const context = useContext(BalanceContext);
    if (!context) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
};






