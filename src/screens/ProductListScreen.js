import React, { useContext, useEffect } from 'react';
import { Pressable, ScrollView } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context';

import productContext from '../features/context/productContext';
import { getProducts } from '../features/firebase/product';
import ProductItem from '../components/ProductItem';

const ProductListScreen = ({ navigation }) => {
  const { products, setProducts } = useContext(productContext)

  const fetchAllProducts = async () => {
    const result = await getProducts()
    setProducts(result)
  }
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
          className=" justify-center items-center h-10 w-10 mx-4 rounded-full "
        >
          <MaterialIcons name="chevron-left" size={34} color={"#111"} />
        </Pressable>
      ),
    }),
      fetchAllProducts();
  }, []);

  return (
    <SafeAreaView className="flex-1 w-full px-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {products?.map((product) => (
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
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductListScreen;
