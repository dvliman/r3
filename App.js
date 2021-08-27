import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MoreScreen from './MoreScreen';
import HomeScreen from './HomeScreen';

import HomeIcon from './assets/icons/home.png';
import HomeActiveIcon from './assets/icons/home-active.png';
import AboutIcon from './assets/icons/about.png';
import AboutActiveIcon from './assets/icons/about-active.png';

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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === 'Home') {
            icon = focused ? HomeActiveIcon : HomeIcon;
          } else if (route.name === 'More') {
            icon = focused ? AboutActiveIcon : AboutIcon;
          }
          return <Image source={icon}/>;
        },
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

