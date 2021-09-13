import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MoreScreen from './MoreScreen';
import HomeScreen from './HomeScreen';
import { Ionicons } from '@expo/vector-icons';

const Home = createNativeStackNavigator();
const More = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Home.Navigator screenOptions={{ headerShown: false }}>
      <Home.Screen name="HomeScreen" component={HomeScreen} />
    </Home.Navigator>
  );
}

function MoreStack() {
  return (
    <More.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="MoreScreen" component={MoreScreen} />
    </More.Navigator>
  );
}


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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        intialRouteName="Tab"
        headerMode="screen"
      >
        <Stack.Screen name="Tab" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

