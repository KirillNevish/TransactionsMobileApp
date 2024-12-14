
import Sidebar from './Sidebar';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CategoryContext } from '../context/CategoryContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBalance } from '../context/BalanceContext';


const NewTransaction = () => {
    const { categories, setCategories, transactions, setTransactions } = useContext(CategoryContext);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [note, setNote] = useState('');
    const navigation = useNavigation();
    const { cardBalance, setCardBalance, cashBalance, setCashBalance } = useBalance();

    const currentYear = new Date().getFullYear();

    const handleDateInput = (input) => {
        // Remove invalid characters, allowing only numbers and "-"
        let sanitizedInput = input.replace(/[^0-9\-]/g, '');

        // Ensure the format is maintained as "YYYY-MM-DD"
        const parts = sanitizedInput.split('-');

        // Validate each part
        if (parts.length > 3) return; // More than 3 parts is invalid

        let formattedDate = '';

        // Add year part (4 digits)
        if (parts[0]?.length <= 4) formattedDate += parts[0];
        if (parts[0]?.length === 4 && sanitizedInput.length > 4) formattedDate += '-';

        // Add month part (2 digits)
        if (parts[1]?.length <= 2) formattedDate += parts[1];
        if (parts[1]?.length === 2 && sanitizedInput.length > 7) formattedDate += '-';

        // Add day part (2 digits)
        if (parts[2]?.length <= 2) formattedDate += parts[2];

        // Restrict total length to 10 (YYYY-MM-DD)
        if (formattedDate.length > 10) return;

        // Update state
        setDate(formattedDate);
    };
    const handleAmountInput = (input) => {
        const numericInput = input.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal point
        setAmount(numericInput);
    };

    const handleSave = async () => {
        if (!selectedCategory || !amount || !date) {
            Alert.alert('Error', 'Please fill out all required fields.');
            return;
        }

        const selectedCategoryDetails = categories.find(cat => cat.name === selectedCategory);

        if (!selectedCategoryDetails) {
            Alert.alert('Error', 'Invalid category selected.');
            return;
        }

        console.log('Selected Category Details:', selectedCategoryDetails);

        const transactionAmount = parseFloat(amount);
        if (isNaN(transactionAmount) || transactionAmount <= 0) {
            Alert.alert('Error', 'Amount must be a positive number.');
            return;
        }
        const selectedCategoryIndex = categories.findIndex(cat => cat.name === selectedCategory);

        if (selectedCategoryIndex === -1) {
            Alert.alert('Error', 'Invalid category selected.');
            return;
        }

        const updatedCategories = [...categories];
        const updatedCategory = {
            ...updatedCategories[selectedCategoryIndex],
            totalAmount: (updatedCategories[selectedCategoryIndex].totalAmount || 0) + transactionAmount,
        };
        updatedCategories[selectedCategoryIndex] = updatedCategory;
        setCategories(updatedCategories);

        // Update Balance Context
        if (paymentMethod === 'Karta') {
            if (cardBalance - transactionAmount < 0) {
                Alert.alert('Error', 'Insufficient card balance.');
                return;
            }
            setCardBalance(cardBalance - transactionAmount);
        } else if (paymentMethod === 'Gotówka') {
            if (cashBalance - transactionAmount < 0) {
                Alert.alert('Error', 'Insufficient cash balance.');
                return;
            }
            setCashBalance(cashBalance - transactionAmount);
        }
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const newTransaction = {
            category: selectedCategory,
            color: selectedCategoryDetails.color,
            icon: selectedCategoryDetails.icon,
            paymentMethod,
            amount: transactionAmount,
            date: formattedDate,
            note,
        };


        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions); // Update context

        try {
            await AsyncStorage.multiSet([
                ['categories', JSON.stringify(updatedCategories)],
                ['transactions', JSON.stringify(updatedTransactions)],
            ]);

            Alert.alert('Success', 'Transaction saved!');
            navigation.navigate('TransactionsHistory');
        } catch (error) {
            console.error('Error saving transaction:', error);
            Alert.alert('Error', 'Failed to save the transaction.');
        }
    };

    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
            <View style={{ height: 120, backgroundColor: "#1C26FF", display: "flex", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline", paddingHorizontal: 20, marginTop: 20 }}>
                    <Image source={require('../assets/logoHeader.png')} style={styles.logo} />
                    <TouchableOpacity onPress={toggleSidebar}>
                        <Image source={require('../assets/Menu.png')} style={styles.menu} />
                    </TouchableOpacity>

                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View>
                    <Text style={styles.title}>Nowa transakcja</Text>
                </View>
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Kategoria</Text>

                {categories?.length > 0 ? (
                    <View style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 10,
                        padding: -50,
                        marginBottom: 20,
                    }}>
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                        >
                            {categories.map((cat, index) => (
                                <Picker.Item key={index} label={cat.name} value={cat.name} style={{ color: "#76787A" }} />
                            ))}
                        </Picker>
                    </View>
                ) : (
                    <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 20, }}>No categories available. Please add a category first.</Text>
                )}


                {/* Payment Method */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Gotówka Karta  </Text>
                <View style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    padding: -50,
                    marginBottom: 20,
                }}>
                    <Picker
                        selectedValue={paymentMethod}
                        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                    >

                        <Picker.Item label="Karta" value="Karta" style={{ color: "#76787A", }} />
                        <Picker.Item label="Gotówka" value="Gotówka" style={{ color: "#76787A", }} />

                    </Picker>
                </View>

                {/* Amount */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Kwota</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>zł</Text>
                    <TextInput
                        style={styles.numericInput}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={handleAmountInput}
                        placeholder="0"
                    />
                </View>

                {/* Date */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Data</Text>
                <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={handleDateInput}
                    placeholder={`${currentYear}-00-00`}
                    maxLength={11}
                />

                {/* Note */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Notatka (fakultatywny)</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 10,
                        padding: 10,
                    }}
                    value={note}
                    onChangeText={setNote}
                    placeholder="Informacje o zakupie"
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Zapisz</Text>
                </TouchableOpacity>
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontFamily: "Montserrat-Bold",
        fontWeight: 700,
        color: '#000',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: "#1C26FF",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
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
    iconScroll: {
        display: "flex",
        flexDirection: 'column'
    },
    numberColumn: {
        color: '#1C26FF',
        fontSize: 17,
        fontFamily: 'Montserrat-Bold',
        fontWeight: 700
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    currencySymbol: {
        fontSize: 16,
        color: '#76787A',
        marginRight: 5,
    },
    numericInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
});

export default NewTransaction;