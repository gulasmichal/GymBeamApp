import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../styles/styles";
import { RouteProp } from "@react-navigation/native";
import { getProductById } from "../services/productService";
import { Product } from "../types/product";
import { RootStackParamList } from "../navigation";
import { Ionicons } from "@expo/vector-icons";

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProductDetail"
>;

interface Props {
  route: ProductDetailScreenRouteProp;
}

const StarRating = ({ rating, count }: { rating: number; count: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.starContainer}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons
          key={`full-${i}`}
          name="star"
          size={15}
          color={colors.primary}
        />
      ))}
      {hasHalfStar && (
        <Ionicons
          key="half"
          name="star-half"
          size={15}
          color={colors.primary}
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={15}
          color={colors.primary}
        />
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      <Text style={styles.ratingCount}>({count})</Text>
    </View>
  );
};

export default function ProductDetailScreen({ route }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const { productId } = route.params;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <StarRating rating={product.rating.rate} count={product.rating.count} />
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  details: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  ratingCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    fontSize: 18,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginLeft: 5,
  },
});
