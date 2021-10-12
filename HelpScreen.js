import React, { useEffect } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
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
        Thank you for helping us improve your app experience.
        {'\n'}
        {'\n'}
        We will do our best to respond within 24 hours and keep you posted with any updates to your reported bug.
      </Text>
      <CustomButton iconName="mail-outline" title="Contact us" onPress={() => Linking.openURL('mailto:limanoit@gmail.com')} />
    </View>
  );
}
