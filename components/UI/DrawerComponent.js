import React from "react";
import { DrawerItems } from "react-navigation-drawer";
import { View, SafeAreaView, StyleSheet, Button } from "react-native";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import colors from "../../constants/colors";

const CustomDrawerComponent = props => {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, paddingTop: "15%" }}>
      <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
        <View style={{ height: "40%", backgroundColor: "white" }}></View>
        <DrawerItems {...props} />
        <Button
          color={colors.primary}
          title="Logout"
          onPress={() => {
            dispatch(authActions.logout());
            props.navigation.navigate("Auth");
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CustomDrawerComponent;
