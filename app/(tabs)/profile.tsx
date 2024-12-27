import { StyleSheet, Image, ScrollView } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text, View } from '@/components/Themed';

import { useBaseStore } from '@/store/base';

export default function ProfileScreen() {

    const user = useBaseStore((state) => state.user)

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image style={styles.image} source={require('../../assets/images/profile.png')} />
        <Input
            label={'Name'}
            value={user.name}
            placeholder={'Enter your name'}
            keyboardType={'default'}
            returnKeyType="done"
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
            }}
            error={false}
            errorText={'Name is required'}
        />
        <Input
            label={'Surname'}
            value={user.surname}
            placeholder={'Enter your surname'}
            keyboardType={'default'}
            returnKeyType="done"
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
            }}
            error={false}
            errorText={'Surname is required'}
        />
        <Input
            label={'Email'}
            value={user.email}
            placeholder={'Enter your email'}
            keyboardType={'email-address'}
            returnKeyType="done"
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
            }}
            error={false}
            errorText={'Email is required'}
        />
        <Input
            label={'Phone'}
            value={user.phone}
            placeholder={'Enter your phone'}
            keyboardType={'phone-pad'}
            returnKeyType="done"
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
            }}
            error={false}
            errorText={'Phone is required'}
        />
        <Input
            label={'CPF'}
            value={user.cpf}
            placeholder={'Enter your CPF'}
            keyboardType={'phone-pad'}
            returnKeyType="done"
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
            }}
            error={false}
            errorText={'CPF is required'}
        />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 35,
    },
    image: {
        padding: 20,
        width: '200',
        height: '200',
        textAlign: 'center',
    }
});
