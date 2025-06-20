import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { Product } from "../types/product";
import { colors, globalStyles } from "../styles/styles";
import { RootStackParamList } from "../navigation";
import { useAuth } from "../context/AuthContext";

type SortOption = "default" | "priceLow" | "priceHigh" | "rating" | "name";

// ✅ Use the exact category names your API provides
type Category =
  | "men's clothing"
  | "women's clothing"
  | "jewelry"
  | "electronics"
  | "all";

// ✅ Only allow Ionicon icon names that you actually use
type IconName = "apps" | "man" | "woman" | "diamond" | "phone-portrait";

// ✅ Category-to-label/icon mapping
const categoryButtons: { id: Category; icon: IconName; label: string }[] = [
  { id: "all", icon: "apps", label: "All" },
  { id: "men's clothing", icon: "man", label: "Men" },
  { id: "women's clothing", icon: "woman", label: "Women" },
  { id: "jewelry", icon: "diamond", label: "Jewelry" },
  { id: "electronics", icon: "phone-portrait", label: "Electronics" },
];

// ✅ Mapping for filtering based on category
const categoryMap: Record<Category, string> = {
  "men's clothing": "men's clothing",
  "women's clothing": "women's clothing",
  jewelry: "jewelery", // API spelling
  electronics: "electronics",
  all: "all",
};

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption>("default");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [categoriesVisible, setCategoriesVisible] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signOut, userToken } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      setProducts(allProducts);
      setLoading(false);
    };
    fetchProducts();
  }, []);
  /*
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === categoryMap[activeCategory]
      );
      setFilteredProducts(filtered);
    }
  }, [activeCategory, products]);
  */
  const handleSort = (sortOption: SortOption) => {
    setActiveSort(sortOption);
    setSortModalVisible(false);

    // Start with the currently filtered products
    let sortedProducts = [...filteredProducts];

    switch (sortOption) {
      case "priceLow":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "name":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // For "default", reapply the current category filter
        if (activeCategory === "all") {
          sortedProducts = [...products];
        } else {
          sortedProducts = products.filter(
            (product) => product.category === categoryMap[activeCategory]
          );
        }
    }
    setFilteredProducts(sortedProducts);
  };

  const handleAuthAction = () => {
    if (userToken) {
      signOut();
    } else {
      signOut(); // Simulated logout/login
    }
  };

  const handleCategoryPress = (category: Category) => {
    setActiveCategory(category);
    setCategoriesVisible(false);
    setActiveSort("default");

    // Apply the category filter
    if (category === "all") {
      setFilteredProducts([...products]);
    } else {
      const filtered = products.filter(
        (product) => product.category === categoryMap[category]
      );
      setFilteredProducts(filtered);
    }
  };
  const getActiveCategoryLabel = () => {
    const activeCat = categoryButtons.find((cat) => cat.id === activeCategory);
    return activeCat ? activeCat.label : "Categories";
  };

  const checkFilter = () => {
    if (filteredProducts.length === 0) {
      return products;
    }
    return filteredProducts;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/gymbeamlogosmall.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity onPress={handleAuthAction} style={styles.authButton}>
          <Ionicons
            name={userToken ? "log-out-outline" : "person-outline"}
            size={24}
            color={colors.primary}
            style={{ marginLeft: 3 }}
          />
          {!userToken && <Text style={styles.authHintText}>Login</Text>}
        </TouchableOpacity>
      </View>
      {/* Sort Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sort By</Text>
                {(
                  [
                    "default",
                    "priceLow",
                    "priceHigh",
                    "rating",
                    "name",
                  ] as SortOption[]
                ).map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.sortOption,
                      activeSort === option && styles.activeSortOption,
                    ]}
                    onPress={() => handleSort(option)}
                  >
                    <Text style={styles.sortOptionText}>
                      {getSortOptionLabel(option)}
                    </Text>
                    {activeSort === option && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* Main Categories Button */}
      <TouchableOpacity
        onPress={() => setCategoriesVisible(!categoriesVisible)}
        style={styles.mainCategoryButton}
      >
        <Ionicons
          name={
            categoryButtons.find((cat) => cat.id === activeCategory)?.icon ||
            "list"
          }
          size={20}
          color={colors.white}
        />
        <Text style={styles.mainCategoryButtonText}>
          {getActiveCategoryLabel()}
        </Text>
        <Ionicons
          name={categoriesVisible ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.white}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
      {/* Category Buttons - Conditionally Rendered */}
      {categoriesVisible && (
        <View style={styles.categoryButtonsColumn}>
          {categoryButtons.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.activeCategoryButton,
              ]}
              onPress={() => {
                handleCategoryPress(category.id);
                setCategoriesVisible(false);
                setActiveSort("default");
              }}
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={
                    activeCategory === category.id
                      ? colors.primary
                      : colors.white
                  }
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    activeCategory === category.id && styles.activeCategoryText,
                  ]}
                >
                  {category.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* Sort Button */}
      <TouchableOpacity
        onPress={() => setSortModalVisible(true)}
        style={styles.standaloneFilterButton}
      >
        <Ionicons name="options" size={20} color={colors.buttongray} />
        <Text style={styles.standaloneFilterButtonText}>Sort</Text>
      </TouchableOpacity>
      {/* Product Grid */}
      <FlatList
        data={checkFilter()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate("ProductDetail", { productId: item.id })
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const getSortOptionLabel = (option: SortOption): string => {
  switch (option) {
    case "default":
      return "Default";
    case "priceLow":
      return "Price: Low to High";
    case "priceHigh":
      return "Price: High to Low";
    case "rating":
      return "Highest Rating";
    case "name":
      return "Alphabetical";
    default:
      return "";
  }
};

const styles = StyleSheet.create({
  ...globalStyles,
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  logoutButton: {
    padding: 5,
  },
  listContent: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authButton: {
    padding: 8,
  },
  authHintText: {
    fontSize: 12,
    color: colors.primary,
    textAlign: "center",
    marginTop: 2,
  },
  activeSortOption: {
    backgroundColor: colors.lightGray,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.primary,
  },
  sortOptionText: {
    fontSize: 16,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  logoContainer: {
    alignItems: "center",
  },
  categoryButtonsColumn: {
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: colors.white,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttongray,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonText: {
    marginLeft: 10,
    color: colors.white,
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  activeCategoryButton: {
    backgroundColor: colors.buttongray,
  },
  activeCategoryText: {
    color: colors.primary,
  },
  standaloneFilterButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderColor: colors.buttongray,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
  },
  standaloneFilterButtonText: {
    color: colors.buttongray,
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 14,
  },
  mainCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.buttongray,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
  },
  mainCategoryButtonText: {
    color: colors.white,
    marginLeft: 8,
    marginRight: 8,
    fontWeight: "500",
    fontSize: 14,
  },
  chevronIcon: {
    marginLeft: 4,
  },
});
