import Navbar from "@/components/Navbar";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Button, Image, Text, View } from "react-native";
import yougeeMain from "@/assets/images/yougee-main.jpg";
import sambaMain from "@/assets/images/samba-main.jpg";
import { ScrollView } from "react-native";

const index = () => {
  return (
    <View>
      <Navbar />
      <ScrollView className="mb-20">
        <View>
          <Content />
        </View>
      </ScrollView>
    </View>
  );
};

function Content() {
  return (
    <View className=" ">
      <Text className="text-3xl mx-auto  text-center border-b my-14 border-orange-400">
        Our Brands
      </Text>
      <View className="h-[70vh] mx-4 rounded-3xl ">
        <Text className="text-xl text-center mx-auto">Yougee</Text>
        <Image
          source={yougeeMain}
          style={{ width: "100%", height: "95%", objectFit: "fill" }}
        />
        <View className="flex flex-col absolute bottom-2 w-full  justify-center items-center">
          <Link href="/yougee" className="bg-black text-white px-4 py-3">
            Shop Now
          </Link>
        </View>
      </View>
      <View className="h-[70vh] mx-4 rounded-3xl  mt-16">
        <Text className="text-xl text-center mx-auto">Samba</Text>
        <Image
          source={sambaMain}
          style={{ width: "100%", height: "100%", objectFit: "fill" }}
        />
        <View className="flex flex-col absolute bottom-2  justify-center items-center w-full ">
          <Link href="/samba" className="bg-black  text-white px-4 py-3">
            Shop Now
          </Link>
        </View>
      </View>
    </View>
  );
}
export default index;
