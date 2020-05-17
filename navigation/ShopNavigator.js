import React from "react";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import ProductsOverviewScreen from "./../screens/shop/ProductsOverviewScreen";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import ProductDetailScreen from "./../screens/shop/ProductDetailScreen";
import CartScreen from "./../screens/shop/CartScreen";
import OrderScreen from "../screens/shop/OrderScreen";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import UserProductScreen from "./../screens/user/UserProductScreen";
import EditProductScreen from "./../screens/user/EditProductScreen";
import AuthScreen from "./../screens/user/AuthScreen";
import StartupScreen from "./../screens/StartupScreen";
import CustomDrawerComponent from "../components/UI/DrawerComponent";

const defaultStackNavOptions = {
  headerTitleStyle: {
    fontFamily: "Montserrat-Medium"
  }
};

const ProductNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons name="ios-cart" size={23} color={drawerConfig.tintColor} />
      )
    }
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const OrderNavigator = createStackNavigator(
  {
    Orders: OrderScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons name="ios-list" size={23} color={drawerConfig.tintColor} />
      )
    }
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductScreen,
    EditProduct: EditProductScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons name="ios-create" size={23} color={drawerConfig.tintColor} />
      )
    }
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductNavigator,
    Orders: OrderNavigator,
    Admins: AdminNavigator
  },
  {
    contentOptions: {
      activeTintColor: colors.primary
    },
    contentComponent: CustomDrawerComponent
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);
