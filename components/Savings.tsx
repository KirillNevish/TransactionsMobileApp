import Sidebar from './Sidebar';
import React, { useContext, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Animated, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoalContext } from '../context/GoalContext';
import { useBalance } from '../context/BalanceContext';
import { CategoryContext } from '../context/CategoryContext';
import UpDown from '../assets/UpDown.png';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';


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
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isFinishDatePickerVisible, setFinishDatePickerVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const { translations } = useLanguage();
    const { theme } = useTheme();

    const isDarkMode = theme === 'dark';

    const showStartDatePicker = () => setStartDatePickerVisible(true);
    const hideStartDatePicker = () => setStartDatePickerVisible(false);
    const handleStartDateConfirm = (date) => {
        setStartDate(date.toISOString().split("T")[0]); // Format date as YYYY-MM-DD
        hideStartDatePicker();
    };

    // Handlers for the finish date picker
    const showFinishDatePicker = () => setFinishDatePickerVisible(true);
    const hideFinishDatePicker = () => setFinishDatePickerVisible(false);
    const handleFinishDateConfirm = (date) => {
        setFinishDate(date.toISOString().split("T")[0]); // Format date as YYYY-MM-DD
        hideFinishDatePicker();
    };

    const handleConfirmDate = (date) => {
        setDate(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        setDatePickerVisible(false);
    };



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
    };

    const saveAmount = () => {
        const addedAmount = parseFloat(amount) || 0;

        if (!validateDate(date)) {
            Alert.alert('Error', `${translations.notAllFieldsError}`);
            return;
        }

        if (cardBalance + cashBalance < addedAmount) {
            Alert.alert('Error', `${translations.insufficientBalanceError}`);
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
            category: `${translations.topUps}`,
            icon: 'UpDown',
            color: '#1CD6AB',
            note: goalNote,
        };

        setTransactions((prev) => [...prev, newTransaction]);


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
                Alert.alert(`${translations.goalReached}`);
                resetGoal(); // Reset goal data
            }
            // Check if the finish date has passed without reaching the goal
            else if (finishDate < now) {
                Alert.alert(`${translations.goalNotReached}`);
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
            <TouchableOpacity style={{ backgroundColor: isDarkMode ? '#112540' : '#fff', flex: 1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                onPress={() => navigation.navigate('Homepage')}
            >
                <Text style={[styles.noGoalMessage, isDarkMode
                    ? { color: '#fff' }
                    : { color: '#000' }]}>{translations.createAGoalText}</Text>
            </TouchableOpacity>
        );
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#112540' : '#fff', }}>
            <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
            <View style={{ height: 120, backgroundColor: isDarkMode ? '#10CDFC' : '#1C26FF', display: "flex", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginTop: 40 }}>
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                        onPress={() => navigation.navigate('Homepage')}
                    >

                        <Image source={require('../assets/rightArrow.png')} style={[isDarkMode
                            ? { tintColor: '#112540' }
                            : { tintColor: '#fff' }]} />
                        <Text style={{ color: isDarkMode ? '112540' : '#fff', fontSize: 15, marginLeft: 10 }}>{translations.goHome}</Text>
                    </TouchableOpacity>
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
                        : { color: '#000' }]}>{translations.savings}</Text>
                </View>
                <View style={{ height: 90, }}>
                    <View style={styles.progressBarWrapper}>
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarIndicator, isDarkMode
                                ? { backgroundColor: '#10CDFC' }
                                : { backgroundColor: '#1C26FF' }, { width: `${calculateProgressPercentage()}%` }]} />
                        </View>
                        <Text style={[styles.progressLabel, isDarkMode
                            ? { color: '#fff' }
                            : { color: '#000' }]}>{currentProgress} zł / {goalAmount} zł</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ borderColor: isDarkMode ? '#10CDFC' : '#1C26FF', borderRadius: 45, height: 39, borderWidth: 1, paddingHorizontal: 15, display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center", alignItems: "center", marginVertical: 20, maxWidth: 120, }} onPress={toggleBottomBar}>
                    <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{translations.topUpButton}</Text>
                </TouchableOpacity>
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.AccumulationPurpose}</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 10,
                        padding: 10,
                        marginBottom: 20,
                        color: isDarkMode ? '#fff' : '#000',
                    }}
                    value={accumulation}
                    placeholderTextColor={isDarkMode ? '#fff' : '#000'}
                    onChangeText={setAccumulation}
                    placeholder="Cel"
                />


                {/* Amount */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.sum}</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>zł</Text>
                    <TextInput
                        placeholderTextColor={isDarkMode ? '#fff' : '#000'}
                        style={[styles.numericInput, isDarkMode
                            ? { color: '#fff' }
                            : { color: '#000' }]}
                        keyboardType="numeric"
                        value={goalAmount}
                        onChangeText={(text) => handleAmountInput(text, setGoalAmount)}
                        placeholder="0"
                    />
                </View>

                {/* Date */}
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 20, marginBottom: 20, }}>
                    <View>
                        <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.startDate}</Text>
                        <TouchableOpacity
                            onPress={showStartDatePicker}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 10,
                                padding: 10,
                                width: 100
                            }}
                        >
                            <Text style={{ color: isDarkMode ? '#fff' : '#000', }}>{startDate || `${currentYear}-00-00`}</Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                        isVisible={isStartDatePickerVisible}
                        mode="date"
                        onConfirm={handleStartDateConfirm}
                        onCancel={hideStartDatePicker}
                    />

                    <View>
                        <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.endDate}</Text>
                        <TouchableOpacity
                            onPress={showFinishDatePicker}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 10,
                                padding: 10,
                                width: 100
                            }}
                        >
                            <Text style={{ color: isDarkMode ? '#fff' : '#000', }}>{finishDate || `0000-00-00`}</Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                        isVisible={isFinishDatePickerVisible}
                        mode="date"
                        onConfirm={handleFinishDateConfirm}
                        onCancel={hideFinishDatePicker}
                    />

                </View>


                {/* Note */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.Note}</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 10,
                        padding: 10,
                        marginBottom: 20,
                        color: isDarkMode ? '#fff' : '#000',
                    }}
                    value={goalNote}
                    onChangeText={setGoalNote}
                />

                {/* Save Button */}
                <TouchableOpacity style={[styles.saveButton, isDarkMode
                    ? { backgroundColor: '#10CDFC' }
                    : { backgroundColor: '#1C26FF' }]} onPress={saveGoal} >
                    <Text style={styles.saveButtonText}>{translations.saveButton}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom Bar */}
            {isBottomBarVisible && (
                <Animated.View style={[
                    styles.bottomBar, isDarkMode
                        ? { backgroundColor: '#112540' }
                        : { backgroundColor: '#fff' },
                    {
                        transform: [{ translateY: bottomBarAnim }], // Apply animation
                    },
                ]}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, }}>
                        <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 20, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{translations.addtopUpText}</Text>
                        <TouchableOpacity onPress={toggleBottomBar}>
                            <Image source={require('../assets/x.png')} style={{ tintColor: isDarkMode ? '#fff' : '#000', }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.sum}</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.currencySymbol}>zł</Text>
                        <TextInput
                            placeholderTextColor={isDarkMode ? '#fff' : '#000'}
                            style={[styles.numericInput, isDarkMode
                                ? { color: '#fff' }
                                : { color: '#000' }]}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={(text) => handleAmountInput(text, setAmount)}
                            placeholder="0"
                        />
                    </View>

                    <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.date}</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setDatePickerVisible(true)}
                    >
                        <Text style={{ color: isDarkMode ? '#fff' : '#000', }}>{date || `${currentYear}-00-00`}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.saveButton, isDarkMode
                        ? { backgroundColor: '#10CDFC' }
                        : { backgroundColor: '#1C26FF' }]} onPress={saveAmount}>
                        <Text style={styles.saveButtonText}>{translations.saveButton}</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
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
        marginBottom: 20,
        padding: 10,
    },
    currencySymbol: {
        fontSize: 16,
        color: '#76787A',
        marginRight: 5,
    },
    numericInput: {
        fontSize: 16,
        flex: 1,
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