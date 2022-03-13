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
import { useNavigation } from '@react-navigation/core';
import {useForm} from 'react-hook-form';
import {Auth} from 'aws-amplify';
import {useRoute} from '@react-navigation/native';

export default function Login() { 
    const route = useRoute();
    const params = route.params.params; 
    const fromScreenA = route.params.fromScreenA; 
    const navigation = useNavigation(); 
    const [loading, setLoading] = useState(false);

    const {
        control, 
        handleSubmit, 
        formState: {errors}, 
    } = useForm(); 

    const signIn = async (data) => {
        if (loading)
            return; 

        setLoading(true);

        try {
            const response = await Auth.signIn(data.email, data.password);
            if (fromScreenA)
                navigation.navigate('ScreenA');
            else 
                navigation.navigate('ScreenD', {params});
        }
        catch(e) {
            Alert.alert('Oops', e.message);
        }
        setLoading(false);
    };

    const forgotPasswordPressed = () => {
        if (fromScreenA)
            navigation.navigate('ForgotPassword', {fromScreenA});
        else 
            navigation.navigate('ForgotPassword', {params});  
    }

    const signupPressed = () => {
        if (fromScreenA)
            navigation.navigate('SignUp', {fromScreenA});
        else 
            navigation.navigate('Signup', {params});
    }
    
    return(
        <ScrollView>
        <View style={styles.container}>
            <Image /> 

            <FormInput
                // labelValue={email}
                // onChangeText={(userEmail) => setEmail(userEmail)}
                name='email'
                placeholderText='Email (username)'
                control={control}
                iconType='mail'
                keyboardType='email-address'
                rules={{required: 'Username is required'}}
            />

            <FormInput
                name='password'
                // onChangeText={(userPassword) => setPassword(userPassword)}
                placeholderText='Password'
                control={control}
                iconType='lock'
                // keyboardType='email-address'
                secureTextEntry={true}
                rules={{required: 'Passwored is required', minLength: {value: 3, message: 'Password should be minimum 3 characters long'}}}
            />  

            <FormButton
                buttonTitle={loading ? 'Loading...' : 'Sign In'}
                onPress={handleSubmit(signIn)}
            />

            <TouchableOpacity style={styles.forgotButton} onPress={forgotPasswordPressed}>
                <Text style={styles.navButtonText}>Forgot Password?</Text>
            </TouchableOpacity>

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

            <TouchableOpacity style={styles.forgotButton} onPress={signupPressed}>
                <Text style={styles.navButtonText}>Don't have an account? Create here</Text>
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
        color: '#fff',
    },
    navButtonText: {
        color: '#fff',
    }, 
    text: {
        color: '#fff',
    }, 
    forgotButton: {
    },
})