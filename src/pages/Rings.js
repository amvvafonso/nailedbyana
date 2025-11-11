import FullscreenLoading from "../components/Loading";
import ProductPageTemplate from "../templates/ProductPageTemplate";
import { useProducts } from "../services/ProductProvider";

export default function Rings(){

    const { products, loading } = useProducts();
    const rings = products.filter((p) => p.type === 'Anel');
    
    if (loading) return <FullscreenLoading />;


  return (
    <ProductPageTemplate
      title={"Aneis"}
      products={rings}
      types={[]}
      loading={loading}
    />
  );
}
