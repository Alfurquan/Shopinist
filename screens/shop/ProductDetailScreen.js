import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView
} from "react-native";
import * as cartActions from "../../store/actions/cart";

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam("productId");

  const dispatch = useDispatch();

  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  return (
    <ScrollView>
      <Image
        style={styles.image}
        source={{ uri: selectedProduct.imageUrl }}
        resizeMode="contain"
      />
      <View style={styles.actions}>
        <Button
          title="Add To Cart "
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 10
  },
  actions: {
    marginVertical: 20,
    alignItems: "center"
  }
});

export default ProductDetailScreen;
