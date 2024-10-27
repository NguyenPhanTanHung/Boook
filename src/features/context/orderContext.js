import { createContext } from "react";

const orderContext = createContext()

export const OrderProvider = orderContext.Provider
export default orderContext