import React, { useCallback, useEffect, useReducer, useState } from "react";

import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "./../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import * as productActions from "../../store/actions/products";
import Input from "../../components/UI/Input";
import colors from "../../constants/colors";

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

const EditProductScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: ""
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error, [{ text: "Okay" }]);
    }
  });

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input!", "Please check the errors", [
        { text: "Okay" }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      if (editedProduct) {
        await dispatch(
          productActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            formState.inputValues.description
          )
        );
      } else {
        await dispatch(
          productActions.addProduct(
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            +formState.inputValues.price,
            formState.inputValues.description
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const textChangeHandler = (inputIdentifier, text) => {
    let isValid = false;
    if (text.trim().length > 0) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: inputIdentifier
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          label="Title"
          value={formState.inputValues.title}
          isValid={formState.inputValidities.title}
          onTextChange={textChangeHandler.bind(this, "title")}
          errorText="Please enter a valid title!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
        />
        <Input
          label="Image URL"
          value={formState.inputValues.imageUrl}
          isValid={formState.inputValidities.imageUrl}
          onTextChange={textChangeHandler.bind(this, "imageUrl")}
          errorText="Please enter a valid Image URL!"
          keyboardType="default"
          returnKeyType="next"
        />
        {editedProduct ? null : (
          <Input
            label="Price"
            value={formState.inputValues.price}
            isValid={formState.inputValidities.price}
            onTextChange={textChangeHandler.bind(this, "price")}
            errorText="Please enter a valid price!"
            keyboardType="decimal-pad"
            returnKeyType="next"
          />
        )}
        <Input
          label="Description"
          value={formState.inputValues.description}
          isValid={formState.inputValidities.description}
          onTextChange={textChangeHandler.bind(this, "description")}
          errorText="Please enter a valid description!"
          keyboardType="default"
          multiline
          numberOfLines={3}
        />
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title="Add" iconName="ios-checkmark" onPress={submitFn} />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default EditProductScreen;
