import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/styles";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.starContainer}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons
          key={`full-${i}`}
          name="star"
          size={14}
          color={colors.primary}
        />
      ))}
      {hasHalfStar && (
        <Ionicons
          key="half"
          name="star-half"
          size={14}
          color={colors.primary}
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={14}
          color={colors.primary}
        />
      ))}
      <Text style={styles.ratingText}>({rating.toFixed(1)})</Text>
    </View>
  );
};

export default function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <StarRating rating={product.rating.rate} />
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
    marginTop: 5,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 10,
    color: colors.gray,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
