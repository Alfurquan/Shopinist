import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from "react-native";
import Card from "./../UI/Card";

const ProductItem = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <Image
              style={styles.image}
              source={{ uri: props.image }}
              resizeMode="contain"
            />
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            <View style={styles.actions}>{props.children}</View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20,
    overflow: "hidden",
    paddingBottom: 30
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "60%"
  },
  title: {
    fontSize: 18,
    marginVertical: 4,
    textAlign: "center"
  },
  price: {
    fontSize: 14,
    color: "#888",
    textAlign: "center"
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    paddingHorizontal: 10
  }
});

export default ProductItem;
