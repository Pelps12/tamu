import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

type FontWeight = "normal" | "medium" | "semi-bold" | "bold";





const BBText: React.FC<TextProps> = ({
  style,
    children,
    ...restProps
}) => {


  return (
    <Text style={[{ fontFamily: "ChangaOne_400Regular",  }, style]} {...restProps} >{children}</Text>
  );
};


export default BBText;
