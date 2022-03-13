import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Button,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import {Auth} from 'aws-amplify';
import RNRestart from 'react-native-restart';
import { API_URL } from './Config';

export default function ScreenD() {    
    const route = useRoute();
    const navigation = useNavigation(); 
    
    const {barberId, shopId, shopName, day, date, time, service, beard, price} = route.params.params;
    const [user, setUser] = useState(undefined);

    const checkUser = async () => {
        try {
            const authUser = await Auth.currentAuthenticatedUser({bypassCache: true}); 
            setUser(authUser);
        } catch(e) {
            setUser(null);
        }        
    }

    useEffect(() => {
        checkUser(); 
    }, []);

    const Confirm = () => 
    {       
        if (user) {
            console.log('before sending to payment ' + barberId + shopName);          
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "userName": (user.attributes.email).toString(),
                    "barberId": barberId,
                    "shopId": shopId,
                    "shoName": shopName,
                    "totalPrice": price, 
                    "customerPhone": "09098609",
                    "description": "jlkjlk", 
                    "no_of_Barbers": 1, 
                    "no_of_Haircuts": 1, 
                    "no_of_Beardstyles": 1, 
                    "confirmed": true, 
                    "day": day, 
                    "date": date,
                    "time": time, 
                    "service": service, 
                    "beard": beard 
                })
              };
              console.log(API_URL + 'Bookings', requestOptions);
              fetch(API_URL + 'Bookings', requestOptions)
                  .then(response => response.json())
                  .then(data => console.log(data))
                  .catch(e => {
                    alert(e);
                    return;
                  }); 
              RNRestart.Restart();
              navigation.navigate('Screen_A');    
        }
        else {
            navigation.navigate('Login', {params: {
                barberId: barberId, storeId: shopId, shopName: shopName, day: day, date: date, time: time, service: service, beard: 
                beard, price: price, fromMainPage: false
            }});
        }
    }
    
    return(
      <View style={styles.body}>  
        <Text style={styles.text}>You booked on</Text>
        <View style={styles.checkboxItem}><Text style={styles.name}>{day + ' ' + date}</Text></View>
        <Text style={styles.text}>at</Text>
        <View style={styles.checkboxItem}><Text style={styles.name}>{time}</Text></View>
        <Text style={styles.text}>for</Text>
        <View style={styles.checkboxItem}><Text style={styles.name}>{service}</Text></View>
        <Text style={styles.text}>and</Text>
        <View style={styles.checkboxItem}><Text style={styles.name}>{beard}</Text></View>
        <Text style={styles.text}>total price</Text>
        <View style={styles.checkboxItem}><Text style={styles.name}>{price}</Text></View>
        <Pressable
            onPress={Confirm}
            style={({ pressed }) => ({ backgroundColor: pressed ?'#ddd' : '#4affc0', margin: 10, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' })}
        >
            <Text style={styles.name}>CONFIRM AND PAY</Text>
        </Pressable>
      </View>
    )
  }

const styles= StyleSheet.create({
    body: {
      flex: 1, 
      backgroundColor: '#000',
      //alignItems: 'center',
    }, 
    text:{
        fontSize: 20, 
        fontWeight: 'bold', 
        marginLeft: 10,
        color: '#fff', 
        textTransform: 'uppercase',
    }, 
    name: {
        fontSize: 20, 
        fontWeight: 'bold', 
    },
    item: {
        margin: 5,
        backgroundColor: '#4ae1fa',
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 5,
        padding: 5, 
        flexDirection: 'row',
    },    
    checkboxItem: {
        margin: 5,
        backgroundColor: '#4ae1fa',
        borderRadius: 5,
        padding: 5, 
        flexDirection: 'row',
        justifyContent: 'space-between'
    },       
})