import React, { useState } from "react";

import { View, Text, TextInput, StyleSheet } from "react-native";

const Input = props => {
  const [isInputTouched, setIsInputTouched] = useState(false);
  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={props.value}
        onChangeText={props.onTextChange}
        onFocus={() => setIsInputTouched(true)}
      />
      {!props.isValid && isInputTouched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%"
  },
  label: {
    fontFamily: "Montserrat-Medium",
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 2
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: "red",
    fontFamily: "Montserrat-Medium"
  }
});

export default Input;
