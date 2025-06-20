// src/navigation/index.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import ProductsScreen from "../screens/ProductsScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import { useAuth } from "../context/AuthContext";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Products: undefined;
  ProductDetail: { productId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { userToken, isGuest } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken || isGuest ? (
          // Authenticated or guest screens
          <>
            <Stack.Screen
              name="Products"
              component={ProductsScreen}
              options={{ headerShown: false }} // This hides the ProductsScreen header
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              // No options here means the default header will show
            />
          </>
        ) : (
          // Auth screens
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
