import React, { useEffect } from 'react';
import { SectionList, SafeAreaView, Linking, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import * as Analytics from './Analytics';
import { Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
  useEffect(() => {
    async function logEvent() {
      await Analytics.logEvent('HelpScreen');
    }
    logEvent().then(_ => _);
  }, []);

  const DATA = [
    {
      title: "Info",
      data: [
        {
          title: 'About',
          action: () => Alert.alert('pressed'),
        },
      ],
    },
    {
      title: "Support",
      data: [
        {
          title: 'Rate us',
          action: () => Alert.alert('pressed'),
        },
        {
          title: 'Send us an email',
          action: () => Linking.openURL('mailto:limanoit@gmail.com'),
        },
        {
          title: 'Version',
          action: () => Alert.alert('Version 1.0.2'),
        }
      ]
    },
  ]

  // Need help on what to show on "about" and "rate us"
  const Item = ({ title, action }) => (
    <Pressable
      style={({ pressed }) => [{ backgroundColor: pressed ? '#e3e3e3' : 'white' }, styles.item]}
      onPress={action}
    >
      <Text style={styles.title}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="gray" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item.title} action={item.action} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6'
  },
  item: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3"
  },
  header: {
    fontSize: 14,
    textTransform: 'uppercase',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 12,
    color: 'gray',
  },
  title: {
    fontSize: 18
  },
});
