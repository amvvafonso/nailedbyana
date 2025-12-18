import FullscreenLoading from "../components/Loading";
import ProductPageTemplate from "../templates/ProductPageTemplate";
import { useProducts } from "../services/ProductProvider";
import { useEffect } from "react";

export default function Necklace(){

    const { products, types, loading } = useProducts();
    
    const necklace = products.filter((p) => p.type == 2);
    
    useEffect((e) => {

    }, [necklace])
    if (loading) return <FullscreenLoading />;

  

  return (
    <ProductPageTemplate
      title={"Colares"}
      products={necklace}
      types={types}
      loading={loading}
    />
  );
}
