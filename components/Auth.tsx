import React, { useState } from "react";
import {
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  View,
  AppState,
  ScrollView,
  Text,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { supabase } from "@/utils/supabase";
import Navbar from "./Navbar";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    console.log(session);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");

    setLoading(false);
  }

  return (
    <ScrollView>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Navbar />
        <View style={styles.container}>
          <Text style={styles.logo}>Cosmeto</Text>
          <Text style={styles.loginTitle}>Login</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="Email"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            disabled={loading}
            onPress={() => signInWithEmail()}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          {/* <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text style={styles.signUpLink}>Sign up</Text>
          </Text> */}
          <TouchableOpacity
            style={styles.loginButton}
            disabled={loading}
            onPress={() => signUpWithEmail()}
          >
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a202c",
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1a202c",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  logo: {
    fontSize: 48,
    color: "#ff9800",
    textAlign: "center",
    marginVertical: 40,
    fontWeight: "bold",
  },
  loginTitle: {
    fontSize: 24,
    color: "#000",
    textAlign: "left",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#1a202c",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#ff9800",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  signUpContainer: {
    marginTop: 20,
  },
  signUpText: {
    textAlign: "center",
    color: "#333",
    fontSize: 14,
  },
  signUpLink: {
    color: "#1a202c",
  },
});
