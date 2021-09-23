import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getLocations() {
  const jsonValue = await AsyncStorage.getItem('@locations') || '[]';
  return JSON.parse(jsonValue).sort((a, b) => a.position.timestamp < b.position.timestamp);
}

// location: (position, name, address)
export async function saveLocation(location) {
  const locations = await getLocations();
  await AsyncStorage.setItem('@locations', JSON.stringify([...locations, location]));
}

export async function removeLocationByTimestamp(timestamp) {
  const locations = await getLocations();
  const filtered = locations.filter((location) => location.position.timestamp !== timestamp);
  await AsyncStorage.setItem('@locations', JSON.stringify(filtered));
}
