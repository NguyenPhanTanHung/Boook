import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { db, auth } from "../../../firebase";
import { Linking } from "react-native";

export const addToOrders = async (name, phone, address, deliveryTime, paymentMethod) => {
    // Kiểm tra các giá trị đầu vào
    if (!name || !phone || !address || !deliveryTime) {
        console.error("Thông tin đặt hàng thiếu hoặc không hợp lệ.");
        return { success: false, message: "Thông tin đặt hàng không đầy đủ." };
    }

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const cartItems = userData.cart || [];
        const orderItems = userData.orders || [];

        cartItems.forEach(item => {
            orderItems.push({
                orderId: uuidv4().replace(/-/g, '').substring(0, 12),
                id: item.id,
                image: item.image,
                title: item.title,
                bookName: item.bookName,
                price: item.price,
                qty: item.qty,
                name: name,
                phone: phone,
                address: address,
                deliveryTime: deliveryTime,
                date: new Date().toLocaleString()
            });
        });

        const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);

        // Cập nhật dữ liệu
        try {
            if (paymentMethod === 'cash') {
                await updateDoc(userDocRef, { orders: orderItems, cart: [] });
            }
            else {
                const response = await fetch('https://createpayment-pvkrujnynq-uc.a.run.app', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount: totalPrice, userid: auth.currentUser.uid })
                });

                const responseData = await response.json();
                console.log(responseData);

                if (response.ok && responseData?.order_url) {
                    Linking.openURL(responseData.order_url);
                    await updateDoc(userDocRef, { orders: orderItems, cart: [] });
                }
            }

            return { success: true, data: orderItems };
        } catch (error) {
            console.error("Lỗi cập nhật tài liệu:", error);
            return { success: false, message: "Lỗi cập nhật tài liệu." };
        }
    } else {
        console.error("Không tìm thấy tài liệu người dùng.");
        return { success: false, message: "Người dùng không tồn tại." };
    }
};
export const getAllOrderItems = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid)
    const userDocSnapshot = await getDoc(userRef)
    const data = userDocSnapshot.data().orders;
    return { success: true, data }
}