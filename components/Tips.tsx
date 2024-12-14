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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from './Sidebar';

const Tips = () => {
    const navigation = useNavigation();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "fff" }}>
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

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Wskazówki dotyczące umiejętności finansowych</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>1.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> Budżetowanie: </Text>
                        Zdobądź nawyk śledzenia swoich dochodów i wydatków. Stwórz budżet, który pomoże Ci świadomie planować wydatki i oszczędności.</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>2.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> Oszczędzanie: </Text>
                        Przeznacz określoną część swojego dochodu na oszczędności. Staraj się odkładać co najmniej 10-20% swoich dochodów na nieprzewidziane wydatki lub na cele długoterminowe, takie jak emerytura lub fundusz awaryjny.</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>3.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> Inwestowanie: </Text>
                        Zdobądź podstawową wiedzę na temat różnych instrumentów inwestycyjnych, takich jak akcje, obligacje, nieruchomości, fundusze indeksowe itp. Inwestowanie może pomóc w budowaniu bogactwa i osiąganiu długoterminowych celów finansowych.</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>4.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> Rozwijanie umiejętności: </Text>
                        Rozwijanie umiejętności: Inwestuj w swój rozwój zawodowy i osobisty. Rozwijaj umiejętności, które mogą zwiększyć Twoje możliwości zarobkowe lub umożliwić Ci rozwój kariery.</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>5.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> Redukcja zadłużenia: </Text>
                        Stosuj strategie spłaty zadłużenia, zaczynając od najbardziej kosztownych lub najwyższych oprocentowań. Unikaj zadłużania się ponad miarę i staraj się regularnie spłacać długi.</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "#fff", marginBottom: 10 }}>
                    <Text style={styles.numberColumn}>6.</Text><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Light', lineHeight: 24 }}>
                        <Text style={{ color: '#1C26FF', fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}> Planowanie emerytalne: </Text>
                        Rozważ swoje cele emerytalne i opracuj plan oszczędzania lub inwestowania, który pomoże Ci osiągnąć te cele. Im wcześniej zaczniesz odkładać na emeryturę, tym większe będą Twoje szanse na zabezpieczenie się na przyszłość.</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", alignItems: 'center', borderWidth: 1, borderColor: "#fff", marginBottom: 70 }}>
                    <Image source={require('../assets/boy.png')} style={{ resizeMode: 'contain', height: 200 }} />
                    <Image source={require('../assets/TipsImg.png')} style={{ resizeMode: 'contain', height: 200, left: -70 }} />
                </View>
            </ScrollView>
        </View>
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