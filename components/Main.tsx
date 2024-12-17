import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageProps,
} from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Navbar from "@/components/Navbar";
//@ts-ignore
import yougeeMain from "@/assets/images/yougee-main.jpg";
//@ts-ignore
import sambaMain from "@/assets/images/samba-main.jpg";

const { width } = Dimensions.get("window");

const BrandCard = ({
  title,
  image,
  link,
}: {
  title: string;
  image: Readonly<ImageProps>;
  link: string;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        marginBottom: 20,
      }}
    >
      <View style={styles.cardContainer}>
        <Text style={styles.brandTitle}>{title}</Text>
        <Image source={image} style={styles.brandImage} />
        <View style={styles.overlay}>
          {/* @ts-ignore */}
          <Link href={link} asChild>
            <TouchableOpacity style={styles.shopButton}>
              <Text style={styles.shopButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </Animated.View>
  );
};

function Content() {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Our Brands</Text>
      </View>
      <BrandCard title="Yougee" image={yougeeMain} link="/brand/yougee" />
      <BrandCard title="Samba" image={sambaMain} link="/brand/samba" />
    </View>
  );
}

const Main = ({ email }: { email: string }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Navbar />
      <ScrollView style={styles.scrollView}>
        <Content />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: "#ff9800",
    paddingVertical: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  cardContainer: {
    height: width * 1.2,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  brandImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  shopButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Main;
