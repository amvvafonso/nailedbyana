import { useEffect, useState } from "react";
import API_URL from "../config"; // e.g. "http://localhost/myapp"

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/server/?action=getProducts`, {
          method: "POST",
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        if (data.status) {
          setProducts(data.data);






          const typesRes = await fetch(`${API_URL}/server/?action=getTypes`, {
            method: "POST",
          }).then((Response) => Response.json());

          if (typesRes.status) {
            setTypes(typesRes.data);
          }
        } else {
          console.log("Error -> ", data.error);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
      } finally {
        setLoading(false);

      }
    }

    fetchProducts();
  }, []);

  return { products, types, loading, error };
}
