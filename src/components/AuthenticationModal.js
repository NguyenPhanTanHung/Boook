import React, { useContext, useEffect, useState } from "react";
import { Picker } from '@react-native-picker/picker'; // Nhập Picker từ thư viện mới
import { Modal, Pressable, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, } from "react-native";
import { registerWithEmailAndPassword, loginWithEmailAndPassword } from "../features/firebase/userAuth";
import AuthContext from "../features/context/authContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AuthenticationModal = ({ modalVisible, setModalVisible, onclose }) => {
    const [type, setType] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState(18); // Khởi tạo độ tuổi mặc định
    const [loading, setLoading] = useState(false);

    const { currentUser, setCurrentUser, setIsLoggedIn } = useContext(AuthContext);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await loginWithEmailAndPassword(email, password);
            if (res.success === true) {
                setCurrentUser(res.user);
                setIsLoggedIn(true);
                setModalVisible(false);
            } else {
                Alert.alert('Lỗi', 'Sai Tài Khoảng hoặc Mật khẩu Hãy kiểm tra lại :((', [
                    {
                        text: 'OK',
                        style: 'cancel',
                    },
                ]);
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Sai Tài Khoảng hoặc Mật khẩu Hãy kiểm tra lại :((', [
                {
                    text: 'OK',
                    style: 'cancel',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const res = await registerWithEmailAndPassword(name, email, password);
            if (res.success === true) {
                setType("login");
            }
        } catch (error) {
            console.error("Heloo", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            setIsLoggedIn(true);
        }
    }, [currentUser]);

    const close = () => {
        setModalVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            {
                type === "login" ? (
                    <Pressable className="flex-1 justify-center items-center bg-black/[0.5]">
                        <View className="w-[80%] bg-white p-6 rounded-lg">
                            {/* Sử dụng TouchableOpacity để bọc MaterialIcons */}
                            <TouchableOpacity
                                style={{ position: "absolute", top: 15, right: 15, borderWidth: 0 }}
                                onPress={close}
                            >
                                <MaterialIcons name="close" size={30} />
                            </TouchableOpacity>

                            <Text className="font-bold mb-2">Email</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <Text className="font-bold mt-4 mb-2">Password:</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                            />
                            <TouchableOpacity className="bg-black py-4 mt-6 rounded-lg" onPress={handleLogin}>
                                {
                                    loading ? <ActivityIndicator size={'large'} /> : <Text className="text-white font-semibold text-center">Đăng nhập</Text>
                                }
                            </TouchableOpacity>

                            <View className="flex-row justify-center items-center mt-4">
                                <Text className="text-slate-500">Chưa có tài khoản?</Text>
                                <Pressable onPress={() => setType("register")}>
                                    <Text className="font-bold">Đăng ký</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                ) : (
                    <Pressable className="flex-1 justify-center items-center bg-black/[0.5]">
                        <View className="w-[80%] p-6 bg-white rounded-lg">
                            {/* Sử dụng TouchableOpacity để bọc MaterialIcons */}
                            <TouchableOpacity
                                style={{ position: "absolute", top: 15, right: 15, borderWidth: 0 }}
                                onPress={close}
                            >
                                <MaterialIcons name="close" size={30} />
                            </TouchableOpacity>

                            <Text className="font-bold mb-2">Name:</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={name}
                                onChangeText={setName}
                            />
                            <Text className="font-bold mb-2">Email:</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <Text className="font-bold mb-2">Password:</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                            />
                            <Text className="font-bold mb-2">Tuổi: {age}</Text> {/* Hiển thị độ tuổi */}
                            <Picker
                                selectedValue={age}
                                onValueChange={(itemValue) => setAge(itemValue)}
                                style={{ height: 60, width: '100%', marginTop: 5 }}
                            >
                                {[...Array(100).keys()].map((value) => (
                                    <Picker.Item key={value + 1} label={`${value + 1}`} value={`${value + 1}`} />
                                ))}
                            </Picker>

                            <TouchableOpacity
                                className="bg-black py-4 mt-6 rounded-lg"
                                onPress={handleRegister}
                            >
                                {
                                    loading ? <ActivityIndicator size={'large'} /> : <Text className="text-white font-semibold text-center">Đăng ký</Text>
                                }
                            </TouchableOpacity>

                            <View className="flex-row justify-center items-center mt-4">
                                <Text className="text-slate-500">Đã có tài khoản?</Text>
                                <Pressable onPress={() => setType("login")}>
                                    <Text className="font-bold">Đăng nhập</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                )
            }
        </Modal>
    );
};

export default AuthenticationModal;
