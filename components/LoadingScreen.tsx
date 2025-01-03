import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
    Loading: undefined;
    Onboarding: undefined;
    Homepage: undefined;
};

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;

const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState<number>(0); // Progress percentage
    const animation = new Animated.Value(progress);
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const navigation = useNavigation<LoadingScreenNavigationProp>();

    useEffect(() => {
        const checkFirstLaunch = async () => {
            const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');

            // Simulate loading progress
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const nextProgress = Math.min(prev + 5, 100);
                    if (nextProgress === 100) {
                        clearInterval(interval); // Stop at 100%

                        // Navigate based on the flag
                        if (isFirstLaunch === null) {
                            // First launch, navigate to Onboarding
                            AsyncStorage.setItem('isFirstLaunch', 'false'); // Set the flag
                            navigation.navigate('Onboarding');
                        } else {
                            // Not the first launch, navigate to Homepage
                            navigation.navigate('Homepage');
                        }
                    }
                    return nextProgress;
                });
            }, 200);

            return () => clearInterval(interval);
        };

        checkFirstLaunch();
    }, []);

    useEffect(() => {
        // Animate progress
        Animated.timing(animation, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false, // Animated values for non-layout properties
        }).start();
    }, [progress]);

    const getBoxStyle = (index: number, isDarkMode: boolean) => {
        const thresholds = [20, 45, 65, 85, 100];
        return {
            backgroundColor: progress >= thresholds[index] ? isDarkMode
                ? '#10CDFC' // Dark mode active color
                : '#1C26FF'
                : '#D9D9D9', // Light or dark
        };
    };

    return (
        <View style={[styles.container, isDarkMode
            ? { backgroundColor: '#112540' }
            : { backgroundColor: '#fff' }]}>
            <Animated.Image
                source={require('../assets/logo.png')}
                style={[
                    styles.logo,
                    {
                        // opacity: animation.interpolate({
                        //     inputRange: [0, 100],
                        //     outputRange: [0.5, 1], // Animated
                        // }),
                        tintColor: isDarkMode ? '#10CDFC' : '#1C26FF',
                    },
                ]}
            />
            <View style={styles.barContainer}>
                {[...Array(5)].map((_, index) => (
                    <View key={index} style={[styles.box, getBoxStyle(index, isDarkMode)]} />
                ))}
            </View>
            <Text style={[styles.percentage, isDarkMode
                ? { color: '#fff' }
                : { color: '#000' }]}>{progress}%</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 130,
        height: 100,
        marginBottom: 20,
    },
    barContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 150,
        marginTop: 20,
    },
    box: {
        width: 20,
        height: 20,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    percentage: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        fontWeight: 700,
        color: '#000',
    },
});

export default LoadingScreen;