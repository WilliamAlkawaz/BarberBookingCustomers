import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  TextInput,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';

import { API_URL } from './Config';

export default function ScreenB({navigation, route}) {

    const {selectedId, shopName} = route.params;
    const [barbers, setBarbers] = useState([]);

    useEffect(() => {  
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks();
            setBarbers(tasksFromServer);
        }      
        getTasks();
    }, []);

    // Fetch barbers
    const fetchTasks = async () => {
        console.log('The shop id is: ' + selectedId);
        const res = await fetch(API_URL + 'Barber/' + selectedId)
        const data = await res.json();
        return data;
    }

    const onPressHandler = (x) => {
        const shopId = selectedId; 
        navigation.navigate('ScreenC', {x, shopId, shopName});
    }

    const [refreshing, setRefreshing] = useState(false); 
    const handleRefresh = () => {
        setRefreshing(true); 
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks();
            setBarbers(tasksFromServer);
        }      
        getTasks();
        setRefreshing(false); 
    }
    
    return(
      <View style={styles.body}>
        <ScrollView refreshControl={<RefreshControl 
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />}>
        {
            barbers.map(b => {
                return (
                    <View style={styles.item}>
                        <Pressable 
                            onPress={() => onPressHandler(b)}
                            style={({pressed}) => ({width: pressed ? '100%' : '100%'},{flexDirection: pressed ? 'row' : 'row'})}
                        >
                            <Image 
                                source={{uri:'data:'+ b.imageMimeType + ';base64,' + b.photoFile}}
                                style={styles.image} 
                            />
                            <View style={styles.des}>
                                <Text style={styles.name}>{b.firstName}</Text>
                                <Text style={styles.bDes}>{b.about}</Text>
                            </View>
                        </Pressable> 
                    </View>
                )                
            })
        }
        </ScrollView>
      </View>
    )
  }

  const styles= StyleSheet.create({
    body: {
      flex: 1, 
      backgroundColor: '#000',
      flexDirection: 'column',
      padding: 5,
    }, 
    text:{
      fontSize: 30, 
      fontWeight: 'bold', 
      marginLeft: 10,
      marginRight: 10,
      color: '#fff'
    }, 
    input: {
        backgroundColor: '#444444', 
        width: '90%', 
        fontSize: 30,
        margin: 10, 
    }, 
    item: {
        margin: 5,
        backgroundColor: '#4ae1fa',
        justifyContent: 'center', 
        alignItems: 'center',
        //borderRadius: 5,
        borderTopRightRadius: 10, 
        borderBottomLeftRadius: 10,
        padding: 5, 
        flexDirection: 'row',
    },
    image: {
        width: 60, 
        height: 60, 
        margin: 1,
        flex: 1,
        margin: 1,
        borderRadius: 60 / 2,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#555555'
    },
    des: {
        flex: 5,
        pading: 2,
        margin: 2,
    },
    name: {
        fontSize: 24, 
        fontWeight: 'bold', 
    },
    bDes: {
        fontSize: 18, 
    },
    imageC: {
        borderRadius: '50%',
    },
  })