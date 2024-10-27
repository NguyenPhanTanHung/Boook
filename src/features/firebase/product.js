import {collection, doc, getDoc, getDocs} from "firebase/firestore"
import {db} from "../../../firebase"

export const getProducts = async() => {
    try {
        const productsRef = collection(db,"products")
        const productsSnapshot = await getDocs(productsRef)
        const products = productsSnapshot.docs.map(document => ({ id: document.id, ...document.data() }));
        return products
    } catch (error) {
        console.log("products error", error)
    }
}

export const getProductById = async (productId)=>{
    try {
        console.log("prod",productId)
        const productRef = doc(db,"products",productId)
        const productSnapshot = await getDoc(productRef)
        const product = {id: productSnapshot.id,...productSnapshot.data()}
        return product;
    } catch (error) {
        console.error(error)
    }
}