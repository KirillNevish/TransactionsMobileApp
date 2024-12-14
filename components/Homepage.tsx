import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useBalance } from '../context/BalanceContext';
import Sidebar from './Sidebar';
import { NewestTransactionsContext } from '../context/NewestTransactionsContext';
import { GoalContext } from '../context/GoalContext';
import CircularVisualization from './CircularVisualization';


function Homepage() {
    const { goalData } = useContext(GoalContext);
    const { newestTransactions } = useContext(NewestTransactionsContext);
    const navigation = useNavigation();
    const { cardBalance, cashBalance, loadData } = useBalance();



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
        <View style={styles.container}>
            <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
            <View style={{ height: 120, backgroundColor: "#1C26FF", display: "flex", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline", paddingHorizontal: 20, marginTop: 20 }}>
                    <Image source={require('../assets/logoHeader.png')} style={styles.logo} />
                    <TouchableOpacity onPress={toggleSidebar}>
                        <Image source={require('../assets/Menu.png')} style={styles.menu} />
                    </TouchableOpacity>

                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.contentBlock}>
                <View>
                    <Text style={{ fontSize: 24, fontFamily: 'Montserrat-Bold', fontWeight: 700, marginVertical: 10 }}>Łączne saldo</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 9 }}>
                        <Text style={{ fontSize: 24, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{(cardBalance + cashBalance).toFixed(2)} zł</Text>
                        <Text style={{ color: "#A3A3A3", fontSize: 20, fontFamily: 'Montserrat-Light' }}>Karta</Text>
                        <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{cardBalance.toFixed(2)} zł</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <TouchableOpacity style={{ borderColor: "#1C26FF", borderRadius: 45, height: 39, borderWidth: 1, paddingHorizontal: 20, display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center", alignItems: "center" }}
                            onPress={() => navigation.navigate('TotalBalance')}
                        >
                            <Text style={{ color: "#1C26FF", fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700, marginRight: 10 }}>Edytuj</Text>
                            <Image source={require('../assets/Vector.png')} style={{}} />
                        </TouchableOpacity>
                        <Text style={{ color: "#A3A3A3", fontSize: 20, fontFamily: 'Montserrat-Light' }}>Gotówka</Text>
                        <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{cashBalance.toFixed(2)} zł</Text>
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700, marginVertical: 10 }}>Twoje oszczędności</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
                    {goalData ? (
                        <View style={{ borderRadius: 16, minWidth: 175, width: '80%', height: 130, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, }}>
                            <TouchableOpacity style={{ marginVertical: 7, display: "flex", alignItems: "flex-end", width: "80%" }} onPress={() => navigation.navigate('Savings')}>
                                <Image source={require('../assets/Vector.png')} style={{}} />
                            </TouchableOpacity>
                            <View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
                                <View style={{ display: "flex", flexDirection: "column", marginLeft: 4, gap: 6, minWidth: 90, width: "63%", alignItems: "center" }}>
                                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{goalData.accumulation}</Text>
                                    <Text style={{ color: "#A3A3A3", fontSize: 16, fontFamily: 'Montserrat-Bold' }}>Skumulowane: </Text>
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
                            <TouchableOpacity style={{ borderRadius: 25, backgroundColor: "#1C26FF", padding: 15, display: "flex", justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate('NewGoal')}>
                                <Image source={require('../assets/Add.png')} style={{}} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                    <View>
                        <Image source={require('../assets/boy.png')} style={{ resizeMode: 'contain', height: 220 }} />
                    </View>
                    <View style={{ display: "flex", flexDirection: "column", width: "60%", gap: 10, left: -25 }}>
                        <Text style={{ color: "#1C26FF", fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>Wskazówki dotyczące umiejętności finansowych</Text>
                        <Text style={{ color: "112540", fontSize: 13, fontFamily: 'Montserrat-Light' }}>Wskazówek dotyczących umiejętności finansowych, które mogą być przydatne:</Text>
                        <View style={{ display: "flex", alignItems: "center" }}>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tips')}>
                                <Text style={styles.buttonText}>
                                    Czytaj
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <View style={{ display: "flex", flexDirection: 'row' }}>
                        <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>Тransakcji  </Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', marginLeft: -5 }}>historia</Text>
                    </View>
                    <TouchableOpacity style={{ borderColor: "#1C26FF", borderRadius: 45, height: 39, borderWidth: 1, paddingHorizontal: 15, display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate('TransactionsHistory')}>
                        <Text style={{ color: "#1C26FF", fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>Wszystkie</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', flexDirection: "column", gap: 8, marginBottom: 10 }}>

                    {newestTransactions.length > 0 ? (
                        newestTransactions.map((transaction, index) => (
                            <View key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', color: '#76787A', fontSize: 15 }}>No recent transactions.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
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