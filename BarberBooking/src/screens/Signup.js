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
import {useForm} from 'react-hook-form';
import { Auth } from 'aws-amplify';
import {useRoute} from '@react-navigation/native';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export default function Singup() {   
    //const {barberId, storeId, day, date, time, service, beard, price} = route.params;  
    // const[email, setEmail] = useState();  
    // const[firstName, setFirstName] = useState(); 
    // const[lastName, setLastName] = useState();
    // const[password, setPassword] = useState();
    // const[err, setErr] = useState(false); 
    const route = useRoute();
    const params = route.params.params; 
    const fromScreenA = route.params.fromScreenA; 

    const navigation = useNavigation(); 

    const {
        control, 
        handleSubmit, 
        watch,
        formState: {errors}, 
    } = useForm(); 

    const pwd = watch('password'); 

    const signUp = async (data) => {
        const {email, password} = data; 
        const username = email; 
        console.log(email);
        try {
            await Auth.signUp({
                username, 
                password,
                attributes: {email}
            }); 
            if (fromScreenA)
                navigation.navigate('ConfirmEmail', {username: username, fromScreenA: fromScreenA});
            else
                navigation.navigate('ConfirmEmail', {username: username, params: params}); 
        } catch (e) {
            Alert.alert('Oops', e.message);
        }
        //const b = await userExists(email); 
        //if(!b)
        {
            // FirebaseUtil.signUp(email, password).catch((e) => {
            //     console.log(e);     
            //     alert('Something went wrong ' + e.message);
            //     return;
            // }); 

            // navigation.navigate('Payment', {
            //     barberId: barberId, storeId: storeId, day: day, date: date, time: time, service: service, beard: 
            //     beard, price: price
            // });

            // const requestOptions = {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         "firstName": firstName,
            //         "lastName": lastName,
            //         "userName": email,
            //         "email": email
            //     })
            // };
            // fetch(API_URL + 'Users', requestOptions)
            //     .then(response => response.json())
            //     .then(data => console.log(data))
            //     .catch(e => alert(e)); 
        }
        //else
          //  alert('User exists already!');
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
                placeholderText='Email (username)'
                control={control}
                iconType='mail'
                keyboardType='email-address'
                rules={{
                    required: 'Username is required', 
                    pattern: {value: EMAIL_REGEX, message: 'Email is invalid'},
                    minLength: {
                        value: 3, 
                        message: 'Password should be minimum 3 characters long',
                    }, 
                    maxLength: {
                        value: 24, 
                        message: 'Username should be max 24 characters long',
                    }
                }}
            />

            <FormInput
                name='password'
                // onChangeText={(userPassword) => setPassword(userPassword)}
                placeholderText='Password'
                control={control}
                iconType='lock'
                secureTextEntry={true}
                rules={{
                    required: 'Passwored is required', 
                    minLength: {
                        value: 8, 
                        message: 'Password should be minimum 8 characters long'
                    }, 
                }}
            />  

            <FormInput
                name='password-repeat'
                // onChangeText={(userPassword) => setPassword(userPassword)}
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
                buttonTitle='Sign Up'
                onPress={handleSubmit(signUp)}
            />

            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>By registering, you confirm tha you accept our</Text>
                <TouchableOpacity>
                    <Text style={[styles.color_textPrivate, {color: '#c88832'}]}>
                        term of service
                    </Text>
                </TouchableOpacity>
                <Text style={styles.color_textPrivate}>and</Text>
                <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>Privacy Policy</Text>
            </View>

            <SocialButton
                buttonTitle='Sign in with Facebook'
                btnType='facebook'
                color='#4867aa'
                backgroundColor='#4ae1fa'
                onPress={()=>{}}
            />

            <SocialButton
                buttonTitle='Sign in with Google'
                btnType='google'
                color='#de4d41'
                backgroundColor='#4ae1fa'
                onPress={()=>{}}
            />

            <TouchableOpacity style={styles.forgotButton} onPress={backToSigninPressed}> 
                <Text style={styles.navButtonText}>You have an account? Sign in here</Text>
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
    forgotButton: {
    },
    color_textPrivate: {
        color: '#fff',
    },
})