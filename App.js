import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MoreScreen from './MoreScreen';
import HomeScreen from './HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import * as Sentry from 'sentry-expo';
import CustomButton from './Button';
import SavedLocationsScreen from './SavedLocationsScreen';

function bottomIcon(route, focused) {
  if (route.name === 'Home') {
    return `ios-home${focused ? '' : '-outline'}`;
  } else if (route.name === 'More') {
    return `ios-information-circle${focused ? '' : '-outline'}`;
  }
}

const Tab = createBottomTabNavigator();

function HomeTabs() {
  const primaryColor = 'mediumblue';
  return (
    <Tab.Navigator
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
        // headerShown: false,
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
              iconColor="mediumblue"
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
        name="More"
        component={MoreScreen}
      />
    </Tab.Navigator>
  );
}

Sentry.init({
  dsn: "https://05049c4a63824984ac1cb1066a1d779a@o254208.ingest.sentry.io/5965558",
  enableInExpoDevelopment: true,
  debug: true,
});

const Stack = createNativeStackNavigator();

export default function App() {
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

