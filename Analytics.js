import * as Amplitude from 'expo-analytics-amplitude';
import * as Analytics from 'expo-firebase-analytics';

Amplitude.initializeAsync('2cc610b2856fbccc585229292a4e2fa3');
Analytics.setClientId('1:664301208583:web:e7f77bca59f2efe39856a2');

export async function logEvent(eventName) {
  await Amplitude.logEventAsync(eventName);
  await Analytics.logEvent(eventName);
}

export async function logEventWithProperties(eventName, properties) {
  await Amplitude.logEventWithPropertiesAsync(eventName, properties);
  await Analytics.logEvent(eventName, properties);
}

export async function setCurrentScreen(currentScreen) {
  await Analytics.setCurrentScreen(currentScreen);
}
