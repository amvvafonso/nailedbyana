import ProductPageTemplate from "../templates/ProductPageTemplate"
import FullscreenLoading from "../components/Loading";
import { useProducts } from "../services/ProductProvider";
import { useLocation } from "react-router-dom";

export default function Collection() {
  const { products, collection, types, loading } = useProducts();
  const location = useLocation();

  const active = products.filter((p) => p.collection_name === collection);
      
  if (loading) return <FullscreenLoading />;


  return (
    <ProductPageTemplate
      key={location.pathname}
      title={collection}
      products={active}
      types={types}
      loading={loading}
      filters={true}
    />
  );
}
