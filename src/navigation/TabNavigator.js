import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainStackNavigator, CartStackNavigator, OrderStackNavigator, ProfileStackNavigator } from "./StackNavigator";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import cartContext from "../features/context/cartContext";
import { Text } from "react-native";

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const { cartItems } = React.useContext(cartContext);

  console.log(cartItems);

  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          overflow: "hidden",
          backgroundColor: "#fff",
          height: 60
        }
      }}>
      <Tab.Screen name='home' component={MainStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name='cart' component={CartStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <>
              <MaterialIcons name="shopping-cart" size={size} color={color} />
              {
                cartItems && 
                <Text 
                  style={{ padding: 3, backgroundColor:'red', color:'#fff' , alignItems:'center', justifyContent:'center', position: 'absolute', top:-50,
                    right: 0, borderRadius: 10, width: 20, height: 20, width:40, height: 40
                  }}>
                    {cartItems.length}
                </Text>
              }
            </>
          ),
        }} />
      <Tab.Screen name='order' component={OrderStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="list-alt" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name='profile' component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="account-circle" size={size} color={color} />
          ),
        }} />
    </Tab.Navigator>
  )
}

export default TabNavigator
