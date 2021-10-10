import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HelpScreen from './HelpScreen';
import HomeScreen from './HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import * as Sentry from 'sentry-expo';
import CustomButton from './Button';
import SavedLocationsScreen from './SavedLocationsScreen';
import * as Analytics from './Analytics';

function bottomIcon(route, focused) {
  if (route.name === 'Home') {
    return `ios-home${focused ? '' : '-outline'}`;
  } else if (route.name === 'Help') {
    return `ios-information-circle${focused ? '' : '-outline'}`;
  }
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function getActiveRouteName(navigationState) {
  if (!navigationState) return null;
  const route = navigationState.routes[navigationState.index];
  if (route.routes) return getActiveRouteName(route);
  return route.routeName;
}

function HomeTabs() {
  const primaryColor = 'black';
  return (
    <Tab.Navigator
      onNavigationStateChange={(prevState, currentState) => {
        const currentScreen = getActiveRouteName(currentState);
        const prevScreen = getActiveRouteName(prevState);
        if (prevScreen !== currentScreen) {
          Analytics.setCurrentScreen(currentScreen);
        }
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          return <Ionicons name={bottomIcon(route, focused)} size={24} color={primaryColor} />;
        },
        tabBarStyle: {
          height: 96,
        },
        tabBarItemStyle: {
          padding: 10,
        },
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ route, navigation }) => ({
          headerRight: () => (
            // TODO: change this to an icon that have a little indicator there is something new
            <CustomButton
              onPress={() => navigation.navigate('Saved Locations')}
              iconName="bookmark"
              iconColor="black"
              customStyles={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                backgroundColor: 'white',
                marginRight: 16,
              }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Help"
        component={HelpScreen}
      />
    </Tab.Navigator>
  );
}

Sentry.init({
  dsn: "https://05049c4a63824984ac1cb1066a1d779a@o254208.ingest.sentry.io/5965558",
  enableInExpoDevelopment: true,
  debug: true,
});

export default function App() {
  Analytics.logEvent('AppStartup').then(_ => _);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
          />
          <Stack.Screen
            name="Saved Locations"
            component={SavedLocationsScreen}
            options={{
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

