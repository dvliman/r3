import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoreScreen from './MoreScreen';


export default function App() {
  const [location, setLocation] = useState(null);
  const [UIState, setUIState] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setUIState('location-error');
  //       return;
  //     }
  //
  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //     setUIState('location-received');
  //   })();
  // }, []);
  //
  // console.log(UIState);
  // if (UIState === 'location-error') {
  //   return (
  //     <View style={styles.container}>
  //       <Text>There was some error getting location</Text>
  //     </View>
  //   )
  // } else if (UIState === 'location-received') {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Latitude</Text>
  //       <Text>{location["coords"]["latitude"]}</Text>
  //       <Text>Longitude</Text>
  //       <Text>{location["coords"]["longitude"]}</Text>
  //       <Text>Accuracy</Text>
  //       <Text>{location["coords"]["accuracy"]}</Text>
  //     </View>
  //   );
  // // } else if (UIState === 'saved-locations') {
  // } else {
  //   console.log('display saved location');
  //   return (
  //     <View style={styles.container}>
  //       <Text>displaying saved location</Text>
  //     </View>
  //   )
  // }

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="More" component={MoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

