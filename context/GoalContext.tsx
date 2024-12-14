import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for the goal data
interface GoalData {
    accumulation: string;
    goalAmount: number;
    startDate: any;
    finishDate: any;
    goalNote: string;
    currentProgress: number;
}

const initialGoalData: GoalData = {
    accumulation: '',
    goalAmount: 0,
    startDate: '',
    finishDate: '',
    goalNote: '',
    currentProgress: 0,
};


// Define the type for the context
interface GoalContextType {
    goalData: GoalData | null;
    setGoalData: React.Dispatch<React.SetStateAction<GoalData | null>>;
}

// Create the context with a default value
export const GoalContext = createContext<GoalContextType | undefined>(undefined);

// Define props for the provider component
interface GoalProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = '@goal_data';

// Create the provider component
export const GoalProvider: React.FC<GoalProviderProps> = ({ children }) => {
    const [goalData, setGoalData] = useState<GoalData | null>(null);

    const resetGoal = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setGoalData(null);
        } catch (error) {
            console.error('Failed to reset goal data:', error);
        }
    };

    useEffect(() => {
        const loadGoalData = async () => {
            try {
                const storedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);

                    // Validate data (e.g., ensure the finish date hasn't passed)
                    const now = new Date();
                    const finishDate = new Date(parsedData.finishDate);
                    if (parsedData.currentProgress >= parsedData.goalAmount || finishDate < now) {
                        // Goal is either completed or expired; clear storage
                        await AsyncStorage.removeItem(STORAGE_KEY);
                    } else {
                        setGoalData(parsedData);
                    }
                }
            } catch (error) {
                console.error('Failed to load goal data from AsyncStorage:', error);
            }
        };
        loadGoalData();
    }, []);

    // Save goal data to AsyncStorage whenever it changes
    useEffect(() => {
        const saveGoalData = async () => {
            if (goalData) {
                try {
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goalData));
                } catch (error) {
                    console.error('Failed to save goal data to AsyncStorage:', error);
                }
            }
        };
        saveGoalData();
    }, [goalData]);

    return (
        <GoalContext.Provider value={{ goalData, setGoalData, resetGoal }}>
            {children}
        </GoalContext.Provider>
    );
};