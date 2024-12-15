import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import Loader from "@/components/Loader";

const index = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const req = await supabase
      .from("Products")
      .select("*")
      .eq("brand", "yougee");

    console.log(req.data, req.status, req.error);
    setData(req.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <View className="flex flex-col justify-center items-center mt-14">
          <Text className="underline text-orange-500 text-4xl">
            Samba Products
          </Text>
          {data.map((singleProd: any) => {
            return (
              <Card
                key={singleProd.name}
                img={singleProd.image_url}
                name={singleProd.name}
                price={singleProd.price}
                id={singleProd.product_id}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default index;
