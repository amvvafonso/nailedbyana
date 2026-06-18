import FullscreenLoading from "../components/Loading";
import ProductPageTemplate from "../templates/ProductPageTemplate";
import { useProducts } from "../services/ProductProvider";
import { useEffect } from "react";

export default function Cuffs(){

    const { products, types, loading } = useProducts();
    
    const cuffs = products.filter((p) => p.type == 7);

    if (loading) return <FullscreenLoading />;

  

  return (
    <ProductPageTemplate
      title={"Cuff's"}
      products={cuffs}
      types={types}
      loading={loading}
    />
  );
}
