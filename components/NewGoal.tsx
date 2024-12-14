import Sidebar from './Sidebar';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoalContext } from '../context/GoalContext';



const NewGoal = () => {
    const [accumulation, setAccumulation] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [goalNote, setGoalNote] = useState('');
    const navigation = useNavigation();

    const { setGoalData } = useContext(GoalContext);

    const currentYear = new Date().getFullYear();

    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };
    const handleAmountInput = (input) => {
        const numericInput = input.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal point
        setGoalAmount(numericInput);
    };
    const handleDateInput = (input, setDate) => {
        const sanitizedInput = input.replace(/[^0-9\-]/g, '');
        const parts = sanitizedInput.split('-');

        if (parts.length > 3) return;

        let formattedDate = '';
        if (parts[0]?.length <= 4) formattedDate += parts[0];
        if (parts[0]?.length === 4 && sanitizedInput.length > 4) formattedDate += '-';
        if (parts[1]?.length <= 2) formattedDate += parts[1];
        if (parts[1]?.length === 2 && sanitizedInput.length > 7) formattedDate += '-';
        if (parts[2]?.length <= 2) formattedDate += parts[2];

        if (formattedDate.length > 10) return;

        setDate(formattedDate);
    };

    const handleSave = async () => {
        if (!accumulation || !goalAmount || !startDate || !finishDate) {
            Alert.alert('Błąd', 'Wszystkie pola (z wyjątkiem notatki) są wymagane!');
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

            Alert.alert('Sukces', 'Cel został zapisany!');
            navigation.navigate('Savings');
        } catch (error) {
            Alert.alert('Błąd', 'Wystąpił problem podczas zapisywania danych.');
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

            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>Nowy cel</Text>
                </View>
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
                        onChangeText={handleAmountInput}
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
                                width: 120
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
                                padding: 10,
                                width: 120
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
                    }}
                    value={goalNote}
                    onChangeText={setGoalNote}
                    placeholder="Informacje o zakupie"
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Zapisz</Text>
                </TouchableOpacity>
            </View>
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

export default NewGoal;