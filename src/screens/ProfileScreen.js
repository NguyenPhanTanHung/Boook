import { Text, View, Pressable, Modal, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AuthContext from '../features/context/authContext';
import { logout } from '../features/firebase/userAuth';

const ProfileScreen = ({ navigation }) => {
  const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [modalNotificationVisible, setModalNotificationVisible] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success === true) {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full p-6 justify-between">
      <View className="mt-6">
        {isLoggedIn ? (
          <View className="items-center justify-center">
            <Text className="text-lg font-bold">{currentUser?.name}</Text>
            <Text className="text-xs font-bold text-gray-500">{currentUser?.email}</Text>
          </View>
        ) : (
          <View className="items-center justify-center">
            <Text className="text-lg font-bold">Hãy Đăng Nhập!</Text>
          </View>
        )}
      </View>

      {isLoggedIn && (
        <View className="mt-10">
          <View className="mb-4">
            <Pressable onPress={() => navigation.jumpTo('order')} className="bg-gray-200 py-4 rounded-lg mb-2">
              <Text className="font-bold text-black text-center">Lịch Sử Giao Dịch</Text>
            </Pressable>

            <Pressable onPress={() => setModalNotificationVisible(true)} className="bg-gray-200 py-4 rounded-lg mb-2">
              <Text className="font-bold text-black text-center">Thông Báo</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Settings')} className="bg-gray-200 py-4 rounded-lg">
              <Text className="font-bold text-black text-center">Cài Đặt</Text>
            </Pressable>
          </View>

          <View className="justify-center items-center">
            <Pressable onPress={handleLogout} className="bg-black w-full py-4 rounded-lg">
              <Text className="font-bold text-white text-center">Log Out</Text>
            </Pressable>
          </View>
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalNotificationVisible}
        onRequestClose={() => setModalNotificationVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-gray-200 bg-opacity-80">
          <View className="bg-white w-3/4 p-6 rounded-lg shadow-lg">
            <Text className="text-lg font-bold mb-4">Thông báo</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-center text-gray-600">Bạn chưa có thông báo nào</Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalNotificationVisible(false)}
              className="absolute top-1 right-1 p-2"
            >
              <MaterialIcons name="close" size={25} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
