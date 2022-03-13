import React from 'react'; 
import { Controller } from 'react-hook-form';
import { View, Text, TextInput, StyleSheet } from 'react-native'; 

import AntDesign from 'react-native-vector-icons/AntDesign';
AntDesign.loadFont();
import { windowHeight, windowWidth } from './Dimension';

export default function FormInput({control, name, rules = {}, placeholderText, iconType, ... rest}) {
    return (
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <>
                    <View style={[styles.inputContainer, {borderColor: error ? 'red' : '#e8e8e8'}]}>
                        <View style={styles.iconStyle}>
                            <AntDesign name={iconType} size={25} color='#666' />
                        </View>
                        <TextInput 
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            style={styles.input}
                            placeholder={placeholderText}
                            placeholderTextColor= '#666'
                            {...rest}
                        />                    
                    </View>
                    {error && (
                        <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                    </>
                )}   
            />
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 5, 
        marginBottom: 10, 
        width: '100%', 
        height: windowHeight / 15, 
        borderColor: '#ccc', 
        borderRadius: 3, 
        borderWidth: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff',

    }, 
    iconStyle: {
        padding: 10, 
        height: '100%', 
        justifyContent: 'center',
        alignItems: 'center', 
        borderRightColor: '#ccc', 
        borderRightWidth: 1, 
        width: 50, 
    },
    input: {
        padding: 10, 
        flex: 1, 
        fontSize: 16,
        fontFamily: 'Lato-Regular', 
        color:'#333',
        justifyContent: 'center', 
        alignItems: 'center',
        // borderColor:'#fff', 
        // borderWidth:1, 
        // borderRadius:5, 
        // margin:5,         
        // fontSize:16,
        // width:'100%',
    }, 
    inputField: {
        padding: 10, 
        marginTop: 5, 
        marginBottom: 10, 
        width: windowWidth / 1.5, 
        height: windowHeight / 15, 
        fontSize: 16, 
        borderRadius: 8, 
        borderWidth: 1,
    },
})