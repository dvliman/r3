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
        This is a beta app. I really appreciate your feedback!
        {'\n'}
        {'\n'}
        {`\u2022 What features would you add?`}
        {'\n'}
        {'\n'}
        {`\u2022 Which features were least useful?`}
        {'\n'}
        {'\n'}
        {`\u2022 Why wouldn't you use this app again?`}
        {'\n'}
        {'\n'}
        {`\u2022 Which functions didn't work as expected?`}
        {'\n'}
        {'\n'}
        {`\u2022 Did the app help solve your problem/achieve your goal?`}
      </Text>
      <CustomButton iconName="mail-outline" title="Send an email" onPress={() => Linking.openURL('mailto:limanoit@gmail.com')} />
    </View>
  );
}
