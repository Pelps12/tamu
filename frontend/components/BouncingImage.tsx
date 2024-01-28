import React, { Component } from 'react';
import {View, StyleSheet, TouchableOpacity, Animated, Easing} from 'react-native';
import BBText from './utils/BBText';
import { Image } from 'expo-image';

export default class Bounce extends Component {
  state={
    animation: new Animated.Value(150)
  }
  componentDidMount(): void {
    Animated.loop(
        Animated.stagger(500, [Animated.timing(this.state.animation, {
            toValue: 170,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }), Animated.timing(this.state.animation, {
            toValue: 150,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          })])
        
      
    ).start()
  }




  render(){

    const trans={
      transform:[
        {translateY:this.state.animation}
      ]
    }

    return (
      <View style={{flex: 1, justifyContent: "space-around", alignItems: "center", gap:0}}>
        <View style={{flex: 1, justifyContent: "flex-start", position: "relative", gap: 0}}>
            <BBText style={{fontSize: 40, color: "white", alignSelf: "center", paddingTop: 100}}>Tracking your belongings...</BBText>
        <Animated.View style={[trans, {paddingTop: 0, marginTop: 0}]}>
            <Image source={require("../assets/images/logo.svg")} style={styles.logo}/>
      </Animated.View>
        </View>
        
    <View style={styles.container}>

      

    </View>
    </View>
    );
  }
}

const styles=StyleSheet.create({
  ball:{
    width:100,
    height:100,
    borderRadius:50,
    backgroundColor:"tomato",
    position:"absolute",
    left:160,
    //top:150,
  },
  button:{
    width:150,
    height:70,
    padding:10,
    borderRadius:10,
    backgroundColor:"#fc5c65",
    marginVertical:50,
  },
 container:{
   flex:1,
   justifyContent:"flex-end",
   alignItems:"center",
 },
 logo: {
    width: 230,
    height: 230,
    alignSelf: "center",
    resizeMode: 'contain',
  },
});