import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLocations, removeLocationByTimestamp, formatLocationAsText } from './Utils';
import CustomButton from './Button';

export default function SavedLocationsScreen() {
  const [ locations, setLocations ] = useState([]);

  useEffect(() => {
    getLocations()
      .then(setLocations);
  }, []);

  // TODO: polish this look
  const EmptyListMessage = () => {
    return (
      <Text>
        No Saved Location
      </Text>
    );
  };

  const onShare = (item) =>
    Share.share({message: formatLocationAsText(item)});

  const onDelete = (item) =>
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            removeLocationByTimestamp(item.position.timestamp)
              .then(getLocations)
              .then(setLocations);
          }
        }
      ]
    );

  const onCopy = (item) =>
    Alert.alert(
      'Location copied to clipboard',
      '',
      [
        { text: 'Ok', onPress: () => Clipboard.setString(formatLocationAsText(item)) }
      ]
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'aliceblue' }} edges={[ 'right', 'bottom', 'left' ]}>
      <FlatList
        style={styles.container}
        data={locations}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.nameContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row' }}>
              <View style={styles.coordsContainer}>
                <Text style={styles.label}>LAT</Text>
                <Text style={styles.coords}>{item.position.coords.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.coordsContainer}>
                <Text style={styles.label}>LONG</Text>
                <Text style={styles.coords}>{item.position.coords.longitude.toFixed(6)}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 8,
                borderTopWidth: 1,
                borderTopColor: 'lightgray',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <CustomButton
                  onPress={() => onShare(item)}
                  iconName="share-outline"
                  iconColor="black"
                  customStyles={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: 'transparent',
                  }}
                />
                <CustomButton
                  onPress={() =>onCopy(item) }
                  iconName="copy-outline"
                  iconColor="black"
                  customStyles={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: 'transparent',
                  }}
                />
              </View>
              <CustomButton
                onPress={() => onDelete(item) }
                iconName="trash"
                iconColor="red"
                customStyles={{
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  backgroundColor: 'transparent',
                }}
              />
            </View>
          </View>
        )}
        keyExtractor={(item, _) => item.position.timestamp.toString() }
        ListEmptyComponent={EmptyListMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    marginVertical: 8,
  },
  itemName: {
    fontSize: 24,
    color: 'mediumblue',
    fontWeight: '500',
  },
  nameContainer: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  coordsContainer: {
    flex: 1,
  },
  label: {
    marginBottom: 4,
    fontSize: 12,
    textTransform: 'uppercase',
    color: 'slategray',
  },
  coords: {
    fontSize: 18,
  }
});


