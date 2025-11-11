import ProductPageTemplate from "../templates/ProductPageTemplate"
import FullscreenLoading from "../components/Loading";
import { useProducts } from "../services/ProductProvider";

export default function Collection() {
  const { products, collection, types, loading } = useProducts();

  const active = products.filter((p) => p.collection_name === collection);
      
  if (loading) return <FullscreenLoading />;


  return (
    <ProductPageTemplate
      title={collection}
      products={active}
      types={types}
      loading={loading}
      filters={true}
    />
  );
}
