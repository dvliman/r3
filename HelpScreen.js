import React, { useEffect } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import * as Analytics from './Analytics';

export default function HelpScreen() {
  useEffect(() => {
    async function logEvent() {
      await Analytics.logEvent('HelpScreen');
    }
    logEvent().then(_ => _);
  }, []);

  return (
    <View>
      <Text style={{textAlign: 'center'}}>
        Thank you for helping us improve your
        {'\n'}
        app experience.
        {'\n'}
        {'\n'}
        {'\n'}
        We will do our best to respond within 24
        {'\n'}
        hours and keep you posted with any
        {'\n'}
        updates to your reported bug.
        {'\n'}
        {'\n'}
      </Text>
      <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email}`)}>
        <Text style={{fontSize: 14, textAlign: 'center', color: '#FF631B'}}>
          limanoit@gmail.com
        </Text>
      </TouchableOpacity>
    </View>
  );
}
