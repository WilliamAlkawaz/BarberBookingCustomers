import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
//import Geolocation from '@react-native-community/geolocation';
//import { getDistance } from 'geolib';
import { API_URL } from './Config';
//import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/core';
import {Auth, Hub} from 'aws-amplify';
import RNRestart from 'react-native-restart';

export default function ScreenA() {

    const navigation = useNavigation(); 
    
    //const geolib = require('geolib');
    const [shops, setShops] = useState([]);
    const [locSuccess, setLocSeccess] = useState(false); 
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);

    useEffect(() => {     
        
    }, []);    

    const geoFailure = () => {
        console.log('failure of the location'); 
        //setLocSeccess(false);
        //console.log(err);
        const getShops = async () => {
            const shopsFromServer = await fetchShops();
            console.log('after fetching outside fetching function'); 
            setShops(shopsFromServer);
            console.log('are we fetched after location failure?');
        }      
        getShops();        
    }
    
    // Fetch shops
    const fetchShops = async () => {
        console.log('just before fetching222');
        console.log('after fetching1' + ' ' + API_URL + 'Shops');
        const res = await fetch(API_URL + 'Shops');
        console.log('after fetching2' + ' ' + API_URL + 'Shops');
        const data = await res.json();
        console.log('data in fetching ' + data);
        return data;
    }

    const fetchShopsByZip = async (zipCode) => {
        console.log(API_URL + 'Shops/' + zipCode);
        const res = await fetch(API_URL + 'Shops/' + zipCode);
        console.log('after fetching' + ' ' + API_URL + 'Shops');
        const data = await res.json();
        return data;
    }

    const fetchUpcomingBookings = async (userName) => {
        console.log('Are we fetching upcoming bookings? ' + API_URL + 'Bookings/Upcoming/' + userName);
        const res = await fetch(API_URL + 'Bookings/Upcoming/' + userName);
        const data = await res.json();
        return data;
    }
    const fetchPastBookings = async (userName) => {
        console.log('Are we fetching past bookings? ' + API_URL + 'Bookings/Past/' + userName);
        const res = await fetch(API_URL + 'Bookings/Past/' + userName);
        const data = await res.json();
        return data;
    }

    const setZipcode = (zipCode) => {
        const getShops = async () => {
            const shopsFromServer = await fetchShopsByZip(zipCode);
            shopsFromServer.forEach(s => {
                s["distance"] = getDistance(
                    { latitude: s.xCooridnate, longitude: s.yCoordinate },
                    { latitude: lat,
                        longitude: lng }
                );
            });
            setShops(shopsFromServer);
        }      
        getShops();        
    }

    const [selectedId, setSelectedId] = useState(null); 
    const [shopName, setSelectedName] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [ready, setReady] = useState(false); 
    const [lat, setLat] = useState(null); 
    const [lng, setLng] = useState(null);

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#0f5555" : "#4ae1fa";
        const color = item.id === selectedId ? 'white' : 'black';
    
        return (
            <Item
                item={item}
                onPress={() => {
                    setSelectedId(item.id); 
                    setSelectedName(item.name);                  
                }}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
                selected= {item.id === selectedId}
            />
        );
    };  

    const renderUpcomingBookings = ({ item }) => {
        const backgroundColor = "#555";
        const color = 'white';
    
        return (
            <UpcomingBookingItem
                item={item}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };  

    const renderPastBookings = ({ item }) => {
        const backgroundColor = "#555";
        const color = 'white';
    
        return (
            <PastBookingItem
                item={item}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };  

    const Item = ({ item, onPress, backgroundColor, textColor, selected }) => (        
        <TouchableOpacity 
            onPress={onPress} 
            style={[backgroundColor, styles.touchable]}>          
            <View style={styles.checkboxItem}>
                <Image 
                    source={selected ? require('./assets/check-bold.png') : require('./assets/checkbox-blank-circle.png')}
                />
                <View style={styles.checkboxContainer}>          
                    <Text style={[styles.name, textColor]}>{item.name}</Text>             
                </View>                
                <View style={styles.checkboxContainer}>
                    {item.distance ? <Text style={[styles.bDesLeft, textColor]}>About {item.distance} km</Text> : <Text></Text>}
                </View>
            </View>
        </TouchableOpacity>
    );

    const PastBookingItem = ({ item, backgroundColor, textColor }) => (        
        <View 
            style={[backgroundColor, styles.booking]}>          
                <View style={styles.checkboxContainer}>
                    <AntDesign style={styles.name} name='clockcircleo' /> 
                </View>
                <View style={styles.checkboxContainer}>          
                    <Text style={[textColor]}>{item.day + ' ' + item.date}</Text>             
                </View>  
                <View style={styles.checkboxContainer}>          
                    <Text style={[textColor]}>{'at ' + item.time}</Text>             
                </View> 
                <View style={styles.checkboxContainer}>
                    <AntDesign style={styles.name} name='user' /> 
                </View>                             
                <View style={styles.checkboxContainer}>
                    <Text style={[textColor]}>{item.barberName}</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <AntDesign style={styles.name} name='enviromento' /> 
                </View>
                <View style={styles.checkboxContainer}>
                    <Text style={[textColor]}>{item.shopName}</Text>
                </View>
        </View>
    );

    const UpcomingBookingItem = ({ item, backgroundColor, textColor }) => (        
        <View 
            style={[backgroundColor, styles.booking]}>          
                <View style={styles.checkboxContainer}>
                    <AntDesign style={styles.name} name='clockcircleo' /> 
                </View>
                <View style={styles.checkboxContainer}>          
                    <Text style={[textColor]}>{item.day + ' ' + item.date}</Text>             
                </View>  
                <View style={styles.checkboxContainer}>          
                    <Text style={[textColor]}>{'at ' + item.time}</Text>             
                </View> 
                <View style={styles.checkboxContainer}>
                    <AntDesign style={styles.name} name='user' /> 
                </View>                             
                <View style={styles.checkboxContainer}>
                    <Text style={[textColor]}>{item.barberName}</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <AntDesign style={styles.name} name='enviromento' /> 
                </View>
                <View style={styles.checkboxContainer}>
                    <Text style={[textColor]}>{item.shopName}</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                        onPress={() => handleCancel(item.id)}
                        style={styles.touchable}>
                        <Text style={[textColor]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
        </View>
    );

    const handleCancel = (id) => {
        Alert.alert(
            "Cancel Booking",
            "Are you sure?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // body: JSON.stringify({
                    //     "userName": ((user.providerData[0]).email).toString()
                    // })
                  };
                  console.log(API_URL + 'Bookings/Cancel/' + id, requestOptions);
                  fetch(API_URL + 'Bookings/Cancel/' + id, requestOptions)
                      .then(res => {
                          if(res.ok)
                            alert('The booknig was cancelled successfully!');
                      })
                      .catch(e => alert(e));
              }}
            ]
          );
    }
    const [locEnabled, setLocEnabled] = useState(false); 
    const [refreshing, setRefreshing] = useState(false); 

    const handleRefresh = () => {
        setRefreshing(true); 
        checkUser();
        geoFailure();
        const getUpcomingBookings = async (un) => {
            const upcomingBookingsFromServer = await fetchUpcomingBookings(un);
            console.log('The bookings are: ' + upcomingBookingsFromServer.length);
            setUpcomingBookings(upcomingBookingsFromServer);
        }        
        const getPastBookings = async (un) => {
            const pastBookingsFromServer = await fetchPastBookings(un);
            setPastBookings(pastBookingsFromServer);
        }      
        if (user) {
            getUpcomingBookings((user.attributes.email).toString()); 
            getPastBookings((user.attributes.email).toString());   
        }
        
        setRefreshing(false);
    }

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

        console.log('ScreeA useEffect');
        setSelectedId(null);          
        geoFailure();
        const getUpcomingBookings = async (un) => {
            const upcomingBookingsFromServer = await fetchUpcomingBookings(un);
            setUpcomingBookings(upcomingBookingsFromServer);
        }
        const getPastBookings = async (un) => {
            const pastBookingsFromServer = await fetchPastBookings(un);
            setPastBookings(pastBookingsFromServer);
        }  
        if (user) {
            getUpcomingBookings((user.attributes.email).toString()); 
            getPastBookings((user.attributes.email).toString());  
        }    
         
    }, []);

    useEffect(() => {
        const listener = (data) => {
            if(data.payload.event === 'signIn' || data.payload.event === 'signOut') {
                checkUser(); 
                // navigation.reset({
                //     index: 0,
                //     routes: [{ name: 'ScreenA' }],
                // });
            }
        }; 
        Hub.listen('auth', listener); 
        return () => Hub.remove('auth', listener);
    }, []);
  
    return(
      <ScrollView 
        refreshControl={<RefreshControl 
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />}
        style={styles.body}>
        <View style={{flex: 1,justifyContent: 'space-between'}}>
            <View>
                {user ? <Button onPress={()=>{                           
                                    Auth.signOut();
                                    RNRestart.Restart();
                                }} title='Signout' /> :                        
                <Button onPress={()=>navigation.navigate('Login', {
                    fromScreenA: true                    
                })} title='Signin' />}
                <Text style={styles.text}>
                Enter zipcode
                </Text>
                <TextInput
                    style={{borderColor:'#fff', borderWidth:1, borderRadius:5, margin:5, color:'#fff',fontSize:16}}
                    placeholder="Zipcode"
                    onChangeText={value => setZipcode(value)}
                />
                <View style={{minHeight:250}}>

                {
                    locEnabled ?
                        locSuccess ? 
                        <>
                        <Text style={styles.text}>
                            Select a barbershop
                        </Text>
                        <FlatList
                            data={shops}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            extraData={selectedId}
                        />
                        </>
                        :
                        <Text style={styles.error}>Location failed
                        Click <Pressable style={({pressed}) => ({margin: pressed ? 15 : 15 }, 
                        {flexDirection: pressed ? 'row' : 'row'}, 
                        {backgroundColor: pressed ? '#0f5555' : '#4ae1fa'})}
                        onPress={()=> {
                            LocationServicesDialogBox.checkLocationServicesIsEnabled({
                                message: "Use Location ?",
                                ok: "YES",
                                cancel: "NO"
                            }).then(function(success) {
                                console.log(success); // success => "enabled"
                                setLocEnabled(true)
                            }).catch((error) => {
                                console.log(error.message); // error.message => "disabled"
                                setLocEnabled(false);
                            });

                            let geoOptions = {
                                enableHeightAccuracy: true, 
                                timeOut: 200000, 
                                maximumAge: 60*60*24
                            }; 
                            setReady(false);
                            console.log('calling location');
                            Geolocation.getCurrentPosition(geoSuccess, 
                                geoFailure, 
                                geoOptions);                    
                        }}><Text style={styles.textLink}>here</Text></Pressable>
                        to try again or enter zipcode above
                        </Text>
                    : <Text></Text>
                }

                {
                    !locEnabled || !locSuccess ? <FlatList
                    data={shops}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                /> : <Text></Text>
                }
                </View>
                <TouchableOpacity style={[styles.touchable, {backgroundColor: '#4ae1fa', padding: 10}]}
                    onPress={() => {
                        Array.prototype.select = function(closure){
                            for(var n = 0; n < this.length; n++) {
                                if(closure(this[n])){
                                    return this[n];
                                }
                            }            
                            return null;
                        };
                        var s = 'name'; // shops.select(function(g) {return g.id==selectedId});
                        if(selectedId !== null)
                            navigation.navigate('ScreenB', {selectedId, shopName});
                        else
                            alert('Please select a shop or refresh the page');            
                    }}
                >
                    <View style={styles.des}>
                        <Text style={styles.name}>NEXT</Text>
                    </View>
                </TouchableOpacity> 
            </View>
            <View>
                <Text style={styles.text}>
                    Your upcoming bookings
                </Text>
                {
                    user ?
                    upcomingBookings.length === 0 ? <Text style={styles.bDesLeft}>No upcoming bookings found</Text>
                    :
                    <FlatList
                        data={upcomingBookings}
                        renderItem={renderUpcomingBookings}
                        keyExtractor={(item) => item.id}
                    />
                    :
                    <Text style={styles.bDesLeft}>Please signin to see your upcoming bookings</Text>
                }
                <Text style={styles.text}>
                    Your past bookings
                </Text>
                {
                    user ? 
                    pastBookings.length === 0 ? <Text style={styles.bDesLeft}>No past bookings found</Text>
                    :
                    <FlatList
                        data={pastBookings}
                        renderItem={renderPastBookings}
                        keyExtractor={(item) => item.id}
                    />
                    :
                    <Text style={styles.bDesLeft}>Please signin to see your upcoming bookings</Text>
                }
            </View>
        </View>
      </ScrollView>
    )
  }

  const styles= StyleSheet.create({
    body: {
        flex: 1, 
        backgroundColor: '#000',
        padding: 5,
    }, 
    text:{
        fontSize: 18, 
        fontWeight: 'bold', 
        marginLeft: 10,
        color: '#fff', 
        textTransform: 'uppercase',
        margin: 10,
    }, 
    textLink: {
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#fff', 
        textTransform: 'uppercase'
    },
    error:{
        fontSize: 18, 
        fontWeight: 'bold', 
        marginLeft: 10,
        color: '#f53', 
        textTransform: 'uppercase',
    }, 
    checkboxItem: {
        marginLeft: 5,
        marginRight: 5,
        MarginTop: 4,
        marginBottom: 4,
        borderRadius: 5,
        padding: 4, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    }, 
    checkboxContainer: {
        paddingLeft: 4,
        paddingRight: 4, 
        paddingTop: 0, 
        marginLeft: 5, 
        marginRight: 5,
        paddingBottom: 0, 
        flexDirection: 'row',
    },
    touchable: {
        borderColor: '#555555', 
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10, 
        marginLeft: 10,
        padding: 10,
    },
    booking: {
        borderColor: '#555555', 
        borderRadius: 5,
        marginRight: 5, 
        margin: 5,
        //borderRadius: 5,
        padding: 10, 
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    name: {
        fontSize: 16, 
        fontWeight: 'bold', 
        alignSelf: 'center',
    },
    bDesLeft: {
        color: '#aaa',
        fontSize: 16, 
        fontWeight: 'bold', 
        alignSelf: 'center',
    },
  })