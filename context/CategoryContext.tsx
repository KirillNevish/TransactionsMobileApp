import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for category and transaction
interface Category {
    name: string;
    color: string;
    icon: any; // Replace 'any' with a more specific type if you have a type for icons
}

interface Transaction {
    category: string;
    paymentMethod: string;
    amount: number;
    date: string;
    note?: string;
    categoryIcon: any;
}

// Define the shape of the context value
interface CategoryContextType {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    getCategoryTransactionCount: (categoryName: string) => number;
    getTotalAmount: () => number;
    categoryTotals: Record<string, number>; // Added categoryTotals
    totalAmount: number; // Added totalAmount

}

// Create the context
export const CategoryContext = createContext<CategoryContextType | null>(null);

const CATEGORIES_STORAGE_KEY = 'user_categories';

export const ICONS = {
    villa: require('../assets/material-symbols_villa.png'),
    soccer: require('../assets/material-symbols_sports-soccer.png'),
    surfing: require('../assets/material-symbols_surfing-sharp.png'),
    drill: require('../assets/material-symbols_tools-power-drill.png'),
    tram: require('../assets/material-symbols_tram.png'),
    bedroom: require('../assets/material-symbols-light_bedroom-parent.png'),
    school: require('../assets/material-symbols_school-rounded.png'),
    meme: require('../assets/Meme.png'),
};


// Provider component
export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const calculateTransactionStats = (transactions: Transaction[]) => {
        const categoryTotals = transactions.reduce((acc, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
            return acc;
        }, {} as Record<string, number>);

        const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
        return { categoryTotals, totalAmount };
    };

    const loadCategories = async () => {
        try {
            const storedCategories = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
            if (storedCategories) {
                const parsedCategories = JSON.parse(storedCategories);

                // Map icon keys back to the actual icon resources
                const resolvedCategories = parsedCategories.map((cat: Category) => ({
                    ...cat,
                    icon: ICONS[cat.icon as keyof typeof ICONS], // Resolve icon from key
                }));

                setCategories(resolvedCategories);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    useEffect(() => {
        const { categoryTotals, totalAmount } = calculateTransactionStats(transactions);
        setCategoryTotals(categoryTotals);
        setTotalAmount(totalAmount);
    }, [transactions]);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const savedTransactions = await AsyncStorage.getItem("transactions");
                if (savedTransactions) {
                    setTransactions(JSON.parse(savedTransactions)); // Restore transactions
                }
            } catch (error) {
                console.error('Error loading transactions from AsyncStorage:', error);
            }
        };

        loadTransactions();
    }, []);

    useEffect(() => {
        loadCategories();
    }, []);

    const value: CategoryContextType = {
        categories,
        setCategories,
        transactions,
        setTransactions,
        categoryTotals,
        totalAmount,
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};

