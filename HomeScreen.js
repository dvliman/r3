import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import CustomButton from './Button';
import { saveLocation } from './Utils';
import * as Analytics from './Analytics';

export default function HomeScreen() {
  const [ui, setUI] = useState('ui/ready');
  const [name, setName] = useState('');
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  useEffect(() => {
    async function logEvent() {
      await Analytics.logEvent('HomeScreen');
    }
    logEvent().then(_ => _);
  }, []);

  const handleGetLocation = async function () {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setUI(status === 'granted' ?
      'ui/location-loading' :
      'ui/location-denied');

    // TODO: proper error handling
    const position = await Location.getCurrentPositionAsync(
      { accuracy: Location.Accuracy.Lowest });

    const addresses = await Location.reverseGeocodeAsync(position.coords);

    setPosition(position);
    setAddress(addresses[0]);
    setUI('ui/location-granted');

    await Analytics.logEventWithProperties('GetLocation', {
      status: status,
      position: position,
      address: addresses[0]
    });
  }

  const toggleSaveModal = () => {
    setSaveModalVisible(!saveModalVisible);
  }

  const handleSaveLocation = async () => {
    await Analytics.logEventWithProperties('SaveLocation', {
      position: position,
      address: address,
    });
    await saveLocation({position: position, name: name, address: address});
    handleResetLocation().then(_ => _);
  }

  const handleResetLocation = async () => {
    await Analytics.logEvent('ResetLocation');
    setUI('ui/ready');
    setName('');
    setPosition(null);
    setAddress(null);
    setInputError(false);
  }

  const handleCancelSaveLocation = async () => {
    await Analytics.logEvent('CancelSaveLocation');
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

  if (ui === 'ui/location-granted') {
    // TODO: temporarily changing to ScrollView because I test with iphone 8
    // that has big circle button to put app in background so I can restart the app
    // iphone 8 is small screen so the screen is chopped off in the middle - how to handle this case?
    // also added a reset button that should "clear" current input i.e user don't want to use this geolocation
    //
    // had to remove this when switching to scrollview { justifyContent: 'flex-start' }
    return (
      <ScrollView style={[styles.columnContainer]}>
        <View style={styles.rowContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.textLabel}>Latitude (LAT)</Text>
          </View>
          <View style={styles.coordsContainer}>
            <Text style={styles.textCoords}>{position.coords.latitude.toFixed(6)}</Text>
            <Text style={styles.textDMS}>{convertDMSLat(position.coords.latitude)}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.textLabel}>Longitude (LONG)</Text>
          </View>
          <View style={styles.coordsContainer}>
            <Text style={styles.textCoords}>{position.coords.longitude.toFixed(6)}</Text>
            <Text style={styles.textDMS}>{convertDMSLong(position.coords.longitude)}</Text>
          </View>
        </View>
        <View style={styles.splitContainer}>
          <View style={[styles.metersContainer, { marginRight: 8 }]}>
            <View style={styles.labelContainer}>
              <Text style={styles.textLabel}>Accuracy</Text>
            </View>
            <Text style={[styles.textCoords, { fontSize: 36, paddingVertical: 8 }]}>{position.coords.accuracy.toFixed(1)} m</Text>
          </View>
          <View style={[styles.metersContainer, { marginLeft: 8 }]}>
            <View style={styles.labelContainer}>
              <Text style={styles.textLabel}>Altitute</Text>
            </View>
            <Text style={[styles.textCoords, { fontSize: 36, paddingVertical: 8 }]}>{position.coords.altitude.toFixed(1)} m</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.textLabel}>Address</Text>
          </View>
          {/* note: I was thinking to separate the (street name) from (city, region, postalCode)
              so it looks a bit more 'aligned' but please do whatever make sense */}
          <View style={styles.coordsContainer}>
            <Text style={styles.textAddress}>{address.name}</Text>
            <Text style={styles.textAddress}>{address.city + ", " + address.region + ", " + address.postalCode}</Text>
          </View>
        </View>
        <CustomButton iconName="bookmark-outline" title="Save Location" onPress={toggleSaveModal} />
        <CustomButton iconName="bookmark-outline" title="Reset" onPress={handleResetLocation} />

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
      </ScrollView>
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
    flex: 1,
    alignContent: 'center',
    // TODO: because of the ScrollView above
    // justifyContent: 'center',
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
  textAddress: {
    fontSize: 20,
    color: 'mediumblue',
    fontWeight: "400",
    textAlign: 'center',
    // marginBottom: 2
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
