import Sidebar from './Sidebar';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoalContext } from '../context/GoalContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLanguage } from '../context/LanguageContext';


const NewGoal = () => {
    const [accumulation, setAccumulation] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [goalNote, setGoalNote] = useState('');
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isFinishDatePickerVisible, setFinishDatePickerVisible] = useState(false);
    const navigation = useNavigation();
    const { setGoalData } = useContext(GoalContext);
    const { translations } = useLanguage();

    const currentYear = new Date().getFullYear();

    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };
    const handleAmountInput = (input) => {
        const numericInput = input.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal point
        setGoalAmount(numericInput);
    };
    const handleConfirmStartDate = (date) => {
        setStartDate(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        setStartDatePickerVisible(false);
    };

    const handleConfirmFinishDate = (date) => {
        setFinishDate(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        setFinishDatePickerVisible(false);
    };

    const handleSave = async () => {
        if (!accumulation || !goalAmount || !startDate || !finishDate) {
            Alert.alert('Error', `${translations.notAllFieldsError}`);
            return;
        }

        try {
            const goalData = {
                accumulation,
                goalAmount,
                startDate,
                finishDate,
                goalNote,
            };

            await AsyncStorage.setItem('goal', JSON.stringify(goalData));

            setGoalData(goalData);
            navigation.navigate('Savings');
        } catch (error) {
            Alert.alert('Error', `${translations.savingDataError}`);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
            <View style={{ height: 120, backgroundColor: "#1C26FF", display: "flex", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginTop: 40 }}>
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                        onPress={() => navigation.navigate('Homepage')}
                    >

                        <Image source={require('../assets/rightArrow.png')} style={{}} />
                        <Text style={{ color: "#fff", fontSize: 15, marginLeft: 10 }}>{translations.goHome}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleSidebar}>
                        <Image source={require('../assets/Menu.png')} style={styles.menu} />
                    </TouchableOpacity>

                </View>
            </View>

            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>{translations.newGoal}</Text>
                </View>
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.AccumulationPurpose}</Text>
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
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.sum}</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>zł</Text>
                    <TextInput
                        style={styles.numericInput}
                        keyboardType="numeric"
                        value={goalAmount}
                        onChangeText={handleAmountInput}
                        placeholder="0"
                    />
                </View>

                {/* Date */}
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 20, marginBottom: 20, }}>
                    <View>
                        <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.startDate}</Text>
                        <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 10,
                                padding: 10,
                                marginBottom: 20
                            }}
                            onPress={() => setStartDatePickerVisible(true)}
                        >
                            <Text>{startDate || `${currentYear}-00-00`}</Text>
                        </TouchableOpacity>

                    </View>

                    <View>
                        <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.endDate}</Text>

                        <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 10,
                                padding: 10,
                                marginBottom: 20
                            }}
                            onPress={() => setFinishDatePickerVisible(true)}
                        >
                            <Text>{finishDate || `${currentYear}-00-00`}</Text>
                        </TouchableOpacity>
                    </View>

                </View>


                {/* Note */}
                <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.Note}</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 10,
                        padding: 10,
                    }}
                    value={goalNote}
                    onChangeText={setGoalNote}
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{translations.saveButton}</Text>
                </TouchableOpacity>
            </View>
            <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={() => setStartDatePickerVisible(false)}
            />
            <DateTimePickerModal
                isVisible={isFinishDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmFinishDate}
                onCancel={() => setFinishDatePickerVisible(false)}
            />
        </SafeAreaView>
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

export default NewGoal;