import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/utils/supabase";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Loader from "@/components/Loader";

const { width, height } = Dimensions.get("window");

const BrandPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useLocalSearchParams();

  const fetchData = async () => {
    setLoading(true);
    const req = await supabase.from("Products").select("*").eq("brand", slug);

    console.log(req.data, req.status, req.error);
    setData(req.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const getBrandImage = () => {
    switch (slug) {
      case "yougee":
        return require("@/assets/images/yougee-main.jpg");
      case "samba":
        return require("@/assets/images/samba-main.jpg");
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={getBrandImage()}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </Text>
          </View>
        </ImageBackground>
        {loading ? (
          <Loader />
        ) : (
          <View style={styles.content}>
            <Text style={styles.subtitle}>Our Products</Text>
            <View style={styles.cardContainer}>
              {data.map((singleProd: any) => (
                <Card
                  key={singleProd.name}
                  img={singleProd.image_url}
                  name={singleProd.name}
                  price={singleProd.price}
                  id={singleProd.product_id}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBackground: {
    width: "100%",
    height: height * 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 10,
  },
});

export default BrandPage;
