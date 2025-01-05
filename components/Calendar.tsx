import Sidebar from './Sidebar';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { CategoryContext } from '../context/CategoryContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

// LocaleConfig.locales['pl'] = {
//     monthNames: [
//         'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
//         'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
//     ],
//     monthNamesShort: [
//         'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru',
//     ],
//     dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
//     dayNamesShort: ['Ndz', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'],

// };
// LocaleConfig.defaultLocale = 'pl';


const CalendarScreen = () => {
    const { transactions } = useContext(CategoryContext);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const { translations } = useLanguage();
    const { theme } = useTheme();

    const isDarkMode = theme === 'dark';


    const markedDates = transactions.reduce((acc, transaction) => {
        acc[transaction.date] = {
            selected: true,
            selectedColor: isDarkMode ? '#10CDFC' : '#1C26FF',
        };
        return acc;
    }, {});

    const handleDayPress = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
    };

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };


    const [currentDate, setCurrentDate] = useState(new Date());

    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = currentDate.getDate();

    const handleMonthChange = (date) => {
        const selectedDate = new Date(date.year, date.month - 1);
        if (selectedDate.getFullYear() < currentYear || (selectedDate.getFullYear() === currentYear && date.month < currentDate.getMonth() + 1)) {
            return; // Prevent navigating to past months
        }
        setCurrentDate(selectedDate);
    }

    useEffect(() => {
        LocaleConfig.locales['custom'] = {
            monthNames: translations.monthNames,
            monthNamesShort: translations.monthNamesShort,
            dayNames: translations.dayNames,
            dayNamesShort: translations.dayNamesShort,
        };
        LocaleConfig.defaultLocale = 'custom';
    }, [translations]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#112540' : '#fff', }}>
            <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
            <View style={{ backgroundColor: "#121212" }}>
                <View style={{ height: 70, backgroundColor: isDarkMode ? '#10CDFC' : '#1C26FF', display: "flex", borderBottomLeftRadius: 30, borderBottomRightRadius: 20 }}>
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
            </View>
            <View style={{ flex: 1 }}>
                <Calendar
                    current={`${currentYear}-${currentMonth}-${currentDay}`}
                    minDate={`2024-01-01`}
                    maxDate={`${currentYear}-12-31`}
                    onDayPress={handleDayPress}
                    onMonthChange={handleMonthChange}
                    theme={{
                        calendarBackground: '#121212',
                        textSectionTitleColor: '#FFFFFF',
                        selectedDayBackgroundColor: '#3B82F6',
                        selectedDayTextColor: '#FFFFFF',
                        todayTextColor: isDarkMode ? '#10CDFC' : '#3B82F6',
                        dayTextColor: '#FFFFFF',
                        arrowColor: '#FFFFFF',
                        monthTextColor: '#FFFFFF',
                    }}
                    style={{ height: 400, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
                    markingType="custom"
                    markedDates={markedDates}
                />
                <View style={{ padding: 20, display: "flex", flexDirection: "column", gap: 15, marginTop: 10 }}>
                    {selectedDate && (
                        <>
                            <Text style={[styles.title, isDarkMode
                                ? { color: '#fff' }
                                : { color: '#000' }]}>
                                {selectedDate}:
                            </Text>
                            {transactions
                                .filter((transaction) => transaction.date === selectedDate)
                                .map((transaction, index) => (
                                    <View key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 12, padding: 15, backgroundColor: isDarkMode ? '#112540' : '#F3F3F3', }}>
                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                            <View style={[styles.transactionCard, { backgroundColor: transaction.color }]} >
                                                <Image
                                                    source={transaction.icon === 'UpDown' ? require('../assets/UpDown.png') : transaction.icon}
                                                />
                                            </View>
                                            <View style={{ display: "flex", flexDirection: "column", marginLeft: 12 }}>
                                                <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{transaction.category}</Text>
                                                <Text style={{ color: "#A3A3A3", fontSize: 12, fontFamily: 'Montserrat-Bold' }}>{transaction.note || "No note"}</Text>
                                            </View>
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                            <Text style={{ color: "red", fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>-zł{transaction.amount.toFixed(2)}</Text>
                                            <Text style={{ color: "#A3A3A3", fontSize: 12, fontFamily: 'Montserrat-Bold' }}>{transaction.date}</Text>
                                        </View>
                                    </View>
                                ))}
                        </>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
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
    },
    transactionItem: {
        backgroundColor: '#1C26FF',
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
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
    transactionCard: {
        borderRadius: 12,
        width: 40,
        height: 40,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"

    },
});

export default CalendarScreen;