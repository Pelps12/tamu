import React, { useEffect } from "react";
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import BBText from "@/components/utils/BBText";
import {Image} from "expo-image"
import BBTextInput from "@/components/utils/BBTextInput";
import { useTheme } from "@react-navigation/native";

import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { getValueFor, save } from "@/components/utils/securestore";
import { Config } from "@/constants/Config";


const SignIn = () => {
    const theme = useTheme();

    const createUser = async (newUser: {name: string}): Promise<any> => {
        // Assuming you have an API endpoint for creating a post
        const response = await fetch(`${"http://localhost:8000"}/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
    
        if (!response.ok) {
            throw new Error("NOT OK")
        }
    
        return response.json();
      };

      useEffect(() => {
        getValueFor("user").then(result => {if(result) {
            router.push("/seat_entry")
        }}) 
      }, [])
    const { mutate } = useMutation<Response, unknown, any>(createUser);

    return  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={-90}
    style={[styles.container]}>

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


    <BBTextInput style={styles.input} placeholder="Name" placeholderTextColor={"grey"} onSubmitEditing={(e) => fetch(`${Config.API_URL}/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: e.nativeEvent.text
          }),
        }).then(response => response.json().then(result => save("user", JSON.stringify(result))).then(() => router.push("/seat_entry")))
    
       }/>


  
        
    </KeyboardAvoidingView> 
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
      input: {
        height: 70,
        borderColor: 'black',
        borderWidth: 0,
        width: 200,
        textAlign: "center",
        borderRadius: 15,
        paddingLeft: 10,
        paddingRight: 10,
        marginVertical: 10,
        fontSize: 30,
        backgroundColor: "white",
        color: "black",
        marginBottom: 100,
        
        // Additional styling as needed
      },
      inputWrapper: {
       
        width: "100%",
      }
  });