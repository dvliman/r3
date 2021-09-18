import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MoreScreen from './MoreScreen';
import HomeScreen from './HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native';
import * as Sentry from 'sentry-expo';
import SavedLocationsScreen from './SavedLocationsScreen';


function bottomIcon(route, focused) {
  if (route.name === 'Home') {
    return `ios-home${focused ? '' : '-outline'}`;
  } else if (route.name === 'More') {
    return `ios-information-circle${focused ? '' : '-outline'}`;
  }
}

const BottomTab = createBottomTabNavigator();

function TabNavigator() {
  const primaryColor = 'mediumblue';
  return (
    <BottomTab.Navigator
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
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({route, navigation}) => ({
          headerRight: () => (
            // TODO: change this to an icon that have a little indicator there is something new
            <Button
              onPress={() => navigation.navigate('SavedLocations')}
              title="Saved Locations"
            />
          ),
        })}/>
      <BottomTab.Screen name="More" component={MoreScreen} />
    </BottomTab.Navigator>
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
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tab" component={TabNavigator} />
        <Stack.Screen name="SavedLocations" component={SavedLocationsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

