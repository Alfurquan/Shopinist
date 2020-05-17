import React, { useState } from "react";
import { FlatList, Button, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "./../../components/UI/HeaderButton";
import * as productActions from "../../store/actions/products";

const UserProductScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const userProducts = useSelector(state => state.products.userProducts);

  const editProductHandler = id => {
    props.navigation.navigate("EditProduct", { productId: id });
  };

  const deleteProductHandler = id => {
    Alert.alert("Are you sure ?", "Do you want to delete this item?", [
      {
        text: "No",
        style: "default"
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(productActions.deleteProduct(id));
        }
      }
    ]);
  };

  const dispatch = useDispatch();
  return (
    <FlatList
      data={userProducts}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            title="Edit "
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            title="Delete"
            onPress={() => deleteProductHandler(itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

UserProductScreen.navigationOptions = navData => {
  return {
    headerTitle: "Your Products",
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
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Add"
          iconName="ios-create"
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    )
  };
};

export default UserProductScreen;
