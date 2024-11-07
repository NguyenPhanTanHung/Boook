import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainStackNavigator, CartStackNavigator, OrderStackNavigator, ProfileStackNavigator } from "./StackNavigator";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import cartContext from "../features/context/cartContext";
import { View, Text, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { cartItems } = React.useContext(cartContext);

  return (
    <Tab.Navigator
      initialRouteName="Home"
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
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={MainStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="cart"
        component={CartStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <View style={{ position: 'relative' }}>
              <MaterialIcons name="shopping-cart" size={size} color={color} />
              {cartItems && cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="order"
        component={OrderStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="list-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TabNavigator;
