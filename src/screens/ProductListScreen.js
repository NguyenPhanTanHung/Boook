import React, { useContext, useEffect } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context';

import productContext from '../features/context/productContext';
import { getProducts } from '../features/firebase/product';
import ProductItem from '../components/ProductItem';
import AuthContext from '../features/context/authContext';


const ProductListScreen = ({ navigation, route }) => {
  const { products, setProducts } = useContext(productContext);
  const condition = route.params.condition;
  const { isLoggedIn, currentUser } = useContext(AuthContext);

  const fetchAllProducts = async () => {
    const result = await getProducts();
    setProducts(result);
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Tất cả sách",
      headerStyle: { backgroundColor: "white" },
      headerTitleAlign: "center",
      headerLeft: () => (
        <Pressable
          onPress={goBack}
          className="justify-center items-center h-10 w-10 mx-4 rounded-full"
        >
          <MaterialIcons name="chevron-left" size={34} color={"#111"} />
        </Pressable>
      ),
    });
    fetchAllProducts();
  }, []);

  // Áp dụng điều kiện lọc dựa trên `condition`
  const filteredProducts = products?.filter((product) => {
    if (condition === "ageCondition") {
      return product.age < (currentUser?.age || 18);
    }
    if (condition === "cheap") {
      return product.price < 150000;
    }
    return true; // Không lọc nếu condition là ""
  });

  return (
    <SafeAreaView className="flex-1 w-full px-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Pressable key={product.id} onPress={() => navigation.navigate("detailscreen", {
              productId: product?.id
            })}>
              <ProductItem
                image={product?.image}
                bookName={product?.bookName}
                price={product?.price}
                title={product?.title}
              />
            </Pressable>
          ))
        ) : (
          <Text className="text-center text-gray-500 mt-5">Không có sản phẩm nào phù hợp.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductListScreen;
