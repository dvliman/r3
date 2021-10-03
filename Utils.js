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

export function formatLocationAsText(item) {
  return `
Latitude: ${item.position.coords.latitude}
Longitude: ${item.position.coords.longitude}
Address: ${item.address.name}, ${item.address.city}, ${item.address.region}, ${item.address.postalCode}
Date: ${(new Date()).toLocaleDateString()}
Name: ${item.name}
Google Maps: https://maps.google.com/maps?q=${item.position.coords.latitude},${item.position.coords.longitude}
Apple Maps: https://maps.apple.com/?ll=${item.position.coords.latitude},${item.position.coords.longitude}`;
}

