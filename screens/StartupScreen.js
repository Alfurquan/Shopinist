import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from "react-native";
import colors from "../constants/colors";
import * as authActions from "../store/actions/auth";

const StartupScreen = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        props.navigation.navigate("Auth");
        return;
      }

      const transformedData = JSON.parse(userData);
      const { token, userId } = transformedData;

      if (!token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }

      props.navigation.navigate("Shop");
      dispatch(authActions.authenticate(token, userId));
    };
    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default StartupScreen;
