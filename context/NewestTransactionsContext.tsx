import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { CategoryContext } from './CategoryContext'; // Assuming this contains the full transactions list

// Define the transaction type
interface Transaction {
    id: number; // Assuming transactions have an ID
    category: string;
    note?: string;
    amount: number;
    color: string;
    icon: any; // Replace with the specific type for your icons if available
    date: string;
}

// Define the context value type
interface NewestTransactionsContextType {
    newestTransactions: Transaction[];
}

// Define props for the provider component
interface NewestTransactionsProviderProps {
    children: ReactNode;
}

// Create the context
export const NewestTransactionsContext = createContext<NewestTransactionsContextType | undefined>(undefined);

// Provider component
export const NewestTransactionsProvider: React.FC<NewestTransactionsProviderProps> = ({ children }) => {
    const { transactions } = useContext(CategoryContext) as { transactions: Transaction[] }; // Ensure transactions are correctly typed
    const [newestTransactions, setNewestTransactions] = useState<Transaction[]>([]);

    // Update the newest transactions whenever transactions change
    useEffect(() => {
        if (transactions?.length > 0) {
            const latestTwo = transactions.slice(-2).reverse(); // Get the last two transactions, newest first
            setNewestTransactions(latestTwo);
        }
    }, [transactions]);

    return (
        <NewestTransactionsContext.Provider value={{ newestTransactions }}>
            {children}
        </NewestTransactionsContext.Provider>
    );
};

// Custom hook for easier context usage
export const useNewestTransactions = (): NewestTransactionsContextType => {
    const context = useContext(NewestTransactionsContext);
    if (!context) {
        throw new Error('useNewestTransactions must be used within a NewestTransactionsProvider');
    }
    return context;
};