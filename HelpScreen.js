import React, { useEffect } from 'react';
import { Linking, Text, View } from 'react-native';
import * as Analytics from './Analytics';
import CustomButton from './Button';

export default function HelpScreen() {
  useEffect(() => {
    async function logEvent() {
      await Analytics.logEvent('HelpScreen');
    }
    logEvent().then(_ => _);
  }, []);

  return (
    <View
      style={{
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 24, lineHeight: 30, fontWeight: '400', marginBottom: 36 }}>
        If you have a feature request or want to report bug, please write us an email. We will
        do our best to respond within 24 hours.
        {'\n'}
        {'\n'}
        Thank you for helping us improve your app experience.
      </Text>
      <CustomButton iconName="mail-outline" title="Send an email" onPress={() => Linking.openURL('mailto:limanoit@gmail.com')} />
    </View>
  );
}
