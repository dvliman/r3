import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import { getLocations } from './HomeScreen';
import { useNavigation } from '@react-navigation/native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Item = ({ location }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>some text</Text>
    </View>
  );
};

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

  // TODO: somehow there is 4 prints for undefined
  console.log(locations);

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
        renderItem={({ item }) => (<Item title={item.title} />)}
        keyExtractor={item => item.id}
        ListEmptyComponent={EmptyListMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});


