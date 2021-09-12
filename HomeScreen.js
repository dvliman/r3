import React, { useState } from 'react';
import * as Location from 'expo-location';
import { View, StyleSheet, Button, Text, TouchableHighlight, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [ui, setUI] = useState('ui/ready');
  const [name, setName] = useState('');
  const [location, setLocation] = useState(null);
  const [saveModalVisible, setSaveSaveModalVisible] = useState(false);

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

  const toggleSaveModal = () =>
    setSaveSaveModalVisible(!saveModalVisible);

  const handleSaveLocation = async () => {
    await saveLocation({ ...location, name: name });
    toggleSaveModal();
  }

  const handleCancelSaveLocation = () => {
    setName('');
    toggleSaveModal();
  }

  if (ui === 'ui/ready') {
    return (
      <View style={styles.columnContainer}>
        <View style={styles.getLocationButton}>
          <Button
            title="Get Location"
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
    // TODO: after save, show some indication
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
          onPress={toggleSaveModal}
        />

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={saveModalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  style={styles.modalText}
                  placeholder="Set a memorable name"
                  onChangeText={setName}
                  value={name}
                />
                <TouchableHighlight
                  style={styles.openButton}
                  onPress={async () => handleSaveLocation()}>
                  <Text style={styles.textStyle}>Save Location</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.openButton}
                  onPress={handleCancelSaveLocation}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
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

async function getLocations() {
  const jsonValue = await AsyncStorage.getItem('@locations') || '[]';
  return JSON.parse(jsonValue).sort((a, b) => a['timestamp'] < b['timestamp']);
}

async function saveLocation(location) {
  const locations = await getLocations();
  await AsyncStorage.setItem('@locations', JSON.stringify([...locations, location]));
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
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: 'blue',
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
