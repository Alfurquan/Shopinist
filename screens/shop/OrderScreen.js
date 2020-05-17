import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  View
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "./../../components/UI/HeaderButton";
import OrderItem from "./../../components/shop/OrderItem";
import * as orderActions from "../../store/actions/orders";
import colors from "../../constants/colors";

const OrderScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);

  // console.log("orders inside", orders);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(orderActions.fetchOrders());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    fetchOrders();
  }, [dispatch]);

  if (error) {
    <View style={styles.centered}>
      <Text>An error occurred!</Text>
    </View>;
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isLoading && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Orders found!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={itemData => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrderScreen.navigationOptions = navData => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default OrderScreen;
