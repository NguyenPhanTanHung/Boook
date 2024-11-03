import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { getProductsWithCondition } from '../features/firebase/product';
import ProductItem from './ProductItem';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const CategoryScreen = ({ navigation, route }) => {
    const categoryName = route.params.category;
    const [ products, setProducts] = useState(null);

    const fetchAllProducts = async () => {
        const result = await getProductsWithCondition(categoryName);
        setProducts( result )
    }

    const goBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Products",
            headerStyle: { backgroundColor: "white" },
            headerTitleAlign: "center",
            headerLeft: () => (
                <Pressable
                    onPress={goBack}
                    className=" justify-center items-center h-10 w-10 mx-4 rounded-full "
                >
                    <MaterialIcons name="chevron-left" size={34} color={"#111"} />
                </Pressable>
            ),
        }),
            fetchAllProducts();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách theo thể loại: {categoryName}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {products?.map((product) => (
                    <TouchableOpacity key={product.id} onPress={() => navigation.navigate("detailscreen", {
                        productId: product?.id
                    })}>
                        <ProductItem
                            image={product?.image}
                            bookName={product?.bookName}
                            price={product?.price}
                            title={product?.title}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default CategoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 20,
        color: '#000'

    }
});