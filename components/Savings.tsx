import Sidebar from './Sidebar';
import React, { useContext, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Animated, ScrollView, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoalContext } from '../context/GoalContext';
import { useBalance } from '../context/BalanceContext';
import { CategoryContext } from '../context/CategoryContext';
import UpDownIcon from '../assets/UpDown.png';


const Savings = () => {
    const { goalData, setGoalData, resetGoal } = useContext(GoalContext);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [accumulation, setAccumulation] = useState(goalData?.accumulation || '');
    const [goalAmount, setGoalAmount] = useState(goalData?.goalAmount?.toString() || '');
    const [startDate, setStartDate] = useState(goalData?.startDate || '');
    const [finishDate, setFinishDate] = useState(goalData?.finishDate || '');
    const [goalNote, setGoalNote] = useState(goalData?.goalNote || '');
    const [currentProgress, setCurrentProgress] = useState(goalData?.currentProgress || 0);
    const navigation = useNavigation();
    const [isBottomBarVisible, setBottomBarVisible] = useState(false);
    const { cardBalance, setCardBalance, cashBalance, setCashBalance } = useBalance();
    const { transactions, setTransactions } = useContext(CategoryContext);

    const toggleBottomBar = () => {
        const bottomBarHeight = 300; // Height of the bottom bar (adjust if necessary)
        if (isBottomBarVisible) {
            // Hide the bottom bar (slide it down)
            Animated.timing(bottomBarAnim, {
                toValue: bottomBarHeight, // Move off-screen
                duration: 300,
                useNativeDriver: true,
            }).start(() => setBottomBarVisible(false)); // Set state after animation
        } else {
            setBottomBarVisible(true); // Set state before animation
            // Show the bottom bar (slide it up)
            Animated.timing(bottomBarAnim, {
                toValue: 0, // Fully visible
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const bottomBarAnim = useRef(new Animated.Value(300)).current;

    const currentYear = new Date().getFullYear();

    const [isSidebarVisible, setSidebarVisible] = useState(false);



    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const handleAmountInput = (input: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const numericInput = input.replace(/[^0-9.]/g, '');
        setter(numericInput);
    };

    const handleDateInput = (input: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const sanitizedInput = input.replace(/[^0-9\-]/g, '');
        const parts = sanitizedInput.split('-');
        let formattedDate = '';

        if (parts[0]?.length <= 4) formattedDate += parts[0];
        if (parts[0]?.length === 4 && sanitizedInput.length > 4) formattedDate += '-';
        if (parts[1]?.length <= 2) formattedDate += parts[1];
        if (parts[1]?.length === 2 && sanitizedInput.length > 7) formattedDate += '-';
        if (parts[2]?.length <= 2) formattedDate += parts[2];

        if (formattedDate.length > 10) return;

        setter(formattedDate);
    };

    const validateDate = (input: string): boolean => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Format: YYYY-MM-DD
        return datePattern.test(input);
    };

    const saveGoal = () => {
        setGoalData((prevData) => ({
            ...prevData,
            goalAmount: parseFloat(goalAmount) || 0,
            accumulation, // Keep other fields updated as necessary
            startDate,
            finishDate,
            goalNote,
        }));
        Alert.alert('Goal updated successfully!');
    };

    const saveAmount = () => {
        const addedAmount = parseFloat(amount) || 0;

        if (!validateDate(date)) {
            Alert.alert('Error', 'Please enter a valid date in the format YYYY-MM-DD.');
            return;
        }

        if (cardBalance + cashBalance < addedAmount) {
            Alert.alert('Error', 'Insufficient balance to add this amount.');
            return;
        }

        if (cardBalance >= addedAmount) {
            setCardBalance(cardBalance - addedAmount);
        } else {
            const remaining = addedAmount - cardBalance;
            setCardBalance(0);
            setCashBalance(cashBalance - remaining);
        }

        const newProgress = currentProgress + addedAmount;
        setCurrentProgress(newProgress);


        setGoalData((prevData) => ({
            ...prevData,
            currentProgress: (prevData?.currentProgress || 0) + addedAmount,
        }));

        const newTransaction = {
            amount: addedAmount,
            date: date,
            category: 'Doładowania',
            icon: UpDownIcon, // Update the path if necessary
            color: '#1CD6AB',
            note: goalNote,
        };

        setTransactions((prev) => [...prev, newTransaction]);


        Alert.alert('Amount added successfully!');
        setAmount('');
        setDate('');
        toggleBottomBar();
    };

    React.useEffect(() => {
        if (goalData) {
            setGoalAmount(goalData.goalAmount?.toString() || '');
            setCurrentProgress(goalData.currentProgress || 0);
        }
    }, [goalData]);

    React.useEffect(() => {
        if (goalData) {
            const now = new Date();
            const finishDate = new Date(goalData.finishDate);

            // Check if the goal is reached
            if (goalData.currentProgress >= goalData.goalAmount) {
                Alert.alert('Success', 'The goal has been reached!');
                resetGoal(); // Reset goal data
            }
            // Check if the finish date has passed without reaching the goal
            else if (finishDate < now) {
                Alert.alert('Time Up', 'The goal was not reached in time.');
                resetGoal(); // Reset goal data
            }
        }
    }, [goalData, resetGoal]);

    const calculateProgressPercentage = () => {
        const goal = parseFloat(goalAmount) || 1; // Avoid division by zero
        return Math.min((currentProgress / goal) * 100, 100);
    };

    // Show message if no goal exists
    if (!goalData) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                    onPress={() => navigation.navigate('Homepage')}
                >
                    <Text style={styles.noGoalMessage}>Create a goal first.</Text>
                </TouchableOpacity>
            </View>
        );
    }


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
                    <Text style={styles.title}>Twoje oszczędności</Text>
                </View>
                <View style={{ height: 90, }}>
                    <View style={styles.progressBarWrapper}>
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarIndicator, { width: `${calculateProgressPercentage()}%` }]} />
                        </View>
                        <Text style={styles.progressLabel}>{currentProgress} zł / {goalAmount} zł</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ borderColor: "#1C26FF", borderRadius: 45, height: 39, borderWidth: 1, paddingHorizontal: 15, display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center", alignItems: "center", width: 110, marginVertical: 20 }} onPress={toggleBottomBar}>
                    <Text style={{ color: "#1C26FF", fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>Doładuj</Text>
                </TouchableOpacity>
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Cel akumulacji</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 10,
                        padding: 10,
                        marginBottom: 20
                    }}
                    value={accumulation}
                    onChangeText={setAccumulation}
                    placeholder="Cel"
                />


                {/* Amount */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Kwota</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>zł</Text>
                    <TextInput
                        style={styles.numericInput}
                        keyboardType="numeric"
                        value={goalAmount}
                        onChangeText={(text) => handleAmountInput(text, setGoalAmount)}
                        placeholder="0"
                    />
                </View>

                {/* Date */}
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 20, marginBottom: 20, }}>
                    <View>
                        <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Data początkowa</Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 10,
                                padding: 10,
                            }}
                            value={startDate}
                            onChangeText={(text) => handleDateInput(text, setStartDate)}
                            placeholder={`${currentYear}-00-00`}
                            maxLength={11}
                        />
                    </View>

                    <View>
                        <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Data zakończenia</Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 10,
                                padding: 10
                            }}
                            value={finishDate}
                            onChangeText={(text) => handleDateInput(text, setFinishDate)}
                            placeholder={`0000-00-00`}
                            maxLength={11}
                        />
                    </View>

                </View>


                {/* Note */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Notatka (fakultatywny)</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 10,
                        padding: 10,
                        marginBottom: 20
                    }}
                    value={goalNote}
                    onChangeText={setGoalNote}
                    placeholder="Informacje o zakupie"
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={saveGoal} >
                    <Text style={styles.saveButtonText}>Zapisz</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom Bar */}
            {isBottomBarVisible && (
                <Animated.View style={[
                    styles.bottomBar,
                    {
                        transform: [{ translateY: bottomBarAnim }], // Apply animation
                    },
                ]}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#fff", marginBottom: 20, }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>Dodaj kategorię</Text>
                        <TouchableOpacity onPress={toggleBottomBar}>
                            <Image source={require('../assets/x.png')} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Kwota</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.currencySymbol}>zł</Text>
                        <TextInput
                            style={styles.numericInput}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={(text) => handleAmountInput(text, setAmount)}
                            placeholder="0"
                        />
                    </View>

                    <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Data</Text>
                    <TextInput value={date} onChangeText={(text) => handleDateInput(text, setDate)} placeholder={`${currentYear}-00-00`} style={styles.input} maxLength={11} />

                    <TouchableOpacity style={styles.saveButton} onPress={saveAmount}>
                        <Text style={styles.saveButtonText}>Zapisz</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
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
        fontSize: 24,
        fontFamily: "Montserrat-Bold",
        fontWeight: 700,
        color: '#000',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#1C26FF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
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
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    noGoalMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    progressBarWrapper: {
        marginVertical: 20,
    },
    progressBarBackground: {
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressBarIndicator: {
        height: '100%',
        backgroundColor: '#1C26FF',
    },
    progressLabel: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default Savings;