import React, {useState} from 'react';
import { TouchableOpacity } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Button,
  Image, 
  Alert,
} from 'react-native';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import SocialButton from '../components/SocialButton';
import { API_URL } from './Config';
import { useNavigation } from '@react-navigation/core';
import { useForm } from 'react-hook-form';
import {useRoute} from '@react-navigation/native';
import {Auth} from 'aws-amplify';

export default function ConfirmEmail() {
    const route = useRoute();
    const {control, handleSubmit, watch} = useForm({
        defaultValues: {email: route?.params?.username}, 
    });    

    const params = route.params.params; 
    const fromScreenA = route.params.fromScreenA; 

    const username = watch('email');
    //const {barberId, storeId, day, date, time, service, beard, price} = route.params;  

    const navigation = useNavigation();

    const onConfirm = async (data) => {
        try {
            await Auth.confirmSignUp(data.email, data.code);
            if (fromScreenA)
                navigation.navigate('ScreenA'); 
            else 
                navigation.navigate('ScreenD', {params}); 
        } catch (e) {
            Alert.alert('Oops', e.message); 
        }
    };

    const onResend = async () => {
        try {
            await Auth.resendSignUp(username);
            Alert.alert('Success', 'Code was resent to your email'); 
        } catch (e) {
            Alert.alert('Oops', e.message); 
        }
    }

    const backToSigninPressed = () => {
        if (fromScreenA)
            navigation.navigate('Login', {fromScreenA}); 
        else 
            navigation.navigate('Login', {params}); 
    }

    const userExists = async (userName) => {
        const res = await fetch(API_URL + 'Users/UserExists/' + userName);
        const data = await res.json();
        return data;
    }

    return(
        <ScrollView>
        <View style={styles.container}>
            
            <FormInput
                name='email'
                placeholderText='Email (username)'
                control={control}
                iconType='mail'
                keyboardType='email-address'
                rules={{
                    required: 'Username is required'
                }}
            />

            <FormInput
                name='code'
                control={control}
                placeholderText='Enter your confirmation code'
                iconType='mail'
                rules={{
                    required: 'Confirmation code is required'
                }}
            />          

            <FormButton
                buttonTitle='Confirm'
                onPress={handleSubmit(onConfirm)}
            />

            <TouchableOpacity style={styles.additionalButtons} onPress={onResend}>
                <Text style={styles.navButtonText}>Resend code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.additionalButtons} onPress={backToSigninPressed}>
                <Text style={styles.navButtonText}>Back to sign in</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    )
}


const styles= StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    navButtonText: {
        color: '#fff',
    }, 
    text: {
        color: '#fff',
    }, 
    additionalButtons: {
        marginTop: 10, 
        marginBottom: 10,
    },
    color_textPrivate: {
        color: '#fff',
    },
})