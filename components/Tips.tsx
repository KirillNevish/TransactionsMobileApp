import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from './Sidebar';
import { useLanguage } from '../context/LanguageContext';

const Tips = () => {
    const navigation = useNavigation();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const { translations } = useLanguage();

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "fff" }}>
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

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>{translations.financialLiteracyTips}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>1.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.budgetingTip} </Text>
                        {translations.budgetingTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>2.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.savingTip} </Text>
                        {translations.savingTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>3.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.InvestingTip} </Text>
                        {translations.InvestingTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>4.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.developingSkillsTip} </Text>
                        {translations.developingSkillsTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>5.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.debtReductionTip} </Text>
                        {translations.debtReductionTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>6.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.retirementPlanningTip} </Text>
                        {translations.retirementPlanningTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", alignItems: 'center', borderWidth: 1, borderColor: "#fff", marginBottom: 70 }}>
                    <Image source={require('../assets/boy.png')} style={{ resizeMode: 'contain', height: 200 }} />
                    <Image source={require('../assets/TipsImg.png')} style={{ resizeMode: 'contain', height: 200, left: -70 }} />
                </View>
            </ScrollView>
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
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
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
    }
});

export default Tips;