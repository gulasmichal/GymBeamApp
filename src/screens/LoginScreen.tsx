import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors } from "../styles/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { Image } from "react-native";

export default function LoginScreen() {
  const {
    signIn,
    continueAsGuest,
    isLoading: isAuthLoading,
    justLoggedOut,
    setJustLoggedOut,
  } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    return () => {
      setJustLoggedOut(false);
    };
  }, []);

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
      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={justLoggedOut}
        onRequestClose={() => setJustLoggedOut(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="checkmark-circle"
              size={50}
              color={colors.primary}
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>Logged Out Successfully</Text>
            <Text style={styles.modalText}>
              You have been successfully logged out.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setJustLoggedOut(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
  logoImage: {
    width: 240,
    height: 240,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: colors.primary,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: colors.black,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalIcon: {
    marginBottom: 10,
  },
});
