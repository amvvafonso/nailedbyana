import FullscreenLoading from "../components/Loading";
import ProductPageTemplate from "../templates/ProductPageTemplate";
import { useProducts } from "../services/ProductProvider";
import { useEffect } from "react";

export default function Bracelet(){

    const { products, types, loading } = useProducts();
    
    const bracelets = products.filter((e) => e.type === 'Pulseira');
    
    useEffect((e) => {
      console.log(bracelets)
    }, [bracelets])
    if (loading) return <FullscreenLoading />;

  

  return (
    <ProductPageTemplate
      title={"Pulseiras"}
      products={bracelets}
      types={types}
      loading={loading}
      filters={false}
    />
  );
}
