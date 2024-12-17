import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Link, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownAnimation = new Animated.Value(0);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    Animated.timing(dropdownAnimation, {
      toValue: isDropdownOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const dropdownStyle = {
    ...styles.dropdown,
    opacity: dropdownAnimation,
    transform: [
      {
        translateY: dropdownAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.navbar}>
      <Link href="/" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#ff9800" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
      </Link>

      <View>
        <TouchableOpacity style={styles.navItem} onPress={toggleDropdown}>
          <Ionicons
            name={
              isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"
            }
            size={24}
            color="#ff9800"
          />
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        {isDropdownOpen && (
          <Animated.View style={dropdownStyle}>
            <Link href="/brand/yougee" asChild>
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  pathname.includes("/brand/yougee") && styles.activeLink,
                ]}
              >
                <Text style={styles.dropdownText}>Yougee</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/brand/samba" asChild>
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  pathname.includes("/brand/samba") && styles.activeLink,
                ]}
              >
                <Text style={styles.dropdownText}>Samba</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        )}
      </View>

      <Link href="/cart" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cart-outline" size={24} color="#ff9800" />
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a202c",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  navText: {
    color: "#ff9800",
    marginLeft: 5,
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#2d3748",
    borderRadius: 10,
    padding: 10,
    minWidth: 120,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  dropdownText: {
    color: "#ff9800",
    fontSize: 16,
  },
  activeLink: {
    backgroundColor: "#ff9800",
  },
});

export default Navbar;
