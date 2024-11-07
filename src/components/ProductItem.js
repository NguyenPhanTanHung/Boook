import { Text, View, Image } from "react-native";
import React from "react";

const ProductItem = ({ title, bookName, image, price }) => {
  return (
    <View className="bg-white p-2 justify-center items-center rounded-lg w-full mb-4 border border-slate-200" >
      <View className="flex-row justify-center items-center">
        <View className=" items-center justify-center">
          <Image source={{ uri: image }} className="rounded-xl h-20 w-20 object-contain" />
        </View>
        <View className="flex-1 w-[100%] p-2">
          <View>
            <Text className="font-bold">{bookName}</Text>
            <Text className="text-xs">{title}</Text>
          </View>
          <View className="mt-2">
            <Text className="text-xs">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default ProductItem