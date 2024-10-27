import { Text, View, Pressable, Image } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView  } from "react-native-safe-area-context";

import { addToCart } from "../features/firebase/cart";
import { getProductById } from "../features/firebase/product";
import productContext from "../features/context/productContext";
import cartContext from "../features/context/cartContext";

const DetailScreen = ({navigation, route}) => {
  const {currentProduct:product,setCurrentProduct} = useContext(productContext);
  const {setCartItems} = useContext(cartContext) 
  const id=route.params.productId;
  const [qty,setQty]=useState(1);

  const increment =()=>{
    setQty(prev=>prev+1)
  }
  const decrement =()=>{
    if(qty>1){
      setQty(prev=>prev-1)
    }
  }

  const goBack =() => {
    navigation.goBack()
  }

  const addItemToCart = async() => {
    const res = await addToCart(id,qty)
    if(res.success===true){
      setCartItems(res.data)
    }
  }

  const fetchProductById =async(id) =>{
    try {
      const result = await getProductById(id);
      setCurrentProduct(result);
    } catch (error) {
      console.error("Failed to fetch product:", error); 
    }
  }
  useEffect(()=>{
    fetchProductById(id)
  },[id])
  return (
    <SafeAreaView className="h-full bg-white">
      <View className=" bg-black w-full">
        <Pressable onPress={goBack} className="mt-2 absolute z-10 top-4 justify-center items-center
         h-10 w-10 mx-4 rounded-full bg-black">
          <MaterialIcons name="chevron-left" size={34} color={"#fff"} />
        </Pressable>
          <Image source={{uri:product?.image}} style={{resizeMode:"cover"}} className=" h-[470]" />
      </View>

      <View className="rounded-[30px]  bg-white mt-[-20px] p-5">
        <View>
          <View className="flex-row justify-between">
              <View style={{ flexWrap: 'wrap', width: '100%' }}>
                  <Text className="font-extrabold text-lg">{product?.bookName}</Text>
                  <Text className="text-xs text-gray-500 text-wrap" style={{ flexWrap: 'wrap', width: '100%' }}> {product?.title}</Text>
                  <Text className="text-xs text-gray-500">{`Tác giả: ${product?.author}`}</Text>
                  <Text className="text-xs text-gray-500">{`Thể loại: ${product?.category}`}</Text>
              </View>
              <View>
                  <View className="flex-row justify-center items-center">
                    <Pressable className="px-3 py-1 bg-gray-300 border border-gray-300 rounded-tl-lg rounded-bl-lg" onPress={decrement}>
                        <Text className="font-semibold">-</Text>
                    </Pressable>
                    <Text className="bg-white px-2 py-1 border border-gray-300"  >{qty}</Text>
                    <Pressable className="px-3 py-1 bg-gray-300 border border-gray-300 rounded-tr-lg rounded-br-lg" onPress={increment}>
                        <Text>+</Text>
                    </Pressable>
                  </View>
              </View>
          </View>
          
          <View className="mt-5">
            <ScrollView className="h-36 ">
              <Text className="text-gray-500 text-xs">{product?.description}</Text>
            </ScrollView>
          </View>
        </View>
      </View>
    <View className="absolute bottom-5 left-0 w-full px-4">
      <View className="flex-row justify-between items-center mt-10">
        <View >
          <Text className="text-gray-500 mb-[-4px]">Giá</Text>
          <Text className="font-bold text-lg">{product?.price}vnd</Text>
        </View>
        <Pressable onPress={addItemToCart} className="items-center bg-black px-6 py-3 rounded-3xl" >
          <Text className="text-white font-semibold">Thêm vào giỏ hàng</Text>
        </Pressable>
      </View>
      </View>
    </SafeAreaView>
  );
};


export default DetailScreen;
