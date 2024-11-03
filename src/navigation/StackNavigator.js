import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from '../screens/HomeScreen'
import DetailScreen from '../screens/DetailScreen'
import ProductListScreen from '../screens/ProductListScreen'
import CartScreen from '../screens/CartScreen'
import OrderScreen from '../screens/OrderScreen'
import ProfileScreen from '../screens/ProfileScreen'
import React from "react";
import CategoryScreen from '../components/CategoryScreen';

const Stack = createStackNavigator()

const MainStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='homescreen'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#91c4f8"
                },
                headerShown: false
            }}>
            <Stack.Screen name="homescreen" component={HomeScreen} />
            <Stack.Screen name="detailscreen" component={DetailScreen} />
            <Stack.Screen name="productlistscreen" component={ProductListScreen} />
            <Stack.Screen name="category" component={CategoryScreen} />
        </Stack.Navigator>
    )
}

const CartStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='cart-screen'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#91c4f8"
                },
                headerShown: false
            }}>
            <Stack.Screen name="cartscreen" component={CartScreen} />
        </Stack.Navigator>
    )
}

const OrderStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='order-screen'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#91c4f8"
                },
                headerShown: false
            }}>
            <Stack.Screen name="orderscreen" component={OrderScreen} />
        </Stack.Navigator>
    )
}

const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='profile-screen'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#91c4f8"
                },
                headerShown: false
            }}>
            <Stack.Screen name="profilescreen" component={ProfileScreen} />
        </Stack.Navigator>
    )
}

export { MainStackNavigator, CartStackNavigator, ProfileStackNavigator, OrderStackNavigator }