import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Image} from "expo-image"
import { useTheme } from '@react-navigation/native';

const Header = () => {
    const theme = useTheme()
  return (
    <View style={[{ backgroundColor: theme.colors.background,  }, styles.header]}>
     
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
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 40,
      borderBottomWidth: 1,

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

  