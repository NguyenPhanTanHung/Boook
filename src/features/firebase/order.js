import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { db, auth } from "../../../firebase";
export const addToOrders = async (name, phone, address, deliveryTime) => {
    // Kiểm tra các giá trị đầu vào
    if (!name || !phone || !address || !deliveryTime) {
        console.error("Thông tin đặt hàng thiếu hoặc không hợp lệ.");
        return { success: false, message: "Thông tin đặt hàng không đầy đủ." };
    }

    console.log(name, phone, address, deliveryTime);
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const cartItems = userData.cart || [];
        const orderItems = userData.orders || []; // Lấy danh sách đơn hàng hiện có hoặc mảng rỗng

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

        // Cập nhật dữ liệu
        try {
            await updateDoc(userDocRef, { orders: orderItems, cart: [] });
            console.log("Order Added");
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
export const getAllOrderItems = async ()=>{
    const userRef=doc(db,"users",auth.currentUser.uid)
    const userDocSnapshot = await getDoc(userRef)
    const data = userDocSnapshot.data().orders;
    return {success:true,data}
}