import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Image } from 'react-native';
import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { ExternalLink } from '@/components/ExternalLink';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import Colors from '@/constants/Colors';

export default function ModalScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'About',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/images/logo.png')} />
      <Text style={styles.body}>GlobalPay ® is a simple but powerful app that allows instant funds transfers to more than 200 countries around the world. Visit our website for more information about 
        <ExternalLink
            style={styles.helpLink}
            href="https://policies.google.com/privacy">
            <Text style={styles.helpLinkText} lightColor={Colors.light.tint}> our legal </Text>
        </ExternalLink>
      policies.</Text>
      <Text style={styles.body}>Copyright © 2000–2024 GlobalPay Inc. All rights reserved.</Text>
      <Text style={styles.versionText}>Version 1.02.367B </Text>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 35,
  },
  body: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15
  },
  image: {
    width: '300',
    height: '70',
    marginBottom: 20
  },
  versionText: {
    fontSize: 15,
    color: '#777',
  }
});
