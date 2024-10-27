import { Text, View, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import CartItem from "../components/CartItem"
import cartContext from "../features/context/cartContext";
import AuthContext from "../features/context/authContext";
import { getCartItems } from "../features/firebase/cart";
import TotalSummaryCart from '../components/TotalSumaryCart'

const CartScreen = ({navigation}) => {
  const [total, setTotal] = useState();
  const { currentUser, isLoggedIn } = useContext(AuthContext);
  const { cartItems, setCartItems } = useContext(cartContext);

  const calculateTotalAmount = async(data) =>{
    const subTotal = await data.reduce(
      (acc, item) => acc + (Number(item.price)*Number(item.qty)), 0);
    setTotal(subTotal);
  }
  const fetchCartItems = async () => {
    const res = await getCartItems();
    if (res.success === true) {
      setCartItems(res.data);
      setTotal(res.subTotal);
      calculateTotalAmount(res.data);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchCartItems();
  }, [currentUser, cartItems?.length]);

  return (
    <SafeAreaView className="flex-1 w-full p-5 bg-white">
      <View>
        <Text className="font-bold text-xl">Giỏ hàng</Text>
      </View>
      {isLoggedIn ? (
        <ScrollView className="mt-4 " showsVerticalScrollIndicator={false}>
          {cartItems?.map((item)=>(
            <CartItem 
              key={item.id}
              id={item.id}
              bookName={item.bookName}
              title={item.title}
              qty={item.qty}
              price={item.price}
              image={item.image}
              />
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center ">
          <Text className="font-bold text-lg">Hãy đăng nhập</Text>
        </View>
      )}
      <View>
        <TotalSummaryCart totalPrice={total} />
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
