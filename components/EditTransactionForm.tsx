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

    const handleCategoryChange = (categoryName: string,) => {
        setSelectedCategory(categoryName);

        // Find the selected category in the list to update color and image
        const category = categories.find((cat) => cat.name === categoryName);
        if (category) {
            setSelectedColor(category.color);
            setSelectedImage(category.icon);
        }
    };
    const handleDateInput = (input) => {
        // Remove invalid characters, allowing only numbers and "-"
        let sanitizedInput = input.replace(/[^0-9\-]/g, '');

        // Ensure the format is maintained as "YYYY-MM-DD"
        const parts = sanitizedInput.split('-');

        // Validate each part
        if (parts.length > 3) return; // More than 3 parts is invalid

        let formattedDate = '';

        // Add year part (4 digits)
        if (parts[0]?.length <= 4) formattedDate += parts[0];
        if (parts[0]?.length === 4 && sanitizedInput.length > 4) formattedDate += '-';

        // Add month part (2 digits)
        if (parts[1]?.length <= 2) formattedDate += parts[1];
        if (parts[1]?.length === 2 && sanitizedInput.length > 7) formattedDate += '-';

        // Add day part (2 digits)
        if (parts[2]?.length <= 2) formattedDate += parts[2];

        // Restrict total length to 10 (YYYY-MM-DD)
        if (formattedDate.length > 10) return;

        // Update state
        setDate(formattedDate);
    };

    const handleSave = () => {
        if (!selectedCategory || !date) {
            Alert.alert('Error', 'All fields are required.');
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
                <Text style={{ fontSize: 20, fontFamily: 'Montserrat-Bold', fontWeight: 700 }}>Edycja transakcji</Text>
                <TouchableOpacity onPress={onCancel}>
                    <Image source={require('../assets/x.png')} />
                </TouchableOpacity>
            </View>
            <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Kategoria</Text>
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
            <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Data</Text>
            <TextInput value={date} onChangeText={handleDateInput} placeholder="Date" style={styles.input} maxLength={11} />
            <Text style={{ color: "#76787A", fontSize: 15, fontFamily: 'Montserrat-Light', marginBottom: 10 }}>Notatka (fakultatywny)</Text>
            <TextInput value={note} onChangeText={setNote} placeholder="Note" style={styles.input} />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Zapisz</Text>
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