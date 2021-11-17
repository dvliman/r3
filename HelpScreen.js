import React, { useEffect, useState } from 'react';
import { SectionList, SafeAreaView, Linking, StyleSheet, Text, View, Modal, Pressable, Alert } from 'react-native';
import * as Analytics from './Analytics';
import { Ionicons } from '@expo/vector-icons';

const appleId = 1585748773;

export default function HelpScreen() {
  const [modalOpen, setModalOpen] = useState(false);

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
          action: () => setModalOpen(!modalOpen),
        },
      ],
    },
    {
      title: "Support",
      data: [
        {
          title: 'Rate us',
          action: () => Linking.openURL(
            `https://apps.apple.com/us/app/save-geolocation-app/id${appleId}?action=write-review`
          ),
        },
        {
          title: 'Send us an email',
          action: () => Linking.openURL('mailto:limanoit@gmail.com'),
        },
        {
          title: 'Version',
          action: () => Alert.alert('Version 1.0.3'),
        }
      ]
    },
  ]

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
      <Modal
        animationType="slide"
        visible={modalOpen}
        presentationStyle="formSheet"
      >
        <View style={styles.modal}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 32, fontWeight: 'bold' }}>About</Text>
            <Pressable
              style={{
                backgroundColor: 'black',
                borderRadius: 50,
                width: 32, height: 32,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => setModalOpen(!modalOpen)}
            >
              <Ionicons name="close-outline" size={24} color="white" style={{ marginLeft: 1, marginTop: 1 }} />
            </Pressable>
          </View>
          <Text
            style={{
              marginTop: 24,
              fontSize: 24,
              lineHeight: 32,
              fontWeight: '300'
            }}
          >
            Thank you for your interest in the Save Geolocation App! We are a small group of developers that love to create simple and easy-to-use applications.
            {"\n"}{"\n"}
            Please rate and leave a review to support us! We welcome any constructive feedback to make this app better for everyone.
          </Text>
        </View>
      </Modal>
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
  modal: {
    padding: 24,
  }
});
