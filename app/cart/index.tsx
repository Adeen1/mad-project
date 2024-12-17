import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";

const CartPage = () => {
  const [data, setData] = useState<any>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(0);
  const [errorMsg, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const cartData = await AsyncStorage.getItem("cart");
      let cart = cartData ? JSON.parse(cartData) : [];
      setData(cart);
      setLoading(false);
    } catch (error) {
      console.error("Error reading cart:", error);
      setData([]);
    }
  };

  const deleteItem = async (id: any) => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      let cart = cartData ? JSON.parse(cartData) : [];
      const newCart = cart.filter((product: any) => product.id !== id);
      await AsyncStorage.setItem("cart", JSON.stringify(newCart));
      setData(newCart);
    } catch (error) {
      console.error("Error deleting from cart:", error);
    }
  };

  const incrementQuantity = async (id: number, num: number) => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      let cart = cartData ? JSON.parse(cartData) : [];
      const index = cart.findIndex((obj: any) => obj.id === id);
      if (index !== -1) {
        if (cart[index].quantityItems === 1 && num === -1) {
          deleteItem(id);
          return;
        }
        cart[index].quantityItems += num;
      }
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      setData(cart);
    } catch (error) {
      console.error("Error incrementing quantity cart:", error);
    }
  };

  const submitOrder = async () => {
    if (!validateForm()) return;

    let totalAmount = data.reduce(
      (total: number, item: any) => total + item.price * item.quantityItems,
      0
    );

    try {
      const { data: orderData, error } = await supabase
        .from("Orders")
        .insert({
          order_date: new Date(),
          customer_email: email,
          customer_name: name,
          shipping_address: address,
          total_amount: totalAmount,
        })
        .select()
        .single();

      if (error) throw error;

      const orderProductsList = data.map((item: any) => ({
        product_id: item.id,
        order_id: orderData.order_id,
        quantity: item.quantityItems,
        sub_total: item.price * item.quantityItems,
      }));

      const { error: orderProductsError } = await supabase
        .from("Order_Product")
        .insert(orderProductsList);

      if (orderProductsError) throw orderProductsError;

      Alert.alert("Success", "Order submitted successfully!");
      await AsyncStorage.removeItem("cart");
      setData([]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const validateForm = () => {
    if (!name) return showError("Name cannot be empty!");
    if (!email) return showError("Email cannot be empty!");
    if (!phone) return showError("Phone number cannot be empty!");
    if (!city) return showError("City cannot be empty!");
    if (!postal) return showError("Postal Code cannot be empty!");
    if (!address) return showError("Address cannot be empty!");
    return true;
  };

  const showError = (message: string) => {
    setErrorStatus(500);
    setErrorMessage(message);
    return false;
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <ScrollView style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Text style={styles.title}>Your Cart</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={postal}
            onChangeText={setPostal}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        {errorStatus >= 200 && (
          <Text
            style={[
              styles.errorText,
              errorStatus === 200 && styles.successText,
            ]}
          >
            {errorMsg}
          </Text>
        )}

        {data.map((item: any, index: number) => (
          <View key={index} style={styles.cartItem}>
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Rs {item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => incrementQuantity(item.id, -1)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="#ff9800"
                  />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantityItems}</Text>
                <TouchableOpacity onPress={() => incrementQuantity(item.id, 1)}>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#ff9800"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => deleteItem(item.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}

        {data.length > 0 && (
          <TouchableOpacity style={styles.submitButton} onPress={submitOrder}>
            <Text style={styles.submitButtonText}>Place Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  successText: {
    color: "green",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemDetails: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "#ff9800",
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: "#ff5252",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  submitButton: {
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CartPage;
