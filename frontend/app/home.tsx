import { Alert, FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import BBText from '@/components/utils/BBText';
import { useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { getValueFor } from '@/components/utils/securestore';
import { Config } from '@/constants/Config';
import { useQuery } from '@tanstack/react-query';
import BBTextInput from '@/components/utils/BBTextInput';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import BouncingImage from '@/components/BouncingImage';
import AntDesign from '@expo/vector-icons/build/AntDesign';
import { Feather, Ionicons } from '@expo/vector-icons';

const  waitforme = (millisec: number) => { 
    return new Promise(resolve => { 
        setTimeout(() => { resolve('') }, millisec); 
    }) 
} 


export default function TabOneScreen() {
  const theme = useTheme();
  const local = useLocalSearchParams();

  const getObjectIcon = (objectName: "phone" |"wallet"| "bag" | "watch"| "headphone") => {
    switch (objectName) {
      case 'phone':
        return <AntDesign name="phone" size={30} color="black" />;
      case 'wallet':
        return <AntDesign name="wallet" size={30} color="black" />;
      case 'bag':
        return <Ionicons name="bag-outline" size={30} color="black" />;
      case 'watch':
        return <AntDesign name="phone" size={24} color="black" />;

      case 'headphone':
        return <Feather name="headphones" size={30} color="black" />
      default:
        // Return a default icon or handle the case where no match is found
        return   <AntDesign name="question" size={30} color="black" />;
    }
  };

  useEffect(() => {
    console.log(local)
  }, [local])

  useEffect(() => {
    console.log("KODEIKDO")
  }, [])

  const getUserList = async (): Promise<any> => {
    // Assuming you have an API endpoint for creating a post
    const unparsed = await getValueFor("user")
    if(!unparsed){
      throw new Error("HMM")
    }
    const {token} = JSON.parse(unparsed)
    const url = new URL(`${Config.API_URL}/flight/add_flight`)
    url.searchParams.set("token", token)
    console.log(url.toString())

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

          flight_number: 1,
          seat_number: parseInt(local?.seat_id as string)
        
      })
    });

    if (!response.ok) {
      throw new Error('Error creating post');
    }
   await waitforme(700)
    return response.json();
  };

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

  const { data, isLoading, isError, error } = useQuery({
    queryFn: getUserList,
    queryKey: ["userList"],
    enabled: !!local?.seat_id,
    refetchInterval: 10000,
  });
  if(isLoading){
    return <BouncingImage/>
    
  }
  if(data){
    console.log(data)
  }

  if(isError){
    Alert.alert(error?.message)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
      style={[{ backgroundColor: theme.colors.background,  }, styles.container]}>
      
      <View style={styles.titleContainer}>
        <BBText style={styles.title}>Flight in progress...</BBText>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" >
<View  style={styles.centeredComponent}>
    <BBText style={styles.seatedText}>Your Items</BBText>
    <FlatList
    contentContainerStyle={{ justifyContent: "flex-start", width: "100%", marginHorizontal: 10}}
    style={{width: "100%"}}
    data={data.items?.filter(item => item.item !== "nothing")}
    renderItem= {(item) => <View style={styles.item}>
      {getObjectIcon(item.item.item)}
      <BBText style={{fontSize: 30}}>{capitalizeFirstLetter(item.item.item)}</BBText>
    </View>}
    />
</View>
      

        
      </View>
    
    </KeyboardAvoidingView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
    position: "relative"
  },

  titleContainer: {
    position:"absolute",
    backgroundColor: "transparent",
    top: "12%"
  },

  title: {
    fontSize: 37,
    fontWeight: '300',
    color: "white",
    textAlign: "center"

  },
  separator: {
   flex: 1,
    height: "70%",
    backgroundColor: "#efefef",
    width: '100%',
    position:"absolute",
    top: "30%",
    borderTopLeftRadius: 20, /* 8px */
    borderTopRightRadius: 20, /* 8px */
    alignItems: 'center',
    justifyContent: 'space-between',

  },

  item: {
    padding: 20,
    borderRadius: 20,
    shadowRadius: 20,
    marginBottom: 15,
    backgroundColor: "white",
    flexDirection: "row",
   width: "95%",
   gap: 20,
   alignItems: "center",
   justifyContent: "flex-start"

  },

  centeredComponent: {
    // Adjust the styles for your centered component
    backgroundColor: 'transparent',
    gap: 40,
    width: "100%",
    alignItems: 'center',
  },

  seatedText: {
    textAlign: 'center',
    fontSize: 50,
    padding: 30,
    paddingTop: 40,
    fontWeight: 'bold',
    color: 'black', // Change the color to suit your theme
  },
  input: {
    marginTop: 10,
    padding: 10,
    fontSize: 48,
    width: 200,
    borderBottomColor: "black",
    borderBottomWidth: 4,

    borderWidth: 1,
    borderColor: 'transparent', // Set border color to transparent
    textAlign: "center"
  },
});
