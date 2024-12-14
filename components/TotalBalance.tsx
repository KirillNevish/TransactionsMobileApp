import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from './Sidebar';
import { useBalance } from '../context/BalanceContext';

const TotalBalance = () => {
    const navigation = useNavigation();
    const { cardBalance, setCardBalance, cashBalance, setCashBalance, loadData } = useBalance();
    const [profit, setProfit] = useState<string>('');
    const [otherIncome, setOtherIncome] = useState<string>('');
    const [cashInput, setCashInput] = useState<string>('');
    const [cardInput, setCardInput] = useState<string>('');
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    useEffect(() => {
        loadData(); // Load data when component mounts
    }, [loadData]);

    const handleSave = async () => {
        // Validate inputs
        const inputs = [profit, otherIncome, cashInput, cardInput];
        if (inputs.some(input => isNaN(Number(input)))) {
            Alert.alert('Błąd', 'Wszystkie pola muszą zawierać tylko liczby.');
            return;
        }

        // Calculate the new balances
        const updatedCardBalance = cardBalance + Number(cardInput || 0);
        const updatedCashBalance = cashBalance + Number(cashInput || 0);

        // Prevent negative balances
        if (updatedCardBalance < 0 || updatedCashBalance < 0) {
            Alert.alert('Błąd', 'Saldo nie może być mniejsze niż zero.');
            return;
        }

        // Update state
        setCardBalance(updatedCardBalance);
        setCashBalance(updatedCashBalance);

        try {
            await AsyncStorage.setItem('totalBalanceData', JSON.stringify({
                profit: Number(profit || 0),
                otherIncome: Number(otherIncome || 0),
                cashBalance: updatedCashBalance,
                cardBalance: updatedCardBalance,
            }));
            Alert.alert('Success', 'Data saved successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save data.');
        }

        // Reset inputs
        setProfit('');
        setOtherIncome('');
        setCashInput('');
        setCardInput('');
    };

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "fff" }}>
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

            <View style={styles.container}>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                    <View>
                        <Text style={styles.title}>Łączne saldo</Text>
                        <Text style={styles.totalBalance}>
                            {/* {cardBalance + cashBalance} zł */}
                            {(cardBalance + cashBalance).toFixed(2)} zł
                        </Text>
                    </View>

                    <Image source={require('../assets/calculatorImage.png')} style={{}} />
                </View>


                <View style={styles.balanceRow}>
                    <View>
                        <Text style={styles.balanceTitle}>Karta</Text>
                        <Text style={styles.balanceValue}>{cardBalance.toFixed(2)} zł</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.balanceTitle}>Gotówka</Text>
                        <Text style={styles.balanceValue}>{cashBalance.toFixed(2)} zł</Text>
                    </View>
                </View>

                {/* Editable inputs */}
                <TextInput
                    style={styles.input}
                    placeholder="Zysk"
                    value={profit}
                    keyboardType="numeric"
                    onChangeText={text => setProfit(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Inne źródła dochodu"
                    value={otherIncome}
                    keyboardType="numeric"
                    onChangeText={text => setOtherIncome(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Gotówka"
                    value={cashInput}
                    keyboardType="numeric"
                    onChangeText={text => setCashInput(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Karta"
                    value={cardInput}
                    keyboardType="numeric"
                    onChangeText={text => setCardInput(text)}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Zapisz</Text>
                </TouchableOpacity>
            </View>
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
    totalBalance: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
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

export default TotalBalance;


