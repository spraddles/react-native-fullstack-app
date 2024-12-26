import { StyleSheet, Image } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
        <Image style={styles.image} source={require('../../assets/images/profile.png')} />
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
    image: {
        padding: 30,
        width: '300',
        height: '300',
        textAlign: 'center',
    }
});
