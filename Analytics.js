import * as Amplitude from 'expo-analytics-amplitude';

Amplitude.initializeAsync('2cc610b2856fbccc585229292a4e2fa3');

export async function logEvent(eventName) {
  await Amplitude.logEventAsync(eventName);
}

export async function logEventWithProperties(eventName, properties) {
  await Amplitude.logEventWithPropertiesAsync(eventName, properties);
}

