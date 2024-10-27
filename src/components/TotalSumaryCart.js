import {Text, View,Pressable } from "react-native";
import React, { useContext } from "react";

import cartContext from "../features/context/cartContext";
import orderContext from "../features/context/orderContext"
import { addToOrders } from "../features/firebase/order";
const TotalSummaryCart = ({totalPrice}) => {
    const {setCartItems} = useContext(cartContext)
    const {setOrdersItems} = useContext(orderContext)

    const placeOrder = async () => {
      const res = await addToOrders();
      if(res.success===true){
       show("Order Successfully!!!".BOTTOM)
        setCartItems([])
        setOrdersItems(res.data)
      }
    }
    return (
        <View className="border border-gray-200 rounded-lg p-6">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-lg">Tổng :</Text>
            <Text className="font-extrabold text-xl">{totalPrice}.000 vnd</Text>
          </View>
          <Pressable onPress={placeOrder} className="bg-black py-4 rounded-lg mt-6">
            <Text className="font-semibold text-white text-center">Thanh Toán</Text>
          </Pressable>
        </View>
      );
    
}

export default TotalSummaryCart