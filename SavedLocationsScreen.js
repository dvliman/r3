import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import { getLocations } from './HomeScreen';
import { useNavigation } from '@react-navigation/native';

export default function SavedLocationsScreen() {
  const navigation = useNavigation();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Back"
    });

    getLocations().then(setLocations);
  }, []);

  const EmptyListMessage = ({item}) => {
    return (
      <Text>
        No Data Found
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={locations}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Lat: {item.coords.latitude}</Text>
            <Text>Long: {item.coords.longitude}</Text>
          </View>
        )}
        keyExtractor={item => item.timestamp.toString()}
        ListEmptyComponent={EmptyListMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  item: {
    backgroundColor: '#e3e3e3',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});


