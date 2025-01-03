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
import { useTheme } from '../context/ThemeContext';

const Tips = () => {
    const navigation = useNavigation();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const { translations } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const isDarkMode = theme === 'dark';

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

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

            <ScrollView style={[styles.container, isDarkMode
                ? { backgroundColor: '#112540' }
                : { backgroundColor: '#fff' }]} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={[styles.title, isDarkMode
                        ? { color: '#fff' }
                        : { color: '#000' }]}>{translations.financialLiteracyTips}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
                    <Text style={[styles.numberColumn, isDarkMode
                        ? { color: '#10CDFC' }
                        : { color: '#1C26FF' }]}>1.</Text><Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.budgetingTip} </Text>
                        {translations.budgetingTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
                    <Text style={[styles.numberColumn, isDarkMode
                        ? { color: '#10CDFC' }
                        : { color: '#1C26FF' }]}>2.</Text><Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.savingTip} </Text>
                        {translations.savingTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
                    <Text style={[styles.numberColumn, isDarkMode
                        ? { color: '#10CDFC' }
                        : { color: '#1C26FF' }]}>3.</Text><Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.InvestingTip} </Text>
                        {translations.InvestingTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
                    <Text style={[styles.numberColumn, isDarkMode
                        ? { color: '#10CDFC' }
                        : { color: '#1C26FF' }]}>4.</Text><Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.developingSkillsTip} </Text>
                        {translations.developingSkillsTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
                    <Text style={[styles.numberColumn, isDarkMode
                        ? { color: '#10CDFC' }
                        : { color: '#1C26FF' }]}>5.</Text><Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.debtReductionTip} </Text>
                        {translations.debtReductionTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
                    <Text style={[styles.numberColumn, isDarkMode
                        ? { color: '#10CDFC' }
                        : { color: '#1C26FF' }]}>6.</Text><Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: isDarkMode ? '#10CDFC' : '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> {translations.retirementPlanningTip} </Text>
                        {translations.retirementPlanningTipText}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", alignItems: 'center', marginBottom: 70 }}>
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