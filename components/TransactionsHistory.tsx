import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from './Sidebar';
import { CategoryContext } from '../context/CategoryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useBalance } from '../context/BalanceContext';
import EditTransactionForm from './EditTransactionForm';


const TransactionsHistory = () => {
    const { transactions, setTransactions } = useContext(CategoryContext);
    const navigation = useNavigation();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const { cardBalance, setCardBalance, cashBalance, setCashBalance } = useBalance();
    const [editingTransaction, setEditingTransaction] = useState(null); // To track the transaction being edited
    const [modalVisible, setModalVisible] = useState(false);


    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    // Save transactions when they change
    useEffect(() => {
        const saveTransactionsToStorage = async () => {
            try {
                await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
            } catch (error) {
                console.error('Error saving transactions to AsyncStorage:', error);
            }
        };

        if (transactions) {
            saveTransactionsToStorage();
        }
    }, [transactions]);

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setModalVisible(true);
    };

    // Save updated transaction
    const saveUpdatedTransaction = async (updatedTransaction) => {
        const updatedTransactions = transactions.map((transaction) =>
            transaction === editingTransaction ? updatedTransaction : transaction
        );

        setTransactions(updatedTransactions);
        setModalVisible(false);
        setEditingTransaction(null);

        try {
            await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        } catch (error) {
            console.error('Error saving transactions to AsyncStorage:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
            <View style={{ height: 120, backgroundColor: "#1C26FF", display: "flex", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginTop: 40 }}>
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                        onPress={() => navigation.navigate('Homepage')}
                    >

                        <Image source={require('../assets/rightArrow.png')} style={{}} />
                        <Text style={{ color: "#fff", fontSize: 15, marginLeft: 10 }}>Strona główna</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleSidebar}>
                        <Image source={require('../assets/Menu.png')} style={styles.menu} />
                    </TouchableOpacity>

                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View>
                    <Text style={styles.title}>Тransakcji <Text style={{
                        fontSize: 24,
                        fontFamily: "Montserrat-Light",
                        fontWeight: 'light',
                        color: '#000',
                        marginBottom: 10
                    }}>historia</Text></Text>
                </View>
                <View style={{ display: "flex", flexDirection: "column", gap: 15 }}>

                    {/* Transactions List */}
                    {transactions?.length > 0 ? (
                        [...transactions].reverse().map((transaction, index) => (
                            <Swipeable
                                key={index}
                                renderRightActions={() => (
                                    <TouchableOpacity style={{ bottom: -15, marginLeft: 5 }} onPress={() => handleEditTransaction(transaction)}>
                                        <Image
                                            source={require('../assets/EditButton.png')}
                                            style={{ width: 40, height: 40 }}
                                        />
                                    </TouchableOpacity>
                                )}
                            >
                                <View key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: '#F3F3F3', borderRadius: 12, padding: 15 }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <View style={[styles.transactionCard, { backgroundColor: transaction.color }]} >
                                            <Image
                                                source={transaction.icon} // Use the saved icon directly

                                            />
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "column", marginLeft: 12 }}>
                                            <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{transaction.category}</Text>
                                            <Text style={{ color: "#A3A3A3", fontSize: 12, fontFamily: 'Montserrat-Bold' }}>{transaction.note || "No note"}</Text>
                                        </View>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                        <Text style={{ color: "red", fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>-zł{transaction.amount.toFixed(2)}</Text>
                                        <Text style={{ color: "#A3A3A3", fontSize: 12, fontFamily: 'Montserrat-Bold' }}>{transaction.date}</Text>
                                    </View>
                                </View>
                            </Swipeable>
                        ))
                    ) : (
                        <Text style={{ textAlign: "center", marginTop: 20, color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light' }}>No transactions yet.</Text>
                    )}


                </View>
            </ScrollView>
            {/* Modal for editing */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <EditTransactionForm
                    transaction={editingTransaction}
                    onSave={saveUpdatedTransaction}
                    onCancel={() => setModalVisible(false)}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    transactionCard: {
        borderRadius: 12,
        width: 40,
        height: 40,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"

    },
    balanceTitle: {
        color: "#A3A3A3",
        fontSize: 18,
    },
    balanceValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#1C26FF",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logo: {
        width: 47,
        height: 32,
        color: '#FFFFFF',
    },
    menu: {
        width: 30,
        height: 20,
    },
});

export default TransactionsHistory;