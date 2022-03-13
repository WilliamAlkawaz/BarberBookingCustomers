import React from 'react'; 
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {windowHeight, windowWidth} from './Dimension';

export default function FormButton({buttonTitle, ...rest}) {
    return (
        <TouchableOpacity style={styles.buttonContainer} {...rest}>
            <Text style={styles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        margin: 10, 
        width: '100%', 
        height: windowHeight / 15, 
        backgroundColor: '#0f5555', 
        padding: 10, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 3, 
    },
    buttonText: {
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#ffffff', 
        fontFamily: 'Lato-Regular', 
    },
    container: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
    },
});