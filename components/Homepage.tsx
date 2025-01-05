import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useBalance } from '../context/BalanceContext';
import Sidebar from './Sidebar';
import { NewestTransactionsContext } from '../context/NewestTransactionsContext';
import { GoalContext } from '../context/GoalContext';
import CircularVisualization from './CircularVisualization';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';


function Homepage() {
    const { goalData } = useContext(GoalContext);
    const { newestTransactions } = useContext(NewestTransactionsContext);
    const navigation = useNavigation();
    const { cardBalance, cashBalance, loadData } = useBalance();
    const { translations } = useLanguage();

    const { theme } = useTheme();

    const isDarkMode = theme === 'dark';



    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    useFocusEffect(
        useCallback(() => {
            loadData(); // Refresh data when the page gains focus
        }, [loadData])
    );


    useEffect(() => {
        const fetchGoal = async () => {
            const savedGoal = await AsyncStorage.getItem('goal');
            if (savedGoal) {
                setGoal(JSON.parse(savedGoal));
            }
        };

        fetchGoal();
    }, []);

    return (
        <SafeAreaView style={[styles.container, isDarkMode
            ? { backgroundColor: '#112540' }
            : { backgroundColor: '#fff' }]}>
            <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
            <View style={{ height: 70, backgroundColor: isDarkMode ? '#10CDFC' : '#1C26FF', display: "flex", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline", paddingHorizontal: 20, marginTop: 10 }}>
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
            <ScrollView showsVerticalScrollIndicator={false} style={styles.contentBlock}>
                <View>
                    <Text style={{ fontSize: 24, fontFamily: 'Montserrat-Bold', fontWeight: 700, marginVertical: 15, color: isDarkMode ? '#fff' : '#000' }}>{translations.totalBalance}</Text>

                </View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 9 }}>
                        <Text style={{ fontSize: 24, fontFamily: 'Montserrat-Bold', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }}>{(cardBalance + cashBalance).toFixed(2)} zł</Text>
                        <Text style={{ color: "#A3A3A3", fontSize: 20, fontFamily: 'Montserrat-Light' }}>{translations.card}</Text>
                        <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }}>{cardBalance.toFixed(2)} zł</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <TouchableOpacity style={{ borderColor: isDarkMode ? '#10CDFC' : '#1C26FF', borderRadius: 45, height: 39, borderWidth: 1, paddingHorizontal: 20, display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center", alignItems: "center" }}
                            onPress={() => navigation.navigate('TotalBalance')}
                        >
                            <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700, marginRight: 10 }}>{translations.editButton}</Text>
                            <Image source={require('../assets/Vector.png')} style={{ tintColor: isDarkMode ? '#10CDFC' : '#1C26FF' }} />
                        </TouchableOpacity>
                        <Text style={{ color: "#A3A3A3", fontSize: 20, fontFamily: 'Montserrat-Light' }}>{translations.cash}</Text>
                        <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }}>{cashBalance.toFixed(2)} zł</Text>
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700, marginTop: 15, marginBottom: 10, color: isDarkMode ? '#fff' : '#000' }}>{translations.savings}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
                    {goalData ? (
                        <View style={{ borderRadius: 16, minWidth: 175, width: '80%', height: 130, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, }}>
                            <TouchableOpacity style={{ marginVertical: 7, display: "flex", alignItems: "flex-end", width: "80%" }} onPress={() => navigation.navigate('Savings')}>
                                <Image source={require('../assets/Vector.png')} style={{ tintColor: isDarkMode ? '#10CDFC' : '#1C26FF' }} />
                            </TouchableOpacity>
                            <View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
                                <View style={{ display: "flex", flexDirection: "column", marginLeft: 4, gap: 6, minWidth: 90, width: "63%", alignItems: "center" }}>
                                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }}>{goalData.accumulation}</Text>
                                    <Text style={{ color: "#A3A3A3", fontSize: 16, fontFamily: 'Montserrat-Bold' }}>{translations.cumulative} </Text>
                                    <Text style={{ color: "#22D9A0", fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{goalData.currentProgress} zł</Text>
                                </View>
                                <View style={{ width: 80, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <CircularVisualization
                                        currentProgress={goalData.currentProgress}
                                        goalAmount={goalData.goalAmount}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{ borderRadius: 16, width: 175, height: 130, boxShadow: "rgba(65, 65, 65, 0.08)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity style={{ borderRadius: 25, backgroundColor: isDarkMode ? '#10CDFC' : '#1C26FF', padding: 15, display: "flex", justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate('NewGoal')}>
                                <Image source={require('../assets/Add.png')} style={{}} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 15 }}>
                    <View>
                        <Image source={require('../assets/boy.png')} style={{ resizeMode: 'contain', height: 220 }} />
                    </View>
                    <View style={{ display: "flex", flexDirection: "column", width: "60%", gap: 10, left: -25 }}>
                        <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{translations.financialLiteracyTips}</Text>
                        <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 13, fontFamily: 'Montserrat-Light' }}>{translations.tipsThatMightBeHelpful}</Text>
                        <View style={{ display: "flex", alignItems: "center" }}>
                            <TouchableOpacity style={[styles.button, isDarkMode
                                ? { backgroundColor: '#10CDFC' }
                                : { backgroundColor: '#1C26FF' }]} onPress={() => navigation.navigate('Tips')}>
                                <Text style={styles.buttonText}>
                                    {translations.readButton}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <View style={{ display: "flex", flexDirection: 'row' }}>
                        <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }}>{translations.TransactionsHistoryFHalf}  </Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', marginLeft: -5, color: isDarkMode ? '#fff' : '#000' }}>{translations.TransactionsHistorySHalf}</Text>
                    </View>
                    <TouchableOpacity style={{ borderColor: isDarkMode ? '#10CDFC' : '#1C26FF', borderRadius: 45, height: 39, borderWidth: 1, paddingHorizontal: 15, display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate('TransactionsHistory')}>
                        <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{translations.viewAllButton}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', flexDirection: "column", gap: 8, marginBottom: 10 }}>

                    {newestTransactions.length > 0 ? (
                        newestTransactions.map((transaction, index) => (
                            <View key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <View style={[styles.transactionCard, { backgroundColor: transaction.color }]} >
                                        <Image
                                            source={transaction.icon === 'UpDown' ? require('../assets/UpDown.png') : transaction.icon}
                                        />
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "column", marginLeft: 12 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }}>{transaction.category}</Text>
                                        <Text style={{ color: "#A3A3A3", fontSize: 12, fontFamily: 'Montserrat-Bold' }}>{transaction.note || "No note"}</Text>
                                    </View>
                                </View>
                                <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                    <Text style={{ color: "red", fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>-zł{transaction.amount.toFixed(2)}</Text>
                                    <Text style={{ color: "#A3A3A3", fontSize: 12, fontFamily: 'Montserrat-Bold' }}>{transaction.date}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', color: '#76787A', fontSize: 15 }}>{translations.noRecentTransactions}</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentBlock: {
        flex: 1,
        paddingHorizontal: 20,
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
    image: {
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 25,
        fontFamily: 'Montserrat-Bold',
        fontWeight: 700,
        color: '#0033FF',
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#1C26FF",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        width: "100%",
        paddingVertical: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Light',
        fontSize: 16,
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

export default Homepage;