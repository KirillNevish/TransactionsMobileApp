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

const Settings = () => {
    const navigation = useNavigation();
    const { translations, changeLanguage, language } = useLanguage();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

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

            <View style={[styles.container, isDarkMode
                ? { backgroundColor: '#112540' }
                : { backgroundColor: '#fff' }]}>
                <View>
                    <Text style={[styles.title, isDarkMode
                        ? { color: '#fff' }
                        : { color: '#000' }]}>{translations.settings}</Text>
                </View>
                <View style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ display: "flex", flexDirection: "column", }}>
                        <Text style={[styles.languageLabel, isDarkMode
                            ? { color: '#fff' }
                            : { color: '#000' }]}>{translations.language}</Text>

                        <View style={styles.languageSwitcher}>
                            <TouchableOpacity
                                style={[styles.languageButton, language === 'pl' && styles.activeButton, language === 'pl' && {
                                    backgroundColor: isDarkMode ? '#10CDFC' : '#1C26FF',
                                },]}
                                onPress={() => changeLanguage('pl')}
                            >
                                <Text style={styles.languageText}>{translations.polish}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.languageButton, language === 'en' && styles.activeButton, language === 'en' && {
                                    backgroundColor: isDarkMode ? '#10CDFC' : '#1C26FF',
                                },]}
                                onPress={() => changeLanguage('en')}
                            >
                                <Text style={styles.languageText}>{translations.english}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.languageButton, language === 'uk' && styles.activeButton, language === 'uk' && {
                                    backgroundColor: isDarkMode ? '#10CDFC' : '#1C26FF',
                                },]}
                                onPress={() => changeLanguage('uk')}
                            >
                                <Text style={styles.languageText}>{translations.ukrainian} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <TouchableOpacity style={[styles.themeToggle, isDarkMode
                    ? { backgroundColor: '#10CDFC' }
                    : { backgroundColor: '#1C26FF' }]} onPress={toggleTheme}>
                    <Text style={styles.themeToggleText}>
                        {isDarkMode ? translations.lightMode : translations.darkMode}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
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
    },
    languageLabel: {
        marginBottom: 10,
        fontSize: 17,
        fontFamily: 'Montserrat-Bold',
        fontWeight: 700,
    },
    languageSwitcher: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20
    },
    languageButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#A3A3A3",
    },
    activeButton: {
        backgroundColor: '#1C26FF',
        borderColor: '#1C26FF',
    },
    languageText: {
        color: '#fff',
    },
    themeToggle: { marginTop: 20, padding: 15, backgroundColor: '#1C26FF', borderRadius: 10 },
    themeToggleText: { color: '#fff', textAlign: 'center' },
});

export default Settings;