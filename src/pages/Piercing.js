import FullscreenLoading from "../components/Loading";
import ProductPageTemplate from "../templates/ProductPageTemplate";
import { useProducts } from "../services/ProductProvider";
import { useEffect } from "react";

export default function Piercings(){

    const { products, types, loading } = useProducts();
    
    const piercings = products.filter((p) => p.type == 6);
    

    if (loading) return <FullscreenLoading />;

  

  return (
    <ProductPageTemplate
      title={"Piercings"}
      products={piercings}
      types={types}
      loading={loading}
    />
  );
}
