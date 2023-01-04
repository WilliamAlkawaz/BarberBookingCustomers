import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Pressable } from 'react-native';
import {Auth} from 'aws-amplify';

export default function ScreenC({navigation, route}) {
    const [booking, setBooking] = useState({});
    const {x, shopId, shopName} = route.params;
    const [totalPrice, setTotalPrice] = useState(0); 
    const [servicePPrice, setServicePPrice] = useState(0);
    // const [beardServicePPrice, setBeardServicePPrice] = useState(0);
    const [barberServiceCheck, setBarberServiceCheck] = useState([]);
    const [barber, setBarber] = useState(x);
    const [user, setUser] = useState(undefined);

    // x.beardServices.forEach(x=>{
    //     barberServiceCheck.push(x.selected);
    //     setBarberServiceCheck(barberServiceCheck);
    // })
    var bsc = [];
    useEffect(() => {    
        console.log('ScreenC useEffect');     
        // setBeardSelectedId(null);
        // setSelectedDayId(null);
        // setSelectedTimeId(null);
        // setSelectedId(null);
        // setTotalPrice(0);
        // setServicePPrice(0); 
        // setBeardServicePPrice(0); 
        // setBarberServiceCheck([]);
        // for (var i=0; i<x.barberServiceCheck.length; i++)
        // {
        //     barberServiceCheck.push(x.selected);
        //     setBarberServiceCheck(barberServiceCheck);
        // }
        // setBarber(x);
    }, []);

    useEffect(() => {
        checkUser(); 
    }, []);

    const checkUser = async () => {
        try {
            const authUser = await Auth.currentAuthenticatedUser({bypassCache: true}); 
            setUser(authUser);
        } catch(e) {
            setUser(null);
        }        
    }

    const handleNext = () => {
        if(selectedId === null)
        {
            alert('Please selected a hair style.'); 
            return; 
        }
            Array.prototype.select = function(closure){
                for(var n = 0; n < this.length; n++) {
                    if(closure(this[n])){
                        return this[n];
                    }
                }            
                return null;
            };
        if(selectedId !== null) {
            var s = barber.services.select(function(g) {return g.id==selectedId});  
            if(!s)
                var s = {"name": "No hairstyle selected"}; 
        }     
        else
            var s = {"name": "No hairstyle selected"};  
        
        if(selectedDayId !== null)
            var d = barber.days.select(function(g) {return g.id==selectedDayId}); 
        else {
            alert('Please select a day'); 
            return;
        }
        if(selectedTimeId !== null)
            var t = d.timeSlots.select(function(g) {return g.id==selectedTimeId});
        else {
            alert('Please select a time slot');
            return;
        }
        
        //let b1 = {storeId: x.storeId, day: 'd', time: '10:15', service: 's.name', addons: ['a', 'b', 'c', 'd'], price: totalPrice};
        //setBooking(b1);
        if(user) {
            navigation.navigate('ScreenD', {params: {
            barberId: barber.id, barberName: barber.firstName, shopId: shopId, shopName: shopName, day: d.name, date: d.date, time: t.time_Slot, service: s.name, 
            price: totalPrice}});
        }
        else {
            navigation.navigate('Login', {params: {
                barberId: barber.id, barberName: barber.firstName, shopId: shopId, shopName: shopName, day: d.name, date: d.date, time: t.time_Slot, service: s.name, 
                price: totalPrice}});
        }
        
    }

    const Item = ({ item, onPress, backgroundColor, textColor, selected }) => (        
        <TouchableOpacity 
            onPress={onPress} 
            disabled={item.disabled} 
            style={[backgroundColor, styles.touchable]}>          
            <View style={styles.checkboxItem}>
                <Image 
                    source={selected ? require('./assets/check-bold.png') : require('./assets/checkbox-blank-circle.png')}
                />
                <View style={styles.checkboxContainer}>          
                    <Text style={[styles.name, textColor]}>{item.name}</Text>     
                    {/* <Text style={[styles.pDes, textColor]}>(around {item.time} min)</Text>            */}
                </View>
                <View style={styles.checkboxContainer}>
                    <Text style={[styles.bDesLeft, textColor]}>${item.price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const [selectedId, setSelectedId] = useState(null);
    // const [beardSelectedId, setBeardSelectedId] = useState(null);

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#0f5555" : "#4ae1fa";
        const color = item.id === selectedId ? 'white' : 'black';
    
        return (
            <Item
                item={item}
                onPress={() => handleService(item.id, item.price)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
                selected= {item.id === selectedId}
            />
        );
    };  

    const handleService = (id, p) => 
    {      
        if(id===selectedId)
        {
            setSelectedId(null);
            setTotalPrice(totalPrice-p);
            setServicePPrice(0);
        }
        else
        {
            setSelectedId(id); 
            setTotalPrice(totalPrice+p-servicePPrice);
            setServicePPrice(p); 
        } 
    }

    const DayItem = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} disabled={item.off} style={[styles.item, backgroundColor]}>          
            <View>
                <Text style={[{alignSelf: 'center', textColor}]}>{item.date}</Text>
                <View style={styles.circle}>
                        <Text style={[styles.day, textColor]}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const [selectedDayId, setSelectedDayId] = useState(null);
    const [selectedDay, setSelectedDay] = useState({});
    const [selectedTimeId, setSelectedTimeId] = useState(null);

    const renderDaysItem = ({ item }) => {
        var backgroundColor;
        if(item.off)
        {
            backgroundColor = "#550000";
        }
        else if(item.id === selectedDayId){
            backgroundColor = "#0f5555";
        }
        else 
            backgroundColor = "#4ae1fa";
        const color = item.id === selectedDayId ? 'white' : 'black';
    
        return (
            <DayItem
                item={item}
                onPress={() => {
                    setSelectedDayId(item.id);
                    const index = barber.days.findIndex(x => x.id === item.id);                    
                    setSelectedDay(barber.days[index].timeSlots);  
                }}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };  

    const renderTimeItem = ({ item }) => {
        var backgroundColor;
        if(item.booked)
        {
            backgroundColor = "#550000";
        }
        else if(item.id === selectedTimeId){
            backgroundColor = "#0f5555";
        }
        else 
            backgroundColor = "#4ae1fa";
        const color = item.id === selectedTimeId ? 'white' : 'black';
    
        return (
            <TimeItem
                item={item}
                onPress={() => {
                    setSelectedTimeId(item.id);
                    console.log(item);
                }}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };  
    const TimeItem = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} disabled={item.booked} style={[styles.item, backgroundColor]}>          
            <View>
                <View style={styles.oval}>
                        <Text style={[styles.day, textColor]}>{item.time_Slot}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
    
    return(
      <View style={styles.body}>  
        <View style={{flex: 1}}>  
            <ScrollView nestedScrollEnabled={true}>    
                <View style={styles.item}>
                    <Image 
                        source={{uri:'data:' + x.imageMimeType + ';base64,' + x.photoFile}}
                        style={styles.image} 
                    />
                    <View style={styles.des}>
                        <Text style={{fontSize:20,fontWeight:'bold',textTransform:'uppercase'}}>{x.firstName}</Text>
                        <Text style={styles.bDes}>{x.about}</Text>
                    </View>
                </View>
                <Text style={styles.text}>Select hair style</Text>
                <FlatList
                    data={barber.services}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                />
                
                <Text style={styles.text}>Select day & time</Text>
                <View style={styles.dateTime}>
                    <View style={{alignContent:'center', justifyContent:'center'}}>
                    <Text style={{textTransform: 'uppercase', textAlign: 'center', alignSelf: 'center', fontSize: 14, fontWeight: 'bold'}}>The next 7 days</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>                        
                        <FlatList
                            horizontal={true}
                            data={barber.days}
                            renderItem={renderDaysItem}
                            keyExtractor={(item) => item.id}
                            extraData={selectedDayId}
                        />                     
                    </View>
                    <View style={ styles.bookings }> 
                        <FlatList nestedScrollEnabled={true}
                            horizontal={true}
                            data={selectedDay}
                            renderItem={renderTimeItem}
                            keyExtractor={(item) => item.id}
                            extraData={selectedTimeId}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>     
        <View style={styles.total}>
            <Text style={styles.totalText}>Total: ${totalPrice}</Text>
            <Pressable onPress={handleNext} style={styles.button}>
                <Text style={styles.totalText}>NEXT</Text>
            </Pressable>
        </View>     
      </View>
    )
  }

  const styles= StyleSheet.create({
    body: {
      flex: 1, 
      backgroundColor: '#000',
      justifyContent: 'space-between',
    }, 
    text:{
      fontSize: 18, 
      fontWeight: 'bold', 
      margin: 10,
      color: '#fff', 
      textTransform: 'uppercase',
    }, 
    item: {
        margin: 3,
        backgroundColor: '#4ae1fa',
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 5,
        padding: 5, 
        flexDirection: 'row',
    },    
    serviceItem: {
        margin: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 10,
        padding: 2, 
        flexDirection: 'row',
        width: '100%',
    },   
    checkboxItem: {
        marginLeft: 5,
        marginRight: 5,
        MarginTop: 2,
        marginBottom: 2,
        borderRadius: 5,
        padding: 5, 
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
        fontSize: 16, 
        fontWeight: 'bold', 
    },
    bDes: {
        fontSize: 16, 
    },
    bDesLeft: {
        fontSize: 16, 
        margin: 0,
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    pDes: {
        fontSize: 16, 
        marginLeft: 10,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    total: {
        fontSize: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        borderTopWidth: 5,
        borderTopColor: '#fff',
        backgroundColor: '#333',
    }, 
    button: {
        backgroundColor: '#111',
        borderWidth: 2, 
        borderColor: '#fff',
    },
    totalText: {
        color: '#fff',        
        fontSize: 22, 
        fontWeight: 'bold', 
        marginLeft: 10,
    }, 
    circle: {
        width: 40,
        height: 40, 
        borderWidth: 2, 
        borderRadius: 40/2,
        justifyContent: 'center', 
        alignContent: 'center',
        padding: 3,
        borderColor: '#555555', 
    },
    dateTime: {
        margin: 5,
        backgroundColor: '#4ae1fa',
        borderRadius: 5,
        padding: 5, 
    }, 
    day: {
        textTransform: 'uppercase', 
        fontWeight: 'bold',
        color: '#555555',
        alignSelf: 'center',
        fontSize: 12,
    }, 
    selectedDay: {
        textTransform: 'uppercase', 
        fontWeight: 'bold',
        color: '#fff',
        alignSelf: 'center',
        fontSize: 12,
    },
    bookings: {
        margin: 5,
        backgroundColor: '#4ae1fa',
        borderRadius: 5,
        borderTopWidth: 2,
        borderTopLeftRadius: 0, 
        borderTopRightRadius: 0,
        borderTopColor: '#555555',
        padding: 5, 
        flex: 1,
    }, 
    oval: {
        width: 60,
        height: 40, 
        borderWidth: 2, 
        borderRadius: 20,
        justifyContent: 'center', 
        alignContent: 'center',
        padding: 3,
        margin: 0,
    },
  })