import FullscreenLoading from "../components/Loading";
import ProductPageTemplate from "../templates/ProductPageTemplate";
import { useProducts } from "../services/ProductProvider";
import { useEffect } from "react";

export default function Set(){

    const { products, types, loading } = useProducts();
    
    const set = products.filter((p) => p.type === 'Conjunto');
    
    useEffect((e) => {

    }, [set])

    if (loading) return <FullscreenLoading />;

  

  return (
    <ProductPageTemplate
      title={"Conjuntos"}
      products={set}
      types={types}
      loading={loading}
    />
  );
}
