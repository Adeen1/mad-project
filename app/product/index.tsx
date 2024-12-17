import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Link, useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Loader from "@/components/Loader";
import { Cart, Product } from "../types/products";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const search = useLocalSearchParams();
  console.log(search.id, typeof search.id);

  const [data, setData] = useState<Product>({
    brand: "",
    created_at: "",
    description: "",
    image_url: "",
    name: "",
    price: 0,
    product_id: 0,
    quantity: 0,
    resource: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const req = await supabase
      .from("Products")
      .select("*")
      .eq(
        "product_id",
        typeof search.id === "string"
          ? parseInt(search.id)
          : parseInt(search.id[0])
      );
    const req_data: Product[] | null = req.data;
    if (!req_data) return;
    console.log(req_data[0] as Product, "data");

    setData(req_data[0]);
    setLoading(false);
  };

  const addToCart = async (id: number) => {
    const cartData = await AsyncStorage.getItem("cart");
    console.log("Stored cart data:", cartData); // Debugging: log retrieved data

    let cart = cartData ? JSON.parse(cartData) : [];

    if (!Array.isArray(cart)) {
      cart = []; // Reset to a valid structure
    }

    const existingProductIndex = cart.findIndex((p: Cart) => p.id === id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantityItems += 1;
    } else {
      cart.push({
        id,
        name: data.name,
        img: data.image_url,
        price: data.price,
        quantityItems: 1,
      }); // Ensure data is structured
    }

    await AsyncStorage.setItem("cart", JSON.stringify(cart));
    console.log("Product added to cart:", cart);
    router.push("/cart");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <Navbar />
      {loading && <Loader />}
      {data.name && (
        <View className="flex pb-3 flex-grow flex-1  flex-col items-center w-[90%] mt-4">
          <Image
            source={{ uri: data.image_url }}
            style={{ objectFit: "fill", width: "80%", height: 400 }}
          />
          <View className="w-[90%] mx-auto h-fit py-4 flex flex-col items-start justify-start">
            <Text className="text-orange-500 ">
              Name : <Text className="text-black w-9 "> {data.name}</Text>
            </Text>
            <Text className="text-orange-500 ">
              Price : <Text className="text-black">Rs {data.price}</Text>
            </Text>
            <Text className="text-orange-500 ">
              Quantity : <Text className="text-black">{data.quantity} ml</Text>
            </Text>

            <View>
              <Text className="text-orange-500">Description :</Text>
              <Text className="ml-3">{data.description}</Text>
            </View>
            <View className="flex flex-row w-full justify-around">
              <TouchableOpacity
                onPress={() => {
                  addToCart(data.product_id);
                }}
                className="bg-orange-400  text-white py-2 px-4 mt-4"
              >
                <Text>Add To Cart</Text>
              </TouchableOpacity>

              <Link
                //@ts-ignore
                href={data.resource || "/"}
                className="bg-black text-white py-2 px-4 mt-4"
              >
                Lear more{" "}
              </Link>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Index;
