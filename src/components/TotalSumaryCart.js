import {Text, View,Pressable } from "react-native";
import React, { useContext } from "react";

import cartContext from "../features/context/cartContext";
import orderContext from "../features/context/orderContext";
import { addToOrders } from "../features/firebase/order";

const TotalSummaryCart = ({ totalPrice }) => {
    const { setCartItems } = useContext(cartContext);
    const { setOrdersItems } = useContext(orderContext);

    // State để quản lý hiển thị modal và thông tin người đặt
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

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
                <Text className="font-extrabold text-xl">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                </Text>
            </View>
            <Pressable onPress={() => setModalVisible(true)} className="bg-black py-4 rounded-lg mt-6">
                <Text className="font-semibold text-white text-center">Thanh Toán</Text>
            </Pressable>

            {/* Modal để nhập thông tin người đặt */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-gray-800 bg-opacity-50">
                    <View className="bg-white rounded-lg p-6 w-80">
                        <Text className="font-bold text-lg mb-4">Nhập thông tin đặt hàng</Text>
                        <TextInput
                            placeholder="Tên người đặt"
                            value={name}
                            onChangeText={setName}
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <TextInput
                            placeholder="Số điện thoại"
                            value={phone}
                            onChangeText={setPhone}
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <TextInput
                            placeholder="Địa chỉ"
                            value={address}
                            onChangeText={setAddress}
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <TextInput
                            placeholder="Thời gian nhận hàng mong muốn"
                            value={deliveryTime}
                            onChangeText={setDeliveryTime}
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <Pressable onPress={placeOrder} className="bg-black py-2 rounded-lg">
                            <Text className="font-semibold text-white text-center">Đặt hàng</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalVisible(false)} className="mt-2">
                            <Text className="text-blue-500 text-center">Hủy</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TotalSummaryCart;