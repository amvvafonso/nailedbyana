import FullscreenLoading from "../components/Loading";
import ProductPageTemplate from "../templates/ProductPageTemplate";
import { useProducts } from "../services/ProductProvider";
import { useEffect } from "react";

 
export default function Alianca(){

    const { products, types, loading } = useProducts();
    
    const alianca = products.filter((p) => p.type == 8);

    useEffect((e) => {
      
    }, [alianca])

    if (loading) return <FullscreenLoading />;
    
    
  return (
    <ProductPageTemplate
      title={"Alianças"}
      products={alianca}
      types={types}
      loading={loading}
    />
  );
}
