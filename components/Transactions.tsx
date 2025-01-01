import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    Animated,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from './Sidebar';
import { CategoryContext } from '../context/CategoryContext';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';

const CircleVisualization = () => {
    const { categories, categoryTotals, totalAmount } = useContext(CategoryContext);

    const radius = 100; // Radius of the circle
    const strokeWidth = 20;
    const centerX = 150;
    const centerY = 150;
    const circumference = 2 * Math.PI * radius;

    let startAngle = 0;

    return (
        <Svg width={300} height={300}>
            {categories.map((category, index) => {
                const transactionTotal = categoryTotals[category.name] || 0;
                const segmentFraction = transactionTotal / totalAmount;
                const segmentAngle = segmentFraction * 360;

                // Calculate stroke dasharray for the segment
                const segmentLength = circumference * segmentFraction;
                const strokeDashArray = `${segmentLength} ${circumference - segmentLength}`;

                // Rotate the segment to the correct position
                const rotation = `rotate(${startAngle}, ${centerX}, ${centerY})`;

                startAngle += segmentAngle;

                return (
                    <Circle
                        key={index}
                        cx={centerX}
                        cy={centerY}
                        r={radius}
                        stroke={category.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDashArray}
                        transform={rotation}
                        fill="none"
                    />
                );
            })}
            {/* Add total amount at the center */}
            <SvgText
                x={centerX}
                y={centerY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={24}
                fontWeight="bold"
                fill="#000"
            >
                {`zł ${totalAmount}`}
            </SvgText>
        </Svg>
    );
};

export const ICONS = {
    villa: require('../assets/material-symbols_villa.png'),
    soccer: require('../assets/material-symbols_sports-soccer.png'),
    surfing: require('../assets/material-symbols_surfing-sharp.png'),
    drill: require('../assets/material-symbols_tools-power-drill.png'),
    tram: require('../assets/material-symbols_tram.png'),
    bedroom: require('../assets/material-symbols-light_bedroom-parent.png'),
    school: require('../assets/material-symbols_school-rounded.png'),
    meme: require('../assets/Meme.png'),
};



const Transactions = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isBottomBarVisible, setBottomBarVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const context = useContext(CategoryContext);
    const { translations } = useLanguage();
    if (!context) {
        throw new Error("CategoryContext must be used within a CategoryProvider");
    }
    const { categories, setCategories, transactions } = context;

    const bottomBarAnim = useRef(new Animated.Value(300)).current;

    // AsyncStorage keys
    const CATEGORIES_STORAGE_KEY = 'user_categories';

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };


    const toggleBottomBar = () => {
        const bottomBarHeight = 300; // Height of the bottom bar (adjust if necessary)
        if (isBottomBarVisible) {
            // Hide the bottom bar (slide it down)
            Animated.timing(bottomBarAnim, {
                toValue: bottomBarHeight, // Move off-screen
                duration: 300,
                useNativeDriver: true,
            }).start(() => setBottomBarVisible(false)); // Set state after animation
        } else {
            setBottomBarVisible(true); // Set state before animation
            // Show the bottom bar (slide it up)
            Animated.timing(bottomBarAnim, {
                toValue: 0, // Fully visible
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const addCategory = async () => {
        if (!categoryName || !selectedColor || !selectedIcon) {
            Alert.alert('Error', `${translations.allFieldAreRequiredError}`);
            return;
        }

        if (categories.some((cat) => cat.name === categoryName)) {
            Alert.alert('Error', `${translations.sameCategoryNameError}`);
            return;
        }

        // Resolve the icon key to its image source
        const newCategory = {
            name: categoryName,
            color: selectedColor,
            icon: ICONS[selectedIcon], // Resolve the key into the image source here
        };

        const updatedCategories = [...categories, newCategory];

        setCategories(updatedCategories);
        setCategoryName('');
        setSelectedColor(null);
        setSelectedIcon(null);
        toggleBottomBar();

        try {
            // Save the icon key, not the resolved image source, to AsyncStorage
            const categoriesToSave = updatedCategories.map((cat) => ({
                ...cat,
                icon: Object.keys(ICONS).find((key) => ICONS[key] === cat.icon), // Convert back to key
            }));
            await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesToSave));
        } catch (error) {
            console.error('Error saving categories:', error);
        }
    };

    const loadCategories = async () => {
        try {
            const storedCategories = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
            if (storedCategories) {
                const parsedCategories = JSON.parse(storedCategories);

                // Resolve icon keys into actual images
                const resolvedCategories = parsedCategories.map((cat) => ({
                    ...cat,
                    icon: ICONS[cat.icon], // Map the stored key to the image source
                }));

                setCategories(resolvedCategories);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };



    // Load categories on component mount
    useEffect(() => {
        loadCategories();
    }, []);



    const calculateTotalAmountForCategory = (categoryName) => {
        return transactions
            .filter((transaction) => transaction.category === categoryName)
            .reduce((total, transaction) => total + transaction.amount, 0);
    };

    const colors = ['#000586', '#0875D9', '#00867E', '#DF0520', '#E09400', '#00BE07', '#8F6BFF', '#1CD6AB', '#EFEB8A']; const ICONS = {
        villa: require('../assets/material-symbols_villa.png'),
        soccer: require('../assets/material-symbols_sports-soccer.png'),
        surfing: require('../assets/material-symbols_surfing-sharp.png'),
        drill: require('../assets/material-symbols_tools-power-drill.png'),
        tram: require('../assets/material-symbols_tram.png'),
        bedroom: require('../assets/material-symbols-light_bedroom-parent.png'),
        school: require('../assets/material-symbols_school-rounded.png'),
        meme: require('../assets/Meme.png'),
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "fff" }}>
            <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
            <View style={{ height: 120, backgroundColor: "#1C26FF", display: "flex", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline", paddingHorizontal: 20, marginTop: 20 }}>
                    <Image source={require('../assets/logoHeader.png')} style={styles.logo} />
                    <TouchableOpacity onPress={toggleSidebar}>
                        <Image source={require('../assets/Menu.png')} style={styles.menu} />
                    </TouchableOpacity>

                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View>
                    <Text style={styles.title}>{translations.transactions}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <CircleVisualization />
                </View>
                <View style={{}}>
                    <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700, marginVertical: 10 }}>{translations.categoryExpediture}</Text>
                    <View style={{ display: "flex", flexDirection: "column", gap: 8, }}>
                        {categories.map((cat, index) => {
                            const totalAmount = calculateTotalAmountForCategory(cat.name);
                            return (
                                <View key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <View style={[styles.iconContainer, { backgroundColor: cat.color }]}>
                                            {cat.icon && (
                                                <Image source={cat.icon} style={styles.categoryIcon} /> // Use resolved icon
                                            )}
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "column", marginLeft: 12, width: "70%", gap: 8 }}>
                                            <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold', fontWeight: 700, }}>{cat.name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                        <Text style={{ color: "#1C26FF", fontSize: 18, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>zł {totalAmount || 0}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={{ marginTop: 30, marginBottom: 20 }}>
                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", height: 54, borderColor: "#1C26FF", borderWidth: 1, borderRadius: 30 }} onPress={toggleBottomBar}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Image source={require('../assets/plusBlue.png')} style={{}} />
                            <Text style={{ color: "#1C26FF", fontSize: 16, fontFamily: 'Montserrat-Bold', fontWeight: 700, marginLeft: 7 }}>{translations.addCategoryButton}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            {isBottomBarVisible && (
                <Animated.View style={[
                    styles.bottomBar,
                    {
                        transform: [{ translateY: bottomBarAnim }], // Apply animation
                    },
                ]}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#fff", marginBottom: 20, }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{translations.addCategoryButton}</Text>
                        <TouchableOpacity onPress={toggleBottomBar}>
                            <Image source={require('../assets/x.png')} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder={translations.categoryName}
                        value={categoryName}
                        onChangeText={setCategoryName}
                    />
                    <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.chooseCategoryColor}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
                        {colors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.colorOption, { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0, borderColor: '#1C26FF' }]}
                                onPress={() => setSelectedColor(color)}
                            />
                        ))}
                    </ScrollView>
                    <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.chooseCategoryIcon}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
                        {Object.entries(ICONS).map(([key, icon]) => (
                            <TouchableOpacity key={key} onPress={() => setSelectedIcon(key)}> {/* Use the key */}
                                <Image
                                    source={icon}
                                    style={[
                                        styles.iconOption,
                                        { borderWidth: selectedIcon === key ? 2 : 0, borderColor: '#1C26FF', borderRadius: 12 },
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.saveButton} onPress={addCategory}>
                        <Text style={styles.saveButtonText}>{translations.saveButton}</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

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
    addButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#1C26FF',
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    colorScroll: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 12,
        marginHorizontal: 5,
    },
    iconScroll: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    iconOption: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
    },
    saveButton: {
        backgroundColor: '#1C26FF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    categoryName: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default Transactions;