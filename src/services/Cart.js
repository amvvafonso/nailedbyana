import { createContext, useContext, useEffect, useState, useCallback } from "react";
import API_URL from "../config";

const ProductsContext = createContext();

export function Cart({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Wrap fetch logic in useCallback so it can be reused
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/server/?action=getCart`, { 
        method: "POST",
        credentials: 'include'
      }).then((response) => response.json());

      if(res.success && res.result){
        setCart(res.result);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error(error);
      setCart([]);
    }
    setLoading(false);
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <ProductsContext.Provider value={{ cart, setCart, fetchCart, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useCart() {
  return useContext(ProductsContext);
}
