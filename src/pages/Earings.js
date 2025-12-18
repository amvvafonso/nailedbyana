import FullscreenLoading from "../components/Loading";
import ProductPageTemplate from "../templates/ProductPageTemplate";
import { useProducts } from "../services/ProductProvider";
import { useEffect } from "react";

export default function Earings(){

    const { products, types, loading } = useProducts();
    
    const earings = products.filter((p) => p.type == 2);
    
    useEffect((e) => {

    }, [earings])

    if (loading) return <FullscreenLoading />;

  

  return (
    <ProductPageTemplate
      title={"Brincos"}
      products={earings}
      types={types}
      loading={loading}
    />
  );
}
