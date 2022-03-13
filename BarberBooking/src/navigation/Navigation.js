import React, {useEffect, useState} from 'react'; 
import { View, Text, Alert } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ConfirmEmail from '../screens/ConfirmEmail';
import ForgotPassword from '../screens/ForgotPassword';
import NewPassword from '../screens/NewPassword';
import ScreenA from '../screens/ScreenA';
import ScreenB from '../screens/ScreenB';
import ScreenC from '../screens/ScreenC';
import ScreenD from '../screens/ScreenD';
import {Auth, Hub} from 'aws-amplify'; 

const Stack = createNativeStackNavigator();

const Navigation  = () => {
    const [user, setUser] = useState(undefined);

    const checkUser = async () => {
        const authUser = await Auth.currentAuthenticatedUser({bypassCache: true}); 
        setUser(authUser);
    }
    useEffect(() => {
        checkUser(); 
    }, []);
    useEffect(() => {
        const listener = (data) => {
            if(data.payload.event === 'signIn' || data.payload.event === 'signOut') {
                checkUser(); 
            }
        }; 
        Hub.listen('auth', listener); 
        return () => Hub.remove('auth', listener);
    }, []);
    return (
        <NavigationContainer> 
            <Stack.Navigator>                
                <Stack.Screen name="ScreenA" component={ScreenA} 
                options={{
                    title: 'Barber booking',
                    headerStyle: {
                        backgroundColor: '#555',
                        borderBottomWidth: 5, 
                        borderBottomColor:'#fff',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    }}
                />
                <Stack.Screen name="ScreenB" component={ScreenB} 
                options={{
                    title: 'Select a barber',
                    headerStyle: {
                    backgroundColor: '#555',
                    borderBottomWidth: 5, 
                    borderBottomColor:'#fff',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                    fontWeight: 'bold',
                    },
                }}
                />
                <Stack.Screen name="ScreenC" component={ScreenC} 
                options={{
                    title: 'Create a booking',
                    headerStyle: {
                    backgroundColor: '#555',
                    borderBottomWidth: 5, 
                    borderBottomColor:'#fff',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                    fontWeight: 'bold',
                    },
                }}
                />   
                <Stack.Screen name="ScreenD" component={ScreenD} 
                options={{
                    title: 'Confirm',
                    headerStyle: {
                    backgroundColor: '#555',
                    borderBottomWidth: 5, 
                    borderBottomColor:'#fff',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                    fontWeight: 'bold',
                    },
                }}
                />             
                { !user ? (
                    <>
                    <Stack.Screen name="Login" component={Login} 
                        options={{
                            title: 'Barber Booking Login',
                            headerStyle: {
                            backgroundColor: '#555',
                            borderBottomWidth: 5, 
                            borderBottomColor:'#fff',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                            fontWeight: 'bold',
                            },
                    }}
                    />
                    <Stack.Screen name="SignUp" component={Signup} 
                        options={{
                            title: 'Create an account',
                            headerStyle: {
                            backgroundColor: '#555',
                            borderBottomWidth: 5, 
                            borderBottomColor:'#fff',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                            fontWeight: 'bold',
                            },
                        }}
                    />
                    <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} 
                        options={{
                            title: 'Confirm your email',
                            headerStyle: {
                            backgroundColor: '#555',
                            borderBottomWidth: 5, 
                            borderBottomColor:'#fff',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                            fontWeight: 'bold',
                            },
                        }}
                    />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} 
                        options={{
                            title: 'Reset your password',
                            headerStyle: {
                            backgroundColor: '#555',
                            borderBottomWidth: 5, 
                            borderBottomColor:'#fff',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                            fontWeight: 'bold',
                            },
                        }}
                    />
                    <Stack.Screen name="NewPassword" component={NewPassword} 
                        options={{
                            title: 'Enter new password',
                            headerStyle: {
                            backgroundColor: '#555',
                            borderBottomWidth: 5, 
                            borderBottomColor:'#fff',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                            fontWeight: 'bold',
                            },
                        }}
                    />     
                    </>            
                ) : 
                <></>
                }             
            </Stack.Navigator>
        </NavigationContainer>        
    )
}

export default Navigation; 