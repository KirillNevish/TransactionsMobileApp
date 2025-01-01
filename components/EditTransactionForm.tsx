import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CategoryContext } from '../context/CategoryContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLanguage } from '../context/LanguageContext';

interface Transaction {
    id: string;
    category: string;
    color: string;
    icon: any;
    paymentMethod: string;
    amount: number;
    date: string;
    note: string;

}
interface EditTransactionFormProps {
    transaction: Transaction;
    onSave: (updatedTransaction: Transaction) => void;
    onCancel: () => void;
}

const EditTransactionForm: React.FC<EditTransactionFormProps> = ({
    transaction,
    onSave,
    onCancel,
}) => {
    const { categories } = useContext(CategoryContext);
    const [selectedCategory, setSelectedCategory] = useState(transaction.category);
    const [selectedColor, setSelectedColor] = useState(transaction.color);
    const [selectedImage, setSelectedImage] = useState(transaction.icon);
    const [date, setDate] = useState(transaction.date);
    const [note, setNote] = useState(transaction.note);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const { translations } = useLanguage();

    const currentYear = new Date().getFullYear();

    const showDatePicker = () => setDatePickerVisible(true);
    const hideDatePicker = () => setDatePickerVisible(false);
    const handleDateConfirm = (date) => {
        setDate(date.toISOString().split("T")[0]); // Format date as YYYY-MM-DD
        hideDatePicker();
    };


    const handleCategoryChange = (categoryName: string,) => {
        setSelectedCategory(categoryName);

        // Find the selected category in the list to update color and image
        const category = categories.find((cat) => cat.name === categoryName);
        if (category) {
            setSelectedColor(category.color);
            setSelectedImage(category.icon);
        }
    };

    const handleSave = () => {
        if (!selectedCategory || !date) {
            Alert.alert('Error', `${translations.allFieldAreRequiredError}`);
            return;
        }

        onSave({
            ...transaction,
            category: selectedCategory,
            color: selectedColor,
            icon: selectedImage,
            date,
            note,
        });
    };

    return (
        <View style={styles.modalContainer}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#fff", marginBottom: 20, }}>
                <Text style={{ fontSize: 20, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>{translations.editTransactionText}</Text>
                <TouchableOpacity onPress={onCancel}>
                    <Image source={require('../assets/x.png')} />
                </TouchableOpacity>
            </View>
            <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.category}</Text>
            <View style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: -50,
                marginBottom: 20,
            }}>
                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={handleCategoryChange}
                >
                    {categories.map((cat, index) => (
                        <Picker.Item key={index} label={cat.name} value={cat.name} />
                    ))}
                </Picker>
            </View>
            <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.date}</Text>
            <TouchableOpacity
                onPress={showDatePicker}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 20,

                }}
            >
                <Text>{date || `${currentYear}-00-00`}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
            />
            <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>{translations.Note}</Text>
            <TextInput value={note} onChangeText={setNote} style={styles.input} />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>{translations.saveButton}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
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
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
});

export default EditTransactionForm;