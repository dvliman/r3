import React, { useState } from 'react';
import * as Location from 'expo-location';
import { View, StyleSheet, Button, Text } from 'react-native';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [ui, setUI] = useState('ui/ready');

  const handleGetLocation = async function() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setUI(status === 'granted' ?
      'ui/location-loading' :
      'ui/location-denied');

    await Location.getCurrentPositionAsync({})
      .then(location => {
        setLocation(location);
        setUI('ui/location-granted');
      })
      .catch(_ => setUI('ui/location-error'));
  }

  const handleSaveLocation = () => {
    console.log('handleSaveLocation');
  }

  if (ui === 'ui/ready') {
    return (
      <View style={styles.columnContainer}>
        <View style={styles.getLocationButton}>
          <Button
            title="Get Location"
            color="#841584"
            accessibilityLabel="Get Location"
            onPress={async () => handleGetLocation()}
          />
        </View>
      </View>
    );
  }

  if (ui === 'ui/location-denied') {
    // TODO: screenshot and image to grant location
    // in settings, open settings button
    return (
      <View style={styles.columnContainer}>
        <Text>
          Location is denied
        </Text>
        <Button
          title="Get Location"
          color="#841584"
          accessibilityLabel="Get Location"
          onPress={async () => handleGetLocation()}
        />
      </View>
    );
  }

  if (ui === 'ui/location-loading') {
    return (
      <View style={styles.columnContainer}>
        <Text>loading location</Text>
      </View>
    )
  }

  if (ui === 'ui/location-error') {
    return (
      <View style={styles.columnContainer}>
        <Text>
          Location error
        </Text>
      </View>
    );
  }

  if (ui === 'ui/location-granted' && location != null) {
    // TODO: display location, parse dms
    // display add to saved location, pop up a modal,
    // list of saved location
    console.log(location);
    return (
      <View style={styles.columnContainer}>
        <View style={styles.rowContainer}>
          <Text>Lat: {location['coords']['latitude']}</Text>
          <Text>Long: {location['coords']['longitude']}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text>{convertDMSLat(location['coords']['latitude'])}</Text>
          <Text>{convertDMSLong(location['coords']['longitude'])}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text>Accuracy: {location['coords']['accuracy']} meters</Text>
          <Text>Altitude: {location['coords']['altitude']} meters</Text>
        </View>
        <Button
          title="Save location"
          accessibilityLabel="Save location"
          onPress={async () => handleSaveLocation()}
        />
      </View>
    )
  }

  return (
    <View style={styles.columnContainer}>
      <Text>Something went wrong.</Text>
    </View>
  );
}

function toDegreesMinutesAndSeconds(coordinate) {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  return degrees + "º " + minutes + "' " + seconds + '"';
}

function convertDMSLat(lat) {
  const latitude = toDegreesMinutesAndSeconds(lat);
  const latitudeCardinal = lat >= 0 ? 'N' : 'S';
  return latitude + " " + latitudeCardinal

}

function convertDMSLong(lng) {
  const longitude = toDegreesMinutesAndSeconds(lng);
  const longitudeCardinal = lng >= 0 ? 'E' : 'W';

  return longitude + " " + longitudeCardinal;
}

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  getLocationButton: {
    backgroundColor: 'grey',
    borderWidth: 0,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  }
});
