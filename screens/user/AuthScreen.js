import React, { useReducer, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  ActivityIndicator,
  Alert
} from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import colors from "../../constants/colors";
import * as authActions from "../../store/actions/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };

    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      ...state,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid
    };
  }
  return state;
};

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const [signUpFormState, dispatchSignUpFormState] = useReducer(formReducer, {
    inputValues: {
      name: "",
      email: "",
      password: ""
    },
    inputValidities: {
      name: false,
      email: false,
      password: false
    },
    formIsValid: false
  });

  const [loginFormState, dispatchLoginFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: ""
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An Error occured!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const textChangeHandler = (inputIdentifier, text) => {
    let isValid = false;
    if (text.trim().length > 0) {
      isValid = true;
    }
    isSignUp
      ? dispatchSignUpFormState({
          type: FORM_INPUT_UPDATE,
          value: text,
          isValid: isValid,
          input: inputIdentifier
        })
      : dispatchLoginFormState({
          type: FORM_INPUT_UPDATE,
          value: text,
          isValid: isValid,
          input: inputIdentifier
        });
  };

  const authHandler = async () => {
    let action;
    if (isSignUp) {
      if (!signUpFormState.formIsValid) {
        Alert.alert("Wrong Input!", "Please check the errors", [
          { text: "Okay" }
        ]);
        return;
      }
      action = authActions.signUp(
        signUpFormState.inputValues.name,
        signUpFormState.inputValues.email,
        signUpFormState.inputValues.password
      );
    } else {
      if (!loginFormState.formIsValid) {
        Alert.alert("Wrong Input!", "Please check the errors", [
          { text: "Okay" }
        ]);
        return;
      }
      action = authActions.login(
        loginFormState.inputValues.email,
        loginFormState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (er) {
      console.log("caught", er);
      setError(er.message);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={30}
      style={styles.screen}
    >
      <Card style={styles.authContainer}>
        <ScrollView>
          {isSignUp ? (
            <View>
              <Input
                label="Name"
                value={signUpFormState.inputValues.name}
                isValid={signUpFormState.inputValidities.name}
                onTextChange={textChangeHandler.bind(this, "name")}
                errorText="Please enter a valid name!"
                keyboardType="default"
                autoCapitalize="words"
                returnKeyType="next"
              />
              <Input
                label="Email"
                value={signUpFormState.inputValues.email}
                isValid={signUpFormState.inputValidities.email}
                onTextChange={textChangeHandler.bind(this, "email")}
                errorText="Please enter a valid email!"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
              <Input
                label="Password"
                value={signUpFormState.inputValues.password}
                isValid={signUpFormState.inputValidities.password}
                onTextChange={textChangeHandler.bind(this, "password")}
                errorText="Please enter a valid password!"
                keyboardType="default"
                secureTextEntry
                autoCapitalize="none"
                minLength={5}
                returnKeyType="next"
              />
            </View>
          ) : (
            <View>
              <Input
                label="Email"
                value={loginFormState.inputValues.email}
                isValid={loginFormState.inputValidities.email}
                onTextChange={textChangeHandler.bind(this, "email")}
                errorText="Please enter a valid email!"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
              <Input
                label="Password"
                value={loginFormState.inputValues.password}
                isValid={loginFormState.inputValidities.password}
                onTextChange={textChangeHandler.bind(this, "password")}
                errorText="Please enter a valid password!"
                keyboardType="default"
                secureTextEntry
                autoCapitalize="none"
                minLength={5}
                returnKeyType="next"
              />
            </View>
          )}
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Button
                title={isSignUp ? "SignUp" : "Login"}
                color={colors.primary}
                onPress={authHandler}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={`Switch to ${isSignUp ? "Login" : "Sign Up"}`}
              onPress={() => {
                setIsSignUp(prevState => !prevState);
              }}
            />
          </View>
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Get Started"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: "3%"
  }
});

export default AuthScreen;
