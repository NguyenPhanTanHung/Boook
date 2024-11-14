import { Text, View, Pressable, Image, Alert } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthContext from '../features/context/authContext';
import { logout } from '../features/firebase/userAuth';

const ProfileScreen = ({ navigation }) => {
  const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success === true) {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  // Function to handle notification press
  const handleNotificationPress = () => {
    Alert.alert("Thông Báo", "Bạn chưa có thông báo mới");
  };

  return (
    <SafeAreaView className="bg-white h-full p-6 justify-between">
      <View className="mt-1">
        {isLoggedIn ? (
          <View className="items-center justify-center">
            <Image style={{ resizeMode: 'contain', width: 200, height: 100 }} source={require('../../assets/Logo.png')} />
            <Image style={{ resizeMode: 'contain', width: 200, height: 100 }} source={require('../../assets/profile-icon-design-free-vector.jpg')} />
            <Text className="text-lg font-bold">{currentUser?.name}</Text>
            <Text className="text-xs font-bold text-gray-500">{currentUser?.email}</Text>
          </View>
        ) : (
          <View className="items-center justify-center">
            <Image style={{ resizeMode: 'contain', width: 200, height: 100 }} source={require('../../assets/Logo.png')} />
            <Text className="text-lg font-bold">Hãy Đăng Nhập!</Text>
          </View>
        )}
      </View>

      {isLoggedIn && (
        <View className="mt-10">
          <View className="mb-4">
            <Pressable onPress={() => navigation.navigate('order')} className="bg-gray-200 py-4 rounded-lg mb-2">
              <Text className="font-bold text-black text-center">Đơn Hàng Sách</Text>
            </Pressable>

            {/* Updated notification button to show an alert */}
            <Pressable onPress={handleNotificationPress} className="bg-gray-200 py-4 rounded-lg mb-2">
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
    </SafeAreaView>
  );
};

export default ProfileScreen;
