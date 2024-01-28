import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import {Image} from "expo-image"
import { useTheme } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getValueFor, remove } from './utils/securestore';
import BBText from './utils/BBText';
type OurProps = {
  page?: "home"
}

const Header: React.FC<OurProps> = ({page}) => {
    const theme = useTheme()
    const [name, setName] = React.useState<any>()

    useEffect(() => {
      getValueFor("user").then(value => {
        if(value){
          const user = JSON.parse(value)
          setName(user.name)
        }
        

      })
    }, [])

    const handleLougout = () => {
      Alert.alert('Are you sure?', 'This action logs you out', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => remove("user").then(() => router.replace("/signin"))},
      ]);
      
    }
  return (
    <View style={[{ backgroundColor: theme.colors.background,  }, styles.header]}>
     {router.canGoBack() && <View style={{alignItems: "center", gap: 5}}><AntDesign name="back" size={30} color="white" onPress={() => router.back()}/>
     <AntDesign onPress={() => handleLougout()} name="logout" size={20} color="white" style={{marginTop: 10}}/></View>}
     {name && page && <BBText style={{fontSize: 25, color: "white"}}>Hello {name}</BBText>}
      <Image
          source={require('../assets/images/logo.svg')} // replace with the actual path to your image
          style={styles.logo}
        />
        
     
      
    </View>
  );
};

export default Header

const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 40,


    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    logo: {
      width: 70,
      height: 70,
      resizeMode: 'contain',
    },
  });

  