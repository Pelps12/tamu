import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

type FontWeight = "normal" | "medium" | "semi-bold" | "bold";





const BBTextInput: React.FC<TextInputProps> = ({
  style,
    children,
    ...restProps
}) => {


  return (
    <TextInput style={[{ fontFamily: "ChangaOne_400Regular",  }, style]} {...restProps} >{children}</TextInput>
  );
};


export default BBTextInput;
