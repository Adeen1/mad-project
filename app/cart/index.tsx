import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/Loader";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LocationPicker from "@/components/LocationPicker";
const Index = () => {
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
  // clientName,clientEmail,clientPhone1,clientPhone2,clientAddress,clientPostal,clientCity,items,total

  const fetchData = async () => {
    try {
      setLoading(true);
      const cartData = await AsyncStorage.getItem("cart");
      console.log(cartData);
      let cart = cartData ? JSON.parse(cartData) : [];

      setData(cart);
      console.log(data, "data");
      setLoading(false);
    } catch (error) {
      console.error("Error reading cart:", error);
      setData({ cart: [] });
    }
  };
  const deleteItem = async (id: any) => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      let cart = cartData ? JSON.parse(cartData) : [];

      const newCart = cart.filter((product: any) => product.id !== id);
      console.log("new cart", id, newCart);
      await AsyncStorage.setItem("cart", JSON.stringify(newCart));
      setData(newCart);
      console.log("Product removed from cart:", cart);
    } catch (error) {
      console.error("Error deleting from cart:", error);
    }
  };
  const valid = () => {
    if (name.length == 0) {
      setErrorStatus(500);
      setErrorMessage("Name cannot be empty!");
      return false;
    } else if (email.length == 0) {
      setErrorStatus(500);
      setErrorMessage("Email cannot be empty!");
      return false;
    } else if (phone.length == 0) {
      setErrorStatus(500);
      setErrorMessage("Phone number cannot be empty!");
      return false;
    } else if (city.length == 0) {
      setErrorStatus(500);
      setErrorMessage("City cannot be empty!");
      return false;
    } else if (postal.length == 0) {
      setErrorStatus(500);
      setErrorMessage("Postal Code cannot be empty!");
      return false;
    }
    return true;
  };

  const incrementQuantity = async (id: number, num: number) => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      let cart = cartData ? JSON.parse(cartData) : [];
      const index = cart.findIndex((obj: any) => {
        return obj.id == id;
      });
      console.log(index);
      if (index !== -1) {
        if (cart[index].quantityItems == 1 && num == -1) {
          deleteItem(id);
          return;
        }
        cart[index].quantityItems = cart[index].quantityItems + num; // Update the attribute
        console.log("inside");
      }
      console.log("updated cart", cart);

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      setData(cart);
      console.log("qunatity incremented:", cart);
    } catch (error) {
      console.error("Error incrementing quantity cart:", error);
    }
  };
  const submitOrder = async () => {
    if (!valid()) {
      return;
    }
    let totalAmount = 0;
    data.forEach((singleItem: any) => {
      let product_price = singleItem.price * singleItem.quantityItems;
      totalAmount += product_price;
    });
    const order = await supabase
      .from("Orders")
      .insert({
        order_date: new Date(),
        customer_email: email,
        customer_name: name,
        shipping_address: address,
        total_amount: totalAmount,
      })
      .select("*")
      .single();
    console.log("order");
    console.log(order.data);
    if (order.status <= 203) {
      const order_products_list = data.map((singleItem: any) => {
        return {
          product_id: singleItem.id,
          order_id: order.data.order_id,
          quantity: singleItem.quantityItems,
          sub_total: singleItem.price * singleItem.quantityItems,
        };
      });
      const order_products = await supabase
        .from("Order_Product")
        .insert(order_products_list);
      console.log("order products");
      console.log(order_products);
      if (order_products.error) {
        setErrorMessage(order_products.error);
        setErrorStatus(500);
      } else {
        setErrorMessage("successfully submited cart!");
        setErrorStatus(200);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <View>
          <View>
            <Text className="text-2xl text-center">Cart Items</Text>
            <View className="flex flex-row justify-around">
              <TextInput
                placeholder="Enter your name"
                value={name}
                onChangeText={(text) => setName(text)}
                className="my-1 w-[45%]  mx-auto border border-black py-2 px-3"
              />
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                className="my-1 w-[45%]  mx-auto border border-black py-2 px-3"
              />
            </View>

            <View className="flex flex-row justify-around">
              <TextInput
                placeholder="Enter your city"
                value={city}
                onChangeText={(text) => setCity(text)}
                className="my-1 w-[45%]  mx-auto border border-black py-2 px-3"
              />
              <TextInput
                placeholder="postal code"
                value={postal}
                onChangeText={(text) => setPostal(text)}
                className="my-1 w-[45%]  mx-auto border border-black py-2 px-3"
              />
            </View>
            <TextInput
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={(text) => setPhone(text)}
              className="my-1 w-[80%]  mx-auto border border-black py-2 px-3"
            />
            <TextInput
              placeholder="Enter your address"
              value={address}
              onChangeText={(text) => setAddress(text)}
              className="my-1 w-[80%]  mx-auto border border-black py-2 px-3"
            />

            {/* <LocationPicker /> */}
          </View>
          {errorStatus >= 200 && (
            <View className="w-[80%] mx-auto">
              <Text
                className={`${
                  errorStatus == 200 ? "text-green-500" : "text-red-600"
                } text-sm `}
              >
                <Text>{errorMsg} </Text>

                <Text
                  onPress={() => setErrorStatus(0)}
                  className="text-center  text-black ml-4"
                >
                  X
                </Text>
              </Text>
            </View>
          )}
          {data &&
            data.map((singleItem: any, index: number) => {
              return (
                <View
                  key={index}
                  className="flex  flex-grow flex-1  flex-col items-center w-[90%] mt-4 border border-black mx-auto rounded-xl"
                >
                  <Image
                    source={{ uri: singleItem.img }}
                    style={{ objectFit: "fill", width: "80%", height: 200 }}
                  />
                  <View className="w-[90%] mx-auto h-fit py-4 flex flex-col items-start justify-start">
                    <Text className="text-orange-500 ">
                      Name :{" "}
                      <Text className="text-black w-9 ">
                        {" "}
                        {singleItem.name}
                      </Text>
                    </Text>
                    <Text className="text-orange-500 ">
                      Price :{" "}
                      <Text className="text-black">Rs {singleItem.price}</Text>
                    </Text>
                    <View className=" flex flex-row justify-center items-center ">
                      <Text className="text-orange-500">Quantity : </Text>
                      <TouchableOpacity
                        className="text-green-400 mr-6 ml-2 "
                        onPress={() => {
                          incrementQuantity(singleItem.id, 1);
                        }}
                      >
                        <Text className="">+</Text>
                      </TouchableOpacity>
                      <Text className="text-black">
                        {singleItem.quantityItems}
                      </Text>
                      <TouchableOpacity
                        className="text-red-500 ml-6 "
                        onPress={() => {
                          incrementQuantity(singleItem.id, -1);
                        }}
                      >
                        <Text className="">-</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        deleteItem(singleItem.id);
                      }}
                      className="bg-red-600 mt-5  px-4 py-1 mx-auto rounded-lg"
                    >
                      <Text className="text-white"> Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

          {data.length > 0 && (
            <TouchableOpacity
              className="w-[50%] mx-auto bg-black px-6 py-2 mt-5 rounded-lg"
              onPress={() => {
                submitOrder();
              }}
            >
              <Text className="text-white text-center"> Submit 🛒</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default Index;
