import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from './components/LoadingScreen';
import Onboarding from './components/Onboarding';
import Homepage from './components/Homepage';
import TotalBalance from './components/TotalBalance';
import { BalanceProvider } from './context/BalanceContext';
import Transactions from './components/Transactions';
import Tips from './components/Tips';
import NewTransaction from './components/NewTransaction';
import { CategoryProvider } from './context/CategoryContext';
import TransactionsHistory from './components/TransactionsHistory';
import { NewestTransactionsProvider } from './context/NewestTransactionsContext';
import CalendarScreen from './components/Calendar';
import NewGoal from './components/NewGoal';
import { GoalProvider } from './context/GoalContext';
import Savings from './components/Savings';
import Settings from './components/Settings';
import { LanguageProvider } from './context/LanguageContext';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <GoalProvider>
        <CategoryProvider>
          <NewestTransactionsProvider>
            <BalanceProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Loading" component={LoadingScreen} />
                  <Stack.Screen name="Onboarding" component={Onboarding} />
                  <Stack.Screen name="Homepage" component={Homepage} />
                  <Stack.Screen name="TotalBalance" component={TotalBalance} />
                  <Stack.Screen name="Transactions" component={Transactions} />
                  <Stack.Screen name="Tips" component={Tips} />
                  <Stack.Screen name="NewTransaction" component={NewTransaction} />
                  <Stack.Screen name="TransactionsHistory" component={TransactionsHistory} />
                  <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
                  <Stack.Screen name="NewGoal" component={NewGoal} />
                  <Stack.Screen name="Savings" component={Savings} />
                  <Stack.Screen name="Settings" component={Settings} />
                </Stack.Navigator>
              </NavigationContainer>
            </BalanceProvider>
          </NewestTransactionsProvider>
        </CategoryProvider>
      </GoalProvider>
    </LanguageProvider>

  );
};

export default App;
