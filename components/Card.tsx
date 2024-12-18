import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
const Card = ({
  name,
  price,
  id,
  img,
}: {
  name: string;
  price: number;
  id: number;
  img: string;
}) => {
  return (
    <View className=" h-[60vh] flex flex-col w-[80%]  bg-gray-300 my-5  backdrop-blur-sm">
      <Image
        source={{ uri: img }}
        style={{ objectFit: "fill", width: "100%", height: "100%" }}
      />
      <View className="bottom-0 w-full mx-auto backdrop-blur-md  bg-gray-50/75  py-4 absolute flex flex-col items-center">
        <Text className="text-orange-500 w-[80%] ">
          Name : <Text className="text-black w-9 "> {name}</Text>
        </Text>
        <Text className="text-orange-500 w-[80%]">
          Price : <Text className="text-black">Rs {price}</Text>
        </Text>

        <Link
          href={`/product?id=${id}`}
          className="bg-black text-white py-2 px-4 mt-4"
        >
          Shop Now
        </Link>
      </View>
    </View>
  );
};

export default Card;
