import { useState } from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text, View } from '@/components/Themed';

import { useBaseStore } from '@/store/base';

export default function ProfileScreen() {

    const user = useBaseStore((state) => state.user)

    const [inputName, setInputName] = useState('')
    const [inputSurname, setInputSurname] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPhone, setInputPhone] = useState('')
    const [inputCPF, setInputCPF] = useState('')

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image style={styles.image} source={require('../../assets/images/profile.png')} />
        <Input
            label={'Name'}
            value={inputName}
            placeholder={'Enter your name'}
            keyboardType={'default'}
            returnKeyType="done"
            onChangeText={setInputName}
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
                useBaseStore.getState().setUser('name', inputName)
            }}
            error={false}
            errorText={'Name is required'}
        />
        <Input
            label={'Surname'}
            value={inputSurname}
            placeholder={'Enter your surname'}
            keyboardType={'default'}
            returnKeyType="done"
            onChangeText={setInputSurname}
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
                useBaseStore.getState().setUser('surname', inputSurname)
            }}
            error={false}
            errorText={'Surname is required'}
        />
        <Input
            label={'Email'}
            value={inputEmail}
            placeholder={'Enter your email'}
            keyboardType={'email-address'}
            returnKeyType="done"
            onChangeText={setInputEmail}
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
                useBaseStore.getState().setUser('email', inputEmail)
            }}
            error={false}
            errorText={'Email is required'}
        />
        <Input
            label={'Phone'}
            value={inputPhone}
            placeholder={'Enter your phone'}
            keyboardType={'phone-pad'}
            returnKeyType="done"
            onChangeText={setInputPhone}
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
                useBaseStore.getState().setUser('phone', inputPhone)
            }}
            error={false}
            errorText={'Phone is required'}
        />
        <Input
            label={'CPF'}
            value={inputCPF}
            placeholder={'Enter your CPF'}
            keyboardType={'phone-pad'}
            returnKeyType="done"
            onChangeText={setInputCPF}
            onSubmitEditing={() => {
                // do something
                console.log('saving...')
                useBaseStore.getState().setUser('cpf', inputCPF)
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
