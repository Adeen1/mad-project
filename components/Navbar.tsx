import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Link, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/utils/supabase";

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <Link href="/" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#ff9800" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/cart" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cart-outline" size={24} color="#ff9800" />
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity
        style={{
          backgroundColor: "#ff9800",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
        onPress={() => {
          supabase.auth.signOut();
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Sign Out</Text>
      </TouchableOpacity>
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
