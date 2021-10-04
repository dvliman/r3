import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import * as Analytics from './Analytics';

export default function MoreScreen() {
  useEffect(() => {
    async function logEvent() {
      await Analytics.logEvent('MoreScreen');
    }
    logEvent().then(_ => _);
  }, []);

  return (
    <View>
      <Text>more screen</Text>
    </View>
  );
}
