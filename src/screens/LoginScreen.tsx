import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors } from "../styles/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { Image } from "react-native";

export default function LoginScreen() {
  const { signIn, continueAsGuest, isLoading: isAuthLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn({ username, password });
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/GB_Logo_Energy_COM.webp")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={colors.gray}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!isSubmitting}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.gray}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isSubmitting || isAuthLoading}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            disabled={isSubmitting}
          >
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Text style={styles.registerText}>Register</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>Enter your credentials to login</Text>
        </View>

        <View style={styles.guestContainer}>
          <TouchableOpacity
            onPress={continueAsGuest}
            style={styles.guestButton}
            disabled={isAuthLoading || isSubmitting}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.whitebg,
  },
  logoContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.black,
    marginTop: 5,
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 0,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 0,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: colors.black,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 0,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    color: colors.gray,
    fontSize: 14,
    marginVertical: 3,
  },
  registerText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  guestContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  guestButton: {
    padding: 5,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.white,
  },
  guestButtonText: {
    color: colors.lightGray,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  footerLinks: {
    marginTop: 30,
    alignItems: "center",
  },
  logoImage: {
    width: 240,
    height: 240,
  },
});
