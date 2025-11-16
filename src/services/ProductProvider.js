import { createContext, useContext, useEffect, useState } from "react";
import API_URL from "../config";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [collection, setCollection] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
      const res = await fetch(`${API_URL}/server/?action=getProducts`, { 
        method: "POST" }).then((Response ) => Response.json());
  

      setProducts(res.data);
      setCollection(res.activeCollection || null );

      const typesRes = await fetch(`${API_URL}/server/?action=getTypes`, { method: "POST" });
      const typesData = await typesRes.json();
      setTypes(typesData.data);
      setLoading(false);
      }
      catch(es){
        console.log(es)
      }
    }
    fetchData();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, collection, setCollection ,types, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
