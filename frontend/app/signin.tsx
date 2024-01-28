import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import BBText from "@/components/utils/BBText";
import {Image} from "expo-image"

const SignIn = () => {
    return <View style={styles.container}>

<LinearGradient
    // Background Linear Gradient
    colors={['transparent', '#0466C8', ]}
    style={styles.background}
  />
  <View style={{flex: 1, justifyContent: "flex-start", paddingTop: 100, alignContent: "flex-start", width: "100%", paddingHorizontal: 30}}>
    <BBText style={styles.title}>Baggage Buddy</BBText>
  <Image
        source={require('../assets/images/logo.svg')} // replace with the actual path to your image
        style={styles.logo}
      />
  </View>
        
    </View> 
}

export default SignIn;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#031331',
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: "100%",
    },
    button: {
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
    },
    title: {
      fontSize: 64,
      color: '#fff',
    },
    
    logo: {
        width: 230,
        height: 230,
        alignSelf: "flex-end",
        resizeMode: 'contain',
      },
  });