import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

// Hàm lấy các item từ giỏ hàng
export const getCartItems = async () => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const data = userDocSnapshot.data().cart;
    return { data, success: true };
}

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (itemId, qty) => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const productRef = doc(db, "products", itemId);

    try {
        // Lấy dữ liệu giỏ hàng hiện tại
        const userDocSnapshot = await getDoc(userDocRef);
        const cartItems = userDocSnapshot.exists() ? userDocSnapshot.data().cart || [] : [];

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const itemExists = cartItems.find(item => item.id === itemId);
        if (itemExists) {
            // Nếu sản phẩm đã tồn tại, chỉ cập nhật số lượng
            itemExists.qty += qty;
        } else {
            // Nếu chưa tồn tại, lấy dữ liệu sản phẩm từ Firestore
            const productSnapshot = await getDoc(productRef);
            if (productSnapshot.exists()) {
                const productData = productSnapshot.data();
                cartItems.push({
                    id: itemId,
                    bookName: productData.bookName,
                    title: productData.title,
                    price: productData.price,
                    image: productData.image,
                    qty
                });
            }
        }

        // Cập nhật giỏ hàng lên Firestore
        await updateDoc(userDocRef, { cart: cartItems });
        console.log("Cart updated successfully in Firestore");

        return { success: true, data: cartItems };
    } catch (error) {
        console.error("Failed to add item to cart:", error);
        return { success: false, error: error.message };
    }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeItemById = async (id) => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    try {
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const newCart = userData.cart.filter(item => item.id !== id);

            // Cập nhật giỏ hàng sau khi xóa item
            await updateDoc(userDocRef, { cart: newCart });
            console.log("Item removed from cart successfully");

            // Tính toán tổng phụ (subtotal)
            const subTotal = newCart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

            return { data: newCart, success: true, subTotal };
        }
    } catch (error) {
        console.error("Failed to remove item from cart:", error);
        return { success: false, error: error.message };
    }
}

export const increaseQuantity = async (itemId) => {
    const userDocRef = doc(db, "users", auth.currentUser .uid);

    try {
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
            const cartItems = userDocSnapshot.data().cart || [];

            // Tìm sản phẩm trong giỏ hàng
            const item = cartItems.find(item => item.id === itemId);
            if (item) {
                // Tăng số lượng sản phẩm
                item.qty += 1;

                // Cập nhật giỏ hàng lên Firestore
                await updateDoc(userDocRef, { cart: cartItems });
                console.log("Quantity increased successfully in Firestore");

                return { success: true, data: cartItems };
            } else {
                return { success: false, error: "Item not found in cart" };
            }
        }
    } catch (error) {
        console.error("Failed to increase quantity:", error);
        return { success: false, error: error.message };
    }
}

// Hàm giảm số lượng sản phẩm trong giỏ hàng
export const decreaseQuantity = async (itemId) => {
    const userDocRef = doc(db, "users", auth.currentUser .uid);

    try {
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
            const cartItems = userDocSnapshot.data().cart || [];

            // Tìm sản phẩm trong giỏ hàng
            const item = cartItems.find(item => item.id === itemId);
            if (item) {
                // Giảm số lượng sản phẩm
                if (item.qty > 1) {
                    item.qty -= 1; // Giảm nếu số lượng lớn hơn 1
                } else {
                    return { success: false, error: "Cannot decrease quantity below 1" };
                }

                // Cập nhật giỏ hàng lên Firestore
                await updateDoc(userDocRef, { cart: cartItems });
                console.log("Quantity decreased successfully in Firestore");

                return { success: true, data: cartItems };
            } else {
                return { success: false, error: "Item not found in cart" };
            }
        }
    } catch (error) {
        console.error("Failed to decrease quantity:", error);
        return { success: false, error: error.message };
    }
}