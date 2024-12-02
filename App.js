import { NativeWindStyleSheet } from "nativewind";
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import { Modal } from "react-native";
import TabNavigator from './src/navigation/TabNavigator';
import { AuthProvider } from './src/features/context/authContext';
import { ProductProvider } from './src/features/context/productContext';
import { CartProvider} from './src/features/context/cartContext'
import {OrderProvider} from './src/features/context/orderContext'
import FloatButton from './src/components/FloatButton';
import AIModal from "./src/components/AIModal";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [products, setProducts] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [cartItems, setCartItems] = useState(null); 
  const [orders, setOrders] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <AuthProvider
      value={{isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser}}>
      <ProductProvider
        value={{products, setProducts, currentProduct, setCurrentProduct}}>
        <CartProvider value={{cartItems, setCartItems}}>
          <OrderProvider value={{orders, setOrders}}>
            <FloatButton onPress={() => setModalVisible(true)}/>
            <NavigationContainer>
              <TabNavigator />
            </NavigationContainer>
            <Modal
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <AIModal onClose={() =>setModalVisible(false)}/>
            </Modal>
          </OrderProvider>
          </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}