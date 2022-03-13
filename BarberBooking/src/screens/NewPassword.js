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

export default function NewPassword() {   
    const route = useRoute();
    //const {barberId, storeId, day, date, time, service, beard, price} = route.params;  
    const {control, handleSubmit, watch} = useForm({
        defaultValues: {email: route?.params?.username}, 
    }); 

    const fromScreenA = route.params.fromScreenA; 
    const params = route.params.params; 

    const navigation = useNavigation(); 

    const pwd = watch('password'); 

    const onSubmit = async (data) => {
        try {
            Auth.forgotPasswordSubmit(data.email, data.code, data.password);
            if (fromScreenA)
                navigation.navigate('Login', {fromScreenA});
            else 
                navigation.navigate('Login', {params}); 
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
                    required: 'Email (username) is required'
                }}
            />  

            <FormInput
                name='code'
                placeholderText='Code'
                control={control}
                iconType='mail'
                rules={{
                    required: 'Code is required'
                }}
            />  

            <FormInput
                name='password'
                placeholderText='Enter your new password'
                control={control}
                iconType='lock'
                secureTextEntry={true}
                rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 8, 
                        message: 'Password should be at least 8 characters long',
                    }
                }}
            />  

            <FormInput
                name='password-repeat'
                placeholderText='Repeat password'
                control={control}
                iconType='lock'
                secureTextEntry={true}
                rules={{
                    validate: value => 
                        value === pwd || 'Password do not match', 
                }}
            />        

            <FormButton
                buttonTitle='Submit'
                onPress={handleSubmit(onSubmit)}
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