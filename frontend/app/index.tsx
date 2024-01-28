import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import BBText from '@/components/utils/BBText';
import { useTheme } from '@react-navigation/native';
import React from 'react';

export default function TabOneScreen() {
  const theme = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
      style={[{ backgroundColor: theme.colors.background,  }, styles.container]}>
      
      <View style={styles.titleContainer}>
        <BBText style={styles.title}>Enter your seat number</BBText>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" >
<View  style={styles.centeredComponent}>
    <BBText style={styles.seatedText}>Seat</BBText>
    <TextInput
    onSubmitEditing={(e) => console.log(e.nativeEvent.text)}
            style={styles.input}
            placeholder="No#"
            placeholderTextColor="#888"
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
    top: "25%"
  },

  title: {
    fontSize: 40,
    fontWeight: '300',
    color: "white",
    textAlign: "center"

  },
  separator: {
   flex: 1,
    height: "50%",
    backgroundColor: "white",
    width: '100%',
    position:"absolute",
    top: "50%",
    borderTopLeftRadius: 20, /* 8px */
    borderTopRightRadius: 20, /* 8px */
    alignItems: 'center',
    justifyContent: 'center',

  },

  centeredComponent: {
    // Adjust the styles for your centered component
    backgroundColor: 'transparent',
    gap: 40,
    alignItems: 'center',
  },

  seatedText: {
    textAlign: 'center',
    fontSize: 64,
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
