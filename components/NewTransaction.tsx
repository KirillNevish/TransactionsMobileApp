
import Sidebar from './Sidebar';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CategoryContext } from '../context/CategoryContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBalance } from '../context/BalanceContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';


const NewTransaction = () => {
    const { categories, setCategories, transactions, setTransactions } = useContext(CategoryContext);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [note, setNote] = useState('');
    const navigation = useNavigation();
    const { cardBalance, setCardBalance, cashBalance, setCashBalance } = useBalance();
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const { translations } = useLanguage();
    const { theme } = useTheme();

    const isDarkMode = theme === 'dark';

    const handleConfirmDate = (date) => {
        setDate(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        setDatePickerVisible(false);
    };


    const currentYear = new Date().getFullYear();

    const handleAmountInput = (input) => {
        const numericInput = input.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal point
        setAmount(numericInput);
    };

    const handleSave = async () => {
        if (!selectedCategory || !amount || !date) {
            Alert.alert('Error', `${translations.allFieldAreRequiredError}`);
            return;
        }

        const selectedCategoryDetails = categories.find(cat => cat.name === selectedCategory);

        if (!selectedCategoryDetails) {
            Alert.alert('Error', `${translations.invalidCategoryError}`);
            return;
        }

        console.log('Selected Category Details:', selectedCategoryDetails);

        const transactionAmount = parseFloat(amount);
        if (isNaN(transactionAmount) || transactionAmount <= 0) {
            Alert.alert('Error', `${translations.amountNotPositiveError}`);
            return;
        }
        const selectedCategoryIndex = categories.findIndex(cat => cat.name === selectedCategory);

        if (selectedCategoryIndex === -1) {
            Alert.alert('Error', `${translations.invalidCategoryError}`);
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
                Alert.alert('Error', `${translations.insufficientCardBalanceError}`);
                return;
            }
            setCardBalance(cardBalance - transactionAmount);
        } else if (paymentMethod === 'Gotówka') {
            if (cashBalance - transactionAmount < 0) {
                Alert.alert('Error', `${translations.insufficientCashBalanceError}`);
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
            navigation.navigate('TransactionsHistory');
        } catch (error) {
            console.error('Error saving transaction:', error);
            Alert.alert('Error', `${translations.failedToSaveTransactionError}`);
        }
    };

    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#112540' : '#fff', }}>
            <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
            <View style={{ height: 120, backgroundColor: isDarkMode ? '#10CDFC' : '#1C26FF', display: "flex", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline", paddingHorizontal: 20, marginTop: 20 }}>
                    <Image source={require('../assets/logoHeader.png')} style={[styles.logo, isDarkMode
                        ? { tintColor: '#112540' }
                        : { tintColor: '#fff' }]} />
                    <TouchableOpacity onPress={toggleSidebar}>
                        <Image source={require('../assets/Menu.png')} style={[styles.menu, isDarkMode
                            ? { tintColor: '#112540' }
                            : { tintColor: '#fff' }]} />
                    </TouchableOpacity>

                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, isDarkMode
                ? { backgroundColor: '#112540' }
                : { backgroundColor: '#fff' }]}>
                <View>
                    <Text style={[styles.title, isDarkMode
                        ? { color: '#fff' }
                        : { color: '#000' }]}>{translations.newTransaction}</Text>
                </View>
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.category}</Text>

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
                    <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 20, }}>{translations.noCategoriesText}</Text>
                )}


                {/* Payment Method */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.cardOrCash}</Text>
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

                        <Picker.Item label={translations.card} value="Karta" style={{ color: "#76787A", }} />
                        <Picker.Item label={translations.cash} value="Gotówka" style={{ color: "#76787A", }} />

                    </Picker>
                </View>

                {/* Amount */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.sum}</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>zł</Text>
                    <TextInput
                        style={[styles.numericInput, isDarkMode
                            ? { color: '#fff' }
                            : { color: '#000' }]}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={handleAmountInput}
                        placeholder="0"
                        placeholderTextColor={isDarkMode ? '#fff' : '#000'}
                    />
                </View>

                {/* Date */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.date}</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setDatePickerVisible(true)}
                >
                    <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{date || `${currentYear}-00-00`}</Text>
                </TouchableOpacity>

                {/* Note */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.Note}</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 10,
                        padding: 10,
                        color: isDarkMode ? '#fff' : '#000'
                    }}
                    value={note}
                    onChangeText={setNote}
                />

                {/* Save Button */}
                <TouchableOpacity style={[styles.saveButton, isDarkMode
                    ? { backgroundColor: '#10CDFC' }
                    : { backgroundColor: '#1C26FF' }]} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{translations.saveButton}</Text>
                </TouchableOpacity>
            </ScrollView>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={() => setDatePickerVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
        padding: 10,
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