import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define type for translations
type Translations = {
    goHome: string;

    settings: string;
    totalBalance: string;
    savings: string;
    tips: string;
    TransactionsHistoryFHalf: string;
    TransactionsHistorySHalf: string;
    card: string;
    cash: string;
    editButton: string;
    readButton: string;
    viewAllButton: string;
    cumulative: string;
    financialLiteracyTips: string;
    tipsThatMightBeHelpful: string;
    noRecentTransactions: string;
    Sidebar: string;
    homepage: string;
    transactions: string;
    newTransaction: string;
    calendarScreen: string;
    profit: string;
    otherIncome: string;
    saveButton: string;
    addCategoryButton: string;
    categoryExpediture: string;
    categoryName: string;
    chooseCategoryColor: string;
    chooseCategoryIcon: string;
    category: string;
    noCategoriesText: string;
    cardOrCash: string;
    sum: string;
    date: string;
    Note: string;
    allFieldAreRequiredError: string;
    sameCategoryNameError: string;
    notAllFieldsError: string;
    invalidCategoryError: string;
    amountNotPositiveError: string;
    insufficientCardBalanceError: string;
    insufficientCashBalanceError: string;
    failedToSaveTransactionError: string;
    noTransactionsYet: string;
    editTransactionText: string;
    newGoal: string;
    savingDataError: string;
    AccumulationPurpose: string;
    startDate: string;
    endDate: string;
    insufficientBalanceError: string;
    topUps: string;
    goalReached: string;
    goalNotReached: string;
    createAGoalText: string;
    topUpButton: string;
    addtopUpText: string;
    numbersOnlyError: string;


    budgetingTip: string;
    budgetingTipText: string;

    savingTip: string;
    savingTipText: string;

    InvestingTip: string;
    InvestingTipText: string;

    developingSkillsTip: string;
    developingSkillsTipText: string;

    debtReductionTip: string;
    debtReductionTipText: string;

    retirementPlanningTip: string;
    retirementPlanningTipText: string;

    monthNames: string[];
    monthNamesShort: string[];
    dayNames: string[];
    dayNamesShort: string[];



    language: string;
    polish: string;
    english: string;
    ukrainian: string;

    selectCurrency: string;
};

// Define type for the translations object
type TranslationMap = {
    [key: string]: Translations;
};

// Define type for context value
interface LanguageContextType {
    language: string;
    translations: Translations;
    changeLanguage: (lang: string) => void;
}

// Props for the LanguageProvider component
interface LanguageProviderProps {
    children: ReactNode;
}

// Translations
const translations: TranslationMap = {
    pl: {
        Sidebar: 'Pasek boczny',


        goHome: 'Strona główna',

        //pages Names
        homepage: 'Strona główna',
        settings: 'Ustawienia',
        totalBalance: 'Łączne saldo',
        transactions: 'Twoje transakcje',
        newTransaction: 'Nowa transakcja',
        savings: 'Twoje oszczędności',
        calendarScreen: 'Kalendarz',
        newGoal: 'Nowy cel',
        tips: 'Wskazówki',
        TransactionsHistoryFHalf: 'Тransakcji',
        TransactionsHistorySHalf: 'historia',

        profit: 'Zysk',
        otherIncome: 'Inne źródła dochodu',
        card: 'Karta',
        cash: 'Gotówka',

        editButton: 'Edytuj',
        readButton: 'Czytaj',
        viewAllButton: 'Wszystkie',
        saveButton: 'Zapisz',
        addCategoryButton: 'Dodaj kategorię',

        cumulative: 'Skumulowane:',

        financialLiteracyTips: 'Wskazówki dotyczące umiejętności finansowych',
        tipsThatMightBeHelpful: 'Wskazówek dotyczących umiejętności finansowych, które mogą być przydatne:',

        noRecentTransactions: 'Brak ostatnich transakcji.',

        categoryExpediture: 'Expenditure',
        categoryName: 'Nazwa kategorii',
        chooseCategoryColor: 'Wybierz kolor',
        chooseCategoryIcon: 'Wybierz ikonę',
        allFieldAreRequiredError: 'Wszystkie pola są wymagane!',
        sameCategoryNameError: 'Kategoria o tej nazwie już istnieje!',

        category: 'Kategoria',
        noCategoriesText: 'Brak dostępnych kategorii. Proszę najpierw dodać kategorię.',
        notAllFieldsError: 'Proszę wypełnić wszystkie wymagane pola.',
        invalidCategoryError: 'Wybrano nieprawidłową kategorię.',
        amountNotPositiveError: 'Kwota musi być liczbą dodatnią.',
        insufficientCardBalanceError: 'Niewystarczające saldo karty.',
        insufficientCashBalanceError: 'Niewystarczające saldo środków pieniężnych.',
        failedToSaveTransactionError: 'Nie udało się zapisać transakcji',

        insufficientBalanceError: 'Niewystarczające saldo, aby dodać tę kwotę.',
        topUps: 'Doładowania',
        goalReached: 'Cel osiągnięty!',
        goalNotReached: 'Cel nie został osiągnięty na czas.',
        createAGoalText: 'Najpierw ustal cel.',
        topUpButton: 'Doładuj',
        addtopUpText: 'Doładowanie',

        savingDataError: 'Wystąpił problem podczas zapisywania danych.',
        AccumulationPurpose: 'Cel akumulacji',
        startDate: 'Data początkowa',
        endDate: 'Data zakończenia',

        cardOrCash: 'Gotówka Karta',
        sum: 'Kwota',
        date: 'Data',
        Note: 'Notatka (fakultatywny)',

        numbersOnlyError: 'Wszystkie pola muszą zawierać tylko liczby.',

        noTransactionsYet: 'Brak transakcji.',

        editTransactionText: 'Edycja transakcji',

        budgetingTip: 'Budżetowanie:',
        budgetingTipText: 'Zdobądź nawyk śledzenia swoich dochodów i wydatków. Stwórz budżet, który pomoże Ci świadomie planować wydatki i oszczędności.',

        savingTip: 'Oszczędzanie:',
        savingTipText: 'Przeznacz określoną część swojego dochodu na oszczędności. Staraj się odkładać co najmniej 10-20% swoich dochodów na nieprzewidziane wydatki lub na cele długoterminowe, takie jak emerytura lub fundusz awaryjny.',

        InvestingTip: 'Inwestowanie:',
        InvestingTipText: 'Zdobądź podstawową wiedzę na temat różnych instrumentów inwestycyjnych, takich jak akcje, obligacje, nieruchomości, fundusze indeksowe itp. Inwestowanie może pomóc w budowaniu bogactwa i osiąganiu długoterminowych celów finansowych.',

        developingSkillsTip: 'Rozwijanie umiejętności:',
        developingSkillsTipText: 'Inwestuj w swój rozwój zawodowy i osobisty. Rozwijaj umiejętności, które mogą zwiększyć Twoje możliwości zarobkowe lub umożliwić Ci rozwój kariery.',

        debtReductionTip: 'Redukcja zadłużenia:',
        debtReductionTipText: 'Stosuj strategie spłaty zadłużenia, zaczynając od najbardziej kosztownych lub najwyższych oprocentowań. Unikaj zadłużania się ponad miarę i staraj się regularnie spłacać długi.',

        retirementPlanningTip: 'Planowanie emerytalne:',
        retirementPlanningTipText: ' Rozważ swoje cele emerytalne i opracuj plan oszczędzania lub inwestowania, który pomoże Ci osiągnąć te cele. Im wcześniej zaczniesz odkładać na emeryturę, tym większe będą Twoje szanse na zabezpieczenie się na przyszłość.',

        monthNames: [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
        ],
        monthNamesShort: [
            'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru',
        ],
        dayNames: [
            'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota',
        ],
        dayNamesShort: [
            'Ndz', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob',
        ],


        language: 'Język',
        polish: 'Polski',
        english: 'Angielski',
        ukrainian: 'Ukraiński',

        selectCurrency: 'Wybierz walutę',
    },
    en: {
        Sidebar: 'Sidebar',

        goHome: 'Home',

        //pages Names
        homepage: 'Home page',
        settings: 'Settings',
        totalBalance: 'Total Balance',
        transactions: 'Your transactions',
        newTransaction: 'New transaction',
        newGoal: 'New goal',
        calendarScreen: 'Calendar',
        savings: 'Your Savings',
        tips: 'Tips',
        TransactionsHistoryFHalf: 'Transactions',
        TransactionsHistorySHalf: 'history',

        profit: 'Profit',
        otherIncome: 'Other sources of income',
        card: 'Сard',
        cash: 'Сash',

        editButton: 'Edit',
        readButton: 'Read',
        viewAllButton: 'View all',
        saveButton: 'Save',
        addCategoryButton: 'Add category',

        cumulative: 'cumulative',

        financialLiteracyTips: 'Financial literacy tips',
        tipsThatMightBeHelpful: 'Financial literacy tips that may be helpful:',

        noRecentTransactions: 'No recent Transactions',

        categoryExpediture: 'Expenditure',
        categoryName: 'Category name',
        chooseCategoryColor: 'Select color',
        chooseCategoryIcon: 'Select icon',
        allFieldAreRequiredError: 'All fields are required!',
        sameCategoryNameError: 'A category with this name already exists!',

        category: 'Category',
        noCategoriesText: 'No categories available. Please add a category first.',

        notAllFieldsError: 'Please complete all required fields.',
        invalidCategoryError: 'Invalid category selected.',
        amountNotPositiveError: 'Amount must be a positive number.',
        insufficientCardBalanceError: 'Insufficient card balance.',
        insufficientCashBalanceError: 'Insufficient cash balance.',
        failedToSaveTransactionError: 'failed to save transaction.',

        insufficientBalanceError: 'Insufficient balance to add this amount.',
        topUps: 'Top-ups',
        goalReached: 'Goal achieved!',
        goalNotReached: 'The goal was not achieved in time.',
        createAGoalText: 'Create a goal first.',
        topUpButton: 'Top up',
        addtopUpText: 'Top-up',

        savingDataError: 'There was a problem saving your data.',
        AccumulationPurpose: 'The purpose of accumulation',
        startDate: 'Start date',
        endDate: 'End date',

        cardOrCash: 'Cash Card',
        sum: 'Amount',
        date: 'Date',
        Note: 'Note (optional)',

        numbersOnlyError: 'All fields must contain numbers only.',

        noTransactionsYet: 'No transactions yet.',

        editTransactionText: 'Edit transaction',

        budgetingTip: 'Budgeting:',
        budgetingTipText: 'Get into the habit of tracking your income and expenses. Create a budget that will help you consciously plan your spending and savings.',

        savingTip: 'Saving:',
        savingTipText: 'Set aside a certain percentage of your income for savings. Try to set aside at least 10-20% of your income for unexpected expenses or long-term goals, such as retirement or an emergency fund.',

        InvestingTip: 'Investing:',
        InvestingTipText: 'Gain basic knowledge about different investment vehicles such as stocks, bonds, real estate, index funds, etc. Investing can help you build wealth and achieve your long-term financial goals.',

        developingSkillsTip: 'Developing skills:',
        developingSkillsTipText: 'Invest in your professional and personal development. Develop skills that can increase your earning potential or allow you to advance your career.',

        debtReductionTip: 'Debt reduction:',
        debtReductionTipText: 'Use debt repayment strategies starting with the most expensive or highest interest rates. Avoid taking on too much debt and try to pay off debts regularly.',

        retirementPlanningTip: 'Retirement planning:',
        retirementPlanningTipText: 'Consider your retirement goals and develop a savings or investment plan that will help you achieve those goals. The earlier you start saving for retirement, the better your chances of securing your future.',

        monthNames: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ],
        monthNamesShort: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ],
        dayNames: [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
        ],
        dayNamesShort: [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
        ],


        language: 'Language',
        polish: 'Polish',
        english: 'English',
        ukrainian: 'Ukrainian',

        selectCurrency: 'Select Currency',
    },
    uk: {
        Sidebar: "Бічна панель",

        goHome: 'Головна сторінка',

        //pages Names
        homepage: 'Головна сторінка',
        settings: 'Налаштування',
        totalBalance: 'Загальний баланс',
        transactions: 'Ваші транзакції',
        newTransaction: 'Нова транзакція',
        newGoal: 'Нова ціль',
        calendarScreen: 'Календар',
        savings: 'Ваші заощадження',
        tips: 'Поради',
        TransactionsHistoryFHalf: 'Транзакції',
        TransactionsHistorySHalf: 'історія',

        profit: 'Прибуток',
        otherIncome: 'Інші джерела доходу',
        card: 'Картка',
        cash: 'Готівка',

        editButton: 'Редагувати',
        readButton: 'Читати',
        viewAllButton: 'Все',
        saveButton: 'Зберегти',
        addCategoryButton: 'Додати категорію',

        cumulative: 'Сукупний:',

        financialLiteracyTips: 'Поради щодо фінансової грамотності',
        tipsThatMightBeHelpful: 'Поради щодо фінансової грамотності, які можуть бути корисними:',

        noRecentTransactions: 'Немає останніх транзакцій.',

        categoryExpediture: 'Витрати',
        categoryName: 'Назва категорії',
        chooseCategoryColor: 'Виберіть колір',
        chooseCategoryIcon: 'Виберіть значок',
        allFieldAreRequiredError: "Усі поля обов'язкові для заповнення!",
        sameCategoryNameError: 'Категорія з такою назвою вже існує!',

        category: 'Категорія',
        noCategoriesText: 'Категорії відсутні. Спочатку додайте категорію.',

        notAllFieldsError: 'Заповніть усі необхідні поля.',
        invalidCategoryError: 'Вибрано недійсну категорію.',
        amountNotPositiveError: 'Сума має бути додатним числом.',
        insufficientCardBalanceError: 'Недостатній баланс картки.',
        insufficientCashBalanceError: 'Недостатній залишок готівки.',
        failedToSaveTransactionError: 'не вдалося зберегти транзакцію.',

        insufficientBalanceError: 'Недостатньо балансу, щоб додати цю суму.',
        topUps: 'Доповнення',
        goalReached: 'Ціль досягнута!',
        goalNotReached: 'Ціль не була досягнута вчасно.',
        createAGoalText: 'По-перше, поставте ціль.',
        topUpButton: 'Поповнити',
        addtopUpText: 'Доповнення',

        savingDataError: 'Під час збереження ваших даних виникла проблема.',
        AccumulationPurpose: 'Ціль накопичення',
        startDate: 'Початкова дата',
        endDate: 'Кінцева дата',

        cardOrCash: 'Готівкова Картка',
        sum: 'Сума',
        date: 'Дата',
        Note: "Примітка (необов'язково)",

        numbersOnlyError: 'Усі поля мають містити лише цифри.',

        noTransactionsYet: 'Транзакцій ще немає.',

        editTransactionText: 'Редагувати Транзакцію',

        budgetingTip: 'Бюджетування:',
        budgetingTipText: 'Візьміть у звичку відстежувати свої доходи та витрати. Створіть бюджет, який допоможе вам свідомо планувати свої витрати та заощадження.',

        savingTip: 'Збереження:',
        savingTipText: 'Спрямуйте певну частину свого доходу на заощадження. Намагайтеся відкладати принаймні 10-20% свого доходу на непередбачені витрати або на довгострокові цілі, такі як вихід на пенсію чи фонд надзвичайних ситуацій.',

        InvestingTip: 'Інвестиції:',
        InvestingTipText: 'Отримайте базові знання про різні інвестиційні інструменти, такі як акції, облігації, нерухомість, індексні фонди тощо. Інвестиції можуть допомогти вам розбагатіти та досягти ваших довгострокових фінансових цілей.',

        developingSkillsTip: 'Розвиток навичок:',
        developingSkillsTipText: 'Інвестуйте у свій професійний та особистий розвиток. Розвивайте навички, які можуть збільшити ваш потенціал заробітку або дозволити вам просунутися по кар’єрі.',

        debtReductionTip: 'Зменшення боргу:',
        debtReductionTipText: 'Використовуйте стратегії погашення боргу, починаючи з найдорожчих або найвищих процентних ставок. Уникайте надмірних боргів і намагайтеся регулярно виплачувати свої борги.',

        retirementPlanningTip: 'Пенсійне планування:',
        retirementPlanningTipText: 'Подумайте про свої цілі щодо виходу на пенсію та розробіть план заощаджень або інвестицій, який допоможе вам досягти цих цілей. Чим раніше ви почнете відкладати гроші на пенсію, тим більше у вас шансів забезпечити своє майбутнє',

        monthNames: [
            'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
        ],
        monthNamesShort: [
            'Січ', 'Лют', 'Бер', 'Квіт', 'Трав', 'Черв', 'Лип', 'Серп', 'Вер', 'Жов', 'Лис', 'Груд',
        ],
        dayNames: [
            'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота',
        ],
        dayNamesShort: [
            'Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб',
        ],


        language: 'Мова',
        polish: 'Польська',
        english: 'Англійська',
        ukrainian: 'Українська',

        selectCurrency: 'Виберіть валюту',
    },
};

// Create Context with a default value
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language Provider Component

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<string>('pl'); // Default to Polish
    // Load saved language from AsyncStorage
    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await AsyncStorage.getItem('appLanguage');
            if (savedLanguage) {
                setLanguage(savedLanguage);
            }
        };
        loadLanguage();
    }, []);

    // Save selected language to AsyncStorage
    const changeLanguage = async (lang: string) => {
        setLanguage(lang);
        await AsyncStorage.setItem('appLanguage', lang);
    };

    const value: LanguageContextType = {
        language,
        translations: translations[language],
        changeLanguage,
    };

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Custom Hook for using Language Context
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};