

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { StackNavigationProp } from '@react-navigation/stack';

const { width: screenWidth } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Zarządzaj swoimi finansami z łatwością!',
        description:
            'Nasza aplikacja pozwala skutecznie zarządzać finansami przy ograniczonych środkach. Wprowadź miesięczne wynagrodzenie, zdecyduj o podziale na gotówkę i rachunek bezgotówkowy, twórz fundusze na cele.',
        image: require('../assets/piggybank.png'),
    },
    {
        id: '2',
        title: 'Monitoruj wydatki i oszczędzaj efektywnie',
        description:
            'Śledź przepływy finansowe, obserwuj swoje pieniądze, planuj wydatki i oszczędzaj. Skorzystaj z kalendarza finansowego i kalkulatora do codziennego zarządzania budżetem.',
        image: require('../assets/wallet.png'),
    },
    {
        id: '3',
        title: 'Ustalaj cele finansowe i rozwijaj wiedzę',
        description:
            'Wyznaczaj cele finansowe i monitoruj postępy. Aplikacja dostarcza porady finansowe, pomagając użytkownikom z małymi i średnimi dochodami lepiej zarządzać swoimi finansami.',
        image: require('../assets/safe.png'),
    },
];

type OnboardingScreenNavigationProp = StackNavigationProp<
    { Homepage: undefined },
    'Homepage'
>;

interface Props {
    navigation: OnboardingScreenNavigationProp;
}

const Onboarding: React.FC<Props> = ({ navigation }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef<Carousel<any>>(null); // Ref for the carousel

    const renderItem = ({ item }: any) => (
        <View style={styles.slide}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Image source={item.image} style={styles.image} />
            <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    const handleNext = () => {
        if (activeSlide === slides.length - 1) {
            navigation.navigate('Homepage'); // Navigate to Homepage on last slide
        } else {
            const nextIndex = activeSlide + 1;
            setActiveSlide(nextIndex);
            carouselRef.current?.scrollTo({ index: nextIndex, animated: true }); // Move the carousel to the next slide
        }
    };

    return (
        <View style={styles.container}>
            <Carousel
                ref={carouselRef} // Assign the ref
                data={slides}
                renderItem={renderItem}
                width={screenWidth}
                onSnapToItem={(index: number) => setActiveSlide(index)}
                loop={false} // Disable loop
            />
            <View style={styles.paginationAndButtonContainer}>
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeSlide === index ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>
                        {activeSlide === slides.length - 1 ? 'Rozpocznij' : 'Dołączyć'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 72,
        height: 55,
        marginTop: 50,
        marginBottom: 50,
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 25,
        fontFamily: 'Montserrat-Bold',
        fontWeight: 700,
        color: "#1C26FF",
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        color: '#333333',
        fontFamily: 'Montserrat-Light',
        textAlign: 'left',
        marginBottom: 20,
    },
    paginationAndButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#1C26FF',
    },
    inactiveDot: {
        backgroundColor: '#D9D9D9',
    },
    button: {
        backgroundColor: '#0033FF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Light',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Onboarding;