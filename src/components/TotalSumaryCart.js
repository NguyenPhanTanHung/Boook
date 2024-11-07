import { Text, View, Pressable, Modal, TextInput, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from '@react-navigation/native';

import cartContext from "../features/context/cartContext";
import orderContext from "../features/context/orderContext";
import { addToOrders } from "../features/firebase/order";

const TotalSummaryCart = ({ totalPrice }) => {
    const navigation = useNavigation();
    const { setCartItems } = useContext(cartContext);
    const { setOrdersItems } = useContext(orderContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

    const placeOrder = async () => {
        const res = await addToOrders( name, phone, address, deliveryTime );
        setModalVisible(false);
        setCartItems([]);
        if (res.success === true) {
            Alert.alert("Thông báo", "Đặt hàng thành công!", [
                {
                    text: "OK",
                    onPress: () => {
                        setCartItems([]); // Xóa giỏ hàng sau khi đặt hàng thành công
                        setOrdersItems(res.data);
                        setModalVisible(false); // Đóng modal sau khi đặt hàng
                    }
                }
            ]);
        } else {
            Alert.alert("Thông báo", "Đặt hàng không thành công. Vui lòng thử lại.");
        }
    };

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
               <View className="flex-1 justify-center items-center bg-black/[0.5]">
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
