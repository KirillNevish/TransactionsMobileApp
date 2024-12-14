import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Loading: undefined;
    Onboarding: undefined;
    Homepage: undefined;
};

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;

const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState<number>(0); // Progress percentage
    const animation = new Animated.Value(progress);
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

    const getBoxStyle = (index: number) => {
        const thresholds = [20, 45, 65, 85, 100];
        return {
            backgroundColor: progress >= thresholds[index] ? '#1C26FF' : '#D9D9D9', // Light or dark
        };
    };

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/logo.png')} // Replace with your logo
                style={[styles.logo, {
                    opacity: animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0.5, 1], // Fade in during load
                    }),
                }]}
            />
            <View style={styles.barContainer}>
                {[...Array(5)].map((_, index) => (
                    <View key={index} style={[styles.box, getBoxStyle(index)]} />
                ))}
            </View>
            <Text style={styles.percentage}>{progress}%</Text>
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