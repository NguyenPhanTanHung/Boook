import { Text, View, ScrollView } from "react-native";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import OrderItem from "../components/OrderItem"
import AuthContext from "../features/context/authContext";
import orderContext from "../features/context/orderContext";
import { getAllOrderItems } from "../features/firebase/order";
// import { auth } from "../../firebase";

const OrderScreen = ({navigation}) => {
  const { orders, setOrders } = useContext(orderContext);
  const {isLoggedIn} = useContext(AuthContext)
  const fetchAllOrders = async () => {
    const res = await getAllOrderItems();
    if (res.success === true) {
      setOrders(res.data);
      console.log("res.data",res.data)
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchAllOrders();
  }, []);
  return (
    <SafeAreaView>
      <View>
        <Text className="font-bold text-xl">Đơn hàng</Text>
      </View>
      {isLoggedIn ?
        <ScrollView className="mt-4 pt-4 " showsVerticalScrollIndicator={false}>
          {orders?.map((order) => (
            <OrderItem key={order.id} bookName={order.bookName} qty={order.qty}
            title={order.title} date={order.date} orderId={order.orderId} 
            image={order.image} price={order.price}  />
            ))}
        </ScrollView>
      :
        <View className="flex-1 items-center justify-center ">
          <Text className="font-bold text-lg">Hãy đăng nhập!</Text>
        </View>
      }
    </SafeAreaView>
  );
};

export default OrderScreen;
