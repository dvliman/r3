import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MoreScreen from './MoreScreen';
import HomeScreen from './HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native';
import * as Sentry from 'sentry-expo';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const primaryColor = 'mediumblue';
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = `ios-home${focused ? '' : '-outline'}`;
          } else if (route.name === 'More') {
            iconName = `ios-information-circle${focused ? '' : '-outline'}`;
          }
          return <Ionicons name={iconName} size={24} color={primaryColor} />;
        },
        tabBarStyle: {
          height: 96,
        },
        tabBarItemStyle: {
          padding: 10,
        },
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColora: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerRight: () => (
            <Button
              onPress={() => alert('navigate to saved locations')}
              title="Saved Locations"
            />
          ),
        }}/>
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

Sentry.init({
  dsn: "https://05049c4a63824984ac1cb1066a1d779a@o254208.ingest.sentry.io/5965558",
  enableInExpoDevelopment: true,
  debug: true,
});

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tab" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

