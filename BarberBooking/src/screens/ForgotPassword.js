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
import {Auth} from 'aws-amplify';
import {useRoute} from '@react-navigation/native';

export default function ForgotPassword() {   
    //const {barberId, storeId, day, date, time, service, beard, price} = route.params;  
    const {control, handleSubmit} = useForm(); 
    const route = useRoute(); 
    const params = route.params.params; 
    const fromScreenA = route.params.fromScreenA; 

    const navigation = useNavigation(); 

    const onSend = async (data) => {
        try {
            Auth.forgotPassword(data.email);
            const username = data.email; 
            if (fromScreenA)
                navigation.navigate('NewPassword', {username: username, fromScreenA: fromScreenA});
            else 
                navigation.navigate('NewPassword', {username: username, params: params}); 
        } catch (e) {
            Alert.alert('Oops', e.message);
        }
    };

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
                control={control}
                placeholderText='Enter your email'
                iconType='mail'
                keyboardType='email-address'
                rules={{
                    required: 'Username is required'
                }}
            />          

            <FormButton
                buttonTitle='Send'
                onPress={handleSubmit(onSend)}
            />

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