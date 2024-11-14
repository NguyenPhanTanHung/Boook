import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import UserLogo from "../../assets/user.png"
import NewArrivalsCard from '../components/NewArrivalsCard';
import OfferCard from '../components/OfferCard'
import AuthenticationModal from '../components/AuthenticationModal';
import AuthContext from '../features/context/authContext';
import { getProducts } from '../features/firebase/product';
import productContext from '../features/context/productContext';

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const { products, setProducts } = useContext(productContext);

  const navigateToDetailScreen = (productId) => {
    navigation.navigate("detailscreen", { productId: productId });
  };

  const navigateToCategoryScreen = (category) => {
    navigation.navigate("category", { category: category });
  }
  const profile = () => {
    navigation.jumpTo("profile");
  }
   


  const categories = [
    "Công Nghệ Thông Tin",
    "Học Ngoại Ngữ",
    "Kiến Trúc - Xây Dựng",
    "Marketing - Bán hàng",
    "Thể Thao - Nghệ Thuật",
    "Triết Học",
    "Văn Học Việt Nam",
    "Thư Viện Pháp Luật",
  ];

  const CategoryList = () => {
    return (
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        horizontal={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity className="py-4 border border-gray-300 mx-5 rounded-xl max-w-xs min-w-max" onPress={() => navigateToCategoryScreen(item)}>
            <Text className="text-xs">{item}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  const fetchAllProducts = async () => {
    const result = await getProducts()
    setProducts(result)
  }

  useEffect(() => {
    navigation.setOptions({
      headerShow: false
    })
    fetchAllProducts()
  }, [])
  
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-row px-5 justify-between items-center">
        <View className="rounded-full w-40 h-40 justify-center items-center">
          <Image style={{ resizeMode: 'contain', width: '100%', height: '100%' }} source={require('../../assets/Logo.png')} />
        </View>
        {isLoggedIn ? <View>
          <Pressable className="flex-row items-center justify-center border border-slate-400 rounded-full h-23 w-30 m-3"  onPress={profile}>
            <Image source={UserLogo} className="h-4 w-4 bg-transparent m-1"></Image>
            <Text className="font-semibold py-2 pr-4 pl-2">Hello {currentUser .name}</Text>
          </Pressable>
        </View> :(<View>
          <Pressable className="flex-row items-center justify-center border border-slate-400 rounded-full h-23 w-30 m-3"
            onPress={() => setModalVisible(!modalVisible)}>
            <Image source={UserLogo} className="h-4 w-4 bg-transparent m-1"></Image>
            <Text className="font-semibold py-2 pr-4 pl-2">Đăng nhập</Text>
          </Pressable>
        </View>)}
      </View>
      <Pressable className="mt-1 px-5" onPress={() => navigation.navigate('search')}>
        <View className="flex-row bg-gray-200 p-2 px-3 items-center rounded-3x1">
          <View>
            <MaterialIcons name='search' size={24} color={'#111'} />
          </View>
          <TextInput
            placeholder='Search...'
            placeholderTextColor={'#666666'}
            className="px-2" />
        </View>
      </Pressable>
      <View className="mt-4 px-5 font-extrabold">
        {CategoryList()}
      </View>
      <View className="items-center content-center justify-center h-[41%] mt-1">
        <Text className="absolute top-0 left-4 text-base font-semibold">Best Seller: </Text>
        <OfferCard navigation={navigation} />
      </View>
      <View className="mt-1 my-2">
        <View className="flex-row justify-between items-center px-5">
          <Text className="text-lg font-extrabold">Sách phù hợp với bạn</Text>
          <Pressable onPress={() => navigation.navigate("productlistscreen")}>
            <Text className="text-xs text-gray-500">Xem tất cả</Text>
          </Pressable>
        </View>
        <ScrollView
          className="mt-2 ml-5"
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {products && products?.map(product => (
            <Pressable key={product.id} onPress={() => navigateToDetailScreen(product.id)}>
              <NewArrivalsCard
                title={product.title}
                image={product.image}
                description={product.description}
                price={product.price}
                bookName={product.bookName} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View className="mt-1 my-2">
        <View className="flex-row justify-between items-center px-5">
          <Text className="text-lg font-extrabold">Sách phù hợp với bạn</Text>
          <Pressable onPress={() => navigation.navigate("productlistscreen")}>
            <Text className="text-xs text-gray-500">Xem tất cả</Text>
          </Pressable>
        </View>
        <ScrollView
          className="mt-2 ml-5"
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {products && products?.map(product => (
            <Pressable key={product.id} onPress={() => navigateToDetailScreen(product.id)}>
              <NewArrivalsCard
                title={product.title}
                image={product.image}
                description={product.description}
                price={product.price}
                bookName={product.bookName} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View className="mt-1 my-2">
        <View className="flex-row justify-between items-center px-5">
          <Text className="text-lg font-extrabold">Giá rẻ</Text>
          <Pressable onPress={() => navigation.navigate("productlistscreen")}>
            <Text className="text-xs text-gray-500">Xem tất cả</Text>
          </Pressable>
        </View>
        <ScrollView
          className="mt-2 ml-5"
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {products && products
            .filter(product => product.price < 150000) // Lọc sản phẩm có giá dưới 150000
            .map(product => (
              <Pressable key={product.id} onPress={() => navigateToDetailScreen(product.id)}>
                <NewArrivalsCard
                  title={product.title}
                  image={product.image}
                  description={product.description}
                  price={product.price}
                  bookName={product.bookName} />
              </Pressable>
            ))}
        </ScrollView>
      </View>
      <AuthenticationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onclose={() => setModalVisible(false)} />
      
    </ScrollView>
  );
};

export default HomeScreen;
