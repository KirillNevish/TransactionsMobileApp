import React, { useRef, useEffect } from 'react';
import {
    Animated,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface SidebarProps {
    isVisible: boolean; // Boolean to control visibility
    onClose: () => void; // Function to close the sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
    const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen (-300px)
    const navigation = useNavigation(); // Access navigation


    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isVisible ? 0 : -300, // Slide to 0 if visible, else back to -300
            duration: 300, // Animation duration (in ms)
            useNativeDriver: true, // Optimize animation
        }).start();
    }, [isVisible]);

    const handleNavigate = (screen: string) => {
        onClose(); // Close the sidebar
        navigation.navigate(screen); // Navigate to the desired screen
    };

    return (
        <Animated.View
            style={[
                styles.sidebarContainer,
                { transform: [{ translateX: slideAnim }] }, // Animate horizontal position
            ]}
        >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.userName}>Imię Nazwisko</Text>
            <View style={styles.menuItems}>
                {[
                    { label: 'Strona główna', screen: 'Homepage' },
                    { label: 'Łączne saldo', screen: 'TotalBalance' },
                    { label: 'Twoje oszczędności', screen: 'Savings' },
                    { label: 'Twoje transakcje', screen: 'Transactions' },
                    { label: 'Nowa transakcja', screen: 'NewTransaction' },
                    { label: 'Kalendarz', screen: 'CalendarScreen' },
                    { label: 'Wskazówki', screen: 'Tips' },
                    { label: 'Ustawienia', screen: 'Settings' },
                ].map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => handleNavigate(item.screen)}
                    >
                        <Text style={styles.menuText}>{item.label}</Text>
                        <Image source={require('../assets/LeftArrow.png')} style={{}} />
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sidebarContainer: {
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        width: 300,
        height: '100%',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        padding: 20,
        zIndex: 10
    },
    closeButton: {
        position: 'absolute',
        top: 43,
        right: 20,
        zIndex: 10,
    },
    closeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Montserrat-Bold',
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 5,
    },
    menuItems: {
        marginTop: 40,
    },
    menuItem: {
        paddingVertical: 12,
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    menuText: {
        fontFamily: 'Montserrat-Light',
        fontSize: 18,
        color: '#1C26FF',
    },
    logoContainer: {
        marginTop: 50,
        alignItems: 'center',

    },
    logo: {

        width: 130,
        height: 130,
        resizeMode: 'contain',
    },
});

export default Sidebar;