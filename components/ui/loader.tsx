import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

type LoaderProps = {
 active: boolean;
};

export function Loader({ active }: LoaderProps) {
 if (!active) return null;

 return (
   <View style={styles.container}>
     <ActivityIndicator size="large" color="#fff" />
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   position: 'absolute',
   top: 0,
   left: 0,
   right: 0,
   bottom: 0,
   backgroundColor: 'rgba(0,0,0,0.7)',
   justifyContent: 'center',
   alignItems: 'center',
   zIndex: 999,
 }
});