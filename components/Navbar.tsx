import { Link } from "expo-router";
import React, { useState } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
const Navbar = () => {
  const [active, setActive] = useState(false);
  return (
    <View className="bg-gray-900 px-4 flex justify-between items-center hover:text-orange-600 flex-row py-4 mb-10">
      <View className="flex flex-row">
        <Icon name="home" color="#fb923c" size={20} />
        <Link href="/" className="text-orange-400 ml-1">
          Home
        </Link>
      </View>

      <View className="text-orange-400">
        <View className="flex flex-row items-center">
          {active ? (
            <Icon color="#fb923c" size={13} name="caretup" />
          ) : (
            <Icon color="#fb923c" size={13} name="caretdown" />
          )}
          <Text
            className="text-orange-500 ml-1"
            onPress={() => setActive(!active)}
          >
            Products
          </Text>
        </View>
        {active && (
          <View className="absolute top-11 bg-black rounded-xl py-4 w-28 flex flex-col items-center justify-center z-50">
            <Link href="/yougee" className="text-orange-400 underline mb-5">
              Yougee
            </Link>
            <Link href="/samba" className="text-orange-400 underline">
              Samba
            </Link>
          </View>
        )}
      </View>
      <View className="flex flex-row">
        <Icon name="shoppingcart" color="#fb923c" size={20} />
        <Link href="/cart" className="text-orange-400 ml-1">
          Cart
        </Link>
      </View>
    </View>
  );
};

export default Navbar;
