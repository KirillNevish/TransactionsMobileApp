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

const Settings = () => {
    const navigation = useNavigation();
    const { translations, changeLanguage, language } = useLanguage();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

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

            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>{translations.settings}</Text>
                </View>
                <View style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ display: "flex", flexDirection: "column", }}>
                        <Text style={styles.languageLabel}>{translations.language}</Text>

                        <View style={styles.languageSwitcher}>
                            <TouchableOpacity
                                style={[styles.languageButton, language === 'pl' && styles.activeButton]}
                                onPress={() => changeLanguage('pl')}
                            >
                                <Text style={styles.languageText}>{translations.polish}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.languageButton, language === 'en' && styles.activeButton]}
                                onPress={() => changeLanguage('en')}
                            >
                                <Text style={styles.languageText}>{translations.english}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.languageButton, language === 'uk' && styles.activeButton]}
                                onPress={() => changeLanguage('uk')}
                            >
                                <Text style={styles.languageText}>{translations.ukrainian} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
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
    },
    languageButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: "#A3A3A3",
    },
    activeButton: {
        backgroundColor: '#1C26FF',
        borderColor: '#1C26FF',
    },
    languageText: {
        color: '#fff',
    }
});

export default Settings;