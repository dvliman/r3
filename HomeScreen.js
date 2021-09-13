import React, { useState } from 'react';
import * as Location from 'expo-location';
import { View, StyleSheet, Button, Text, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from './Button';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [ui, setUI] = useState('ui/ready');
  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  const handleGetLocation = async function () {
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
    setSaveModalVisible(!saveModalVisible);

  const handleSaveLocation = async () => {
    await saveLocation({ ...location, name: name });
    toggleSaveModal();
  }

  const handleCancelSaveLocation = () => {
    setName(null);
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
        <Text style={{ textAlign: 'center' }}>
          Loading location...
        </Text>
      </View>
    )
  }

  if (ui === 'ui/location-error') {
    return (
      <View style={styles.columnContainer}>
        <Text style={{ textAlign: 'center' }}>
          Location error
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
      <View style={styles.columnContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.text}>Lat: {location['coords']['latitude']}</Text>
            <Text style={styles.text}>Long: {location['coords']['longitude']}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.text}>{convertDMSLat(location['coords']['latitude'])}</Text>
            <Text style={styles.text}>{convertDMSLong(location['coords']['longitude'])}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.text}>Accuracy: {location['coords']['accuracy']} meters</Text>
            <Text style={styles.text}>Altitude: {location['coords']['altitude']} meters</Text>
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
                <TextInput
                  style={styles.modalInput}
                  placeholder="Set a memorable name"
                  onChangeText={setName}
                  value={name}
                  autoFocus={true}
                />
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
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'lightsteelblue',
  },
  text: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    alignItems: 'stretch',
  },
  modalHeader: {
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 24,
  },
  modalInput: {
    marginBottom: 24,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
