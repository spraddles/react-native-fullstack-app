import { StyleSheet, Image, ScrollView } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text, View } from '@/components/Themed';

const fieldValues = {
    name: 'John',
    surname: 'Smith',
    email: 'john.smith@gmail.com',
    phone: '+55 21 90909-9090',
    cpf: '123.456.789-00'
};

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image style={styles.image} source={require('../../assets/images/profile.png')} />
        <Input
            label={'Name'}
            value={fieldValues.name}
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
            value={fieldValues.surname}
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
            value={fieldValues.email}
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
            value={fieldValues.phone}
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
            value={fieldValues.cpf}
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
        padding: 30,
        width: '300',
        height: '300',
        textAlign: 'center',
    }
});
