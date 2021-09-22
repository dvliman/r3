import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLocations } from './HomeScreen';
import CustomButton from './Button';

export default function SavedLocationsScreen() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  const EmptyListMessage = ({ item }) => {
    return (
      <Text>
        No Data Found
      </Text>
    );
  };

  const deleteConfirmation = () => {
    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this location?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => console.log("Yes Pressed") }
      ]
    );
  }

  const copyConfirmation = () => {
    Alert.alert(
      "Location copied to clipboard",
      "",
      [
        { text: "Ok", onPress: () => console.log("Ok Pressed") }
      ]
    );
  }

  const onShare = async (title, lat, long) => {
    try {
      const result = await Share.share({
        message:
          `${title}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'aliceblue' }} edges={['right', 'bottom', 'left']}>
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
                <Text style={styles.coords}>{item.coords.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.coordsContainer}>
                <Text style={styles.label}>LONG</Text>
                <Text style={styles.coords}>{item.coords.longitude.toFixed(6)}</Text>
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
                  onPress={() => onShare(item.name)}
                  iconName="share-outline"
                  iconColor="black"
                  customStyles={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: 'transparent',
                  }}
                />
                <CustomButton
                  onPress={copyConfirmation}
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
                onPress={deleteConfirmation}
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
        keyExtractor={(item, index) => 'key' + index}
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


