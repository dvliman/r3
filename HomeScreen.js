import React, { useState } from 'react';
import * as Location from 'expo-location';
import { View, StyleSheet, ActivityIndicator, Text, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from './Button';

export default function HomeScreen() {
  const [ui, setUI] = useState('ui/ready');
  const [name, setName] = useState('');
  const [location, setLocation] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  const handleGetLocation = async function () {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setUI(status === 'granted' ?
      'ui/location-loading' :
      'ui/location-denied');

    await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest })
      .then(location => {
        setLocation(location);
        setUI('ui/location-granted');
      })
      .catch(_ => setUI('ui/location-error'));
  }

  const toggleSaveModal = () => {
    setSaveModalVisible(!saveModalVisible);
  }

  const handleSaveLocation = async () => {
    await saveLocation({ ...location, name: name });
    toggleSaveModal();
    setName('')
  }

  const handleCancelSaveLocation = () => {
    setName('');
    setInputError(false);
    toggleSaveModal();
  }

  if (ui === 'ui/ready') {
    return (
      <View style={styles.columnContainer}>
        <CustomButton iconName="location-outline" title="Get Location" onPress={async () => handleGetLocation()} />
      </View>
    );
  }

  if (ui === 'ui/location-denied') {
    // TODO: screenshot and image to grant location
    // in settings, open settings button
    return (
      <View style={styles.columnContainer}>
        <CustomButton iconName="location-outline" title="Get Location" onPress={async () => handleGetLocation()} />
        <Text style={{ textAlign: 'center', marginTop: 12, color: 'red' }}>
          Location is denied,  please allow location access. Go to 'Settings' {'=>'} 'Save GPS Locations' {'=>'} 'Location' {'=>'} Allow.
        </Text>
      </View>
    );
  }

  if (ui === 'ui/location-loading') {
    return (
      <View style={styles.columnContainer}>
        <ActivityIndicator color="mediumblue" />
        <Text style={{ textAlign: 'center', marginTop: 12 }}>
          Loading location...
        </Text>
      </View>
    )
  }

  if (ui === 'ui/location-error') {
    return (
      <View style={styles.columnContainer}>
        <CustomButton iconName="location-outline" title="Get Location" onPress={async () => handleGetLocation()} />
        <Text style={{ textAlign: 'center', marginTop: 12, color: 'red' }}>
          Location error.
        </Text>
      </View>
    );
  }

  if (ui === 'ui/location-granted' && location != null) {
    // TODO: after save, show some indication
    // either have [list of saved locations] after clicking the header icon
    // or just have the list at the bottom of this get location button
    // (user can see the new named location)

    return (
      <View style={[styles.columnContainer, { justifyContent: 'flex-start' }]}>
        <View style={styles.rowContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.textLabel}>Latitude (LAT)</Text>
          </View>
          <View style={styles.coordsContainer}>
            <Text style={styles.textCoords}>{location.coords.latitude.toFixed(6)}</Text>
            <Text style={styles.textDMS}>{convertDMSLat(location.coords.latitude)}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.textLabel}>Longitude (LONG)</Text>
          </View>
          <View style={styles.coordsContainer}>
            <Text style={styles.textCoords}>{location.coords.longitude.toFixed(6)}</Text>
            <Text style={styles.textDMS}>{convertDMSLong(location.coords.longitude)}</Text>
          </View>
        </View>
        <View style={styles.splitContainer}>
          <View style={[styles.metersContainer, { marginRight: 8 }]}>
            <View style={styles.labelContainer}>
              <Text style={styles.textLabel}>Accuracy</Text>
            </View>
            <Text style={[styles.textCoords, { fontSize: 36, paddingVertical: 8 }]}>{location.coords.accuracy.toFixed(1)} m</Text>
          </View>
          <View style={[styles.metersContainer, { marginLeft: 8 }]}>
            <View style={styles.labelContainer}>
              <Text style={styles.textLabel}>Altitute</Text>
            </View>
            <Text style={[styles.textCoords, { fontSize: 36, paddingVertical: 8 }]}>{location.coords.altitude.toFixed(1)} m</Text>
          </View>
        </View>
        <CustomButton iconName="bookmark-outline" title="Save Location" onPress={toggleSaveModal} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={saveModalVisible}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.centeredView}
          >
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Give It a Name!</Text>
              </View>
              <View style={styles.modalBody}>
                <View style={{ marginBottom: 24 }}>
                  <TextInput
                    style={[{
                      borderWidth: inputError ? 1 : 0,
                      borderColor: 'red',
                      backgroundColor: inputError ? "lightpink" : '#f2f2f2',
                    },
                    styles.modalInput
                    ]}
                    placeholder="Set a memorable name"
                    onChangeText={setName}
                    value={name}
                    autoFocus={true}
                  />
                  {inputError && <Text style={{ color: 'red' }}>Name can't be empty.</Text>}
                </View>
                <View style={styles.modalButtons}>
                  <CustomButton
                    title="Cancel"
                    onPress={handleCancelSaveLocation}
                    customStyles={{
                      flex: 1,
                      marginRight: 12,
                      backgroundColor: 'lightslategrey',
                    }}
                  />
                  <CustomButton
                    title="Save"
                    onPress={async () => handleSaveLocation()}
                    customStyles={{
                      flex: 2
                    }}
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
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

export async function getLocations() {
  const jsonValue = await AsyncStorage.getItem('@locations') || '[]';
  return JSON.parse(jsonValue).sort((a, b) => a['timestamp'] < b['timestamp']);
}

async function saveLocation(location) {
  const locations = await getLocations();
  await AsyncStorage.setItem('@locations', JSON.stringify([...locations, location]));
}

const styles = StyleSheet.create({
  columnContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'aliceblue',
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  rowContainer: {
    flexDirection: 'column',
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  labelContainer: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    paddingVertical: 8
  },
  textLabel: {
    fontSize: 12,
    color: 'slategray',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  coordsContainer: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  textCoords: {
    fontSize: 56,
    color: 'mediumblue',
    fontWeight: "300",
    textAlign: 'center',
    marginBottom: 2
  },
  textDMS: {
    color: 'mediumblue',
    fontSize: 18,
    textAlign: 'center',
  },
  splitContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metersContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
  modalHeader: {
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: '900',
  },
  modalBody: {
    padding: 24,
  },
  modalInput: {
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
