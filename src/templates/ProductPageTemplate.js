import FullscreenLoading from "../components/Loading";
import ProductTemplate from "../components/ProductTemplate";
import { useState, useEffect } from "react";

export default function ProductPageTemplate({ title, products, types, loading, filters }) {

  const [filtered, setFiltered] = useState([]);

  const [filterLoading, setFilterLoading] = useState(false)

  useEffect(() => {
    setFiltered(products);
  }, [products]);

  const filter = (typeId) => {
    try {
      setFilterLoading(true);

      const filteredProducts =
        typeId === 0
          ? products
          : products.filter((p) => p.type === typeId);

      setFiltered(filteredProducts);
      setFilterLoading(false);
    }
    catch(es){
      console.log(es)
    }

  };

  if(loading) return <FullscreenLoading/>
  if(filterLoading) return <FullscreenLoading/>

  return (
    <>
      <h1 style={{ fontSize: "50px", textAlign: "center", fontWeight: "lighter", marginBottom : '50px' }}>
        {title}
      </h1>

     {filters ? <> <div style={{ textAlign: "center" }}>
        <button  className="filter-button" onClick={() => filter(0)}>
          Todos
        </button>
        {types.map((t) => (
          <button
            key={t.type_id}
            className="filter-button"
            onClick={() => {
              filter(t.type)

             }}
          >
            {t.type}
          </button>
          
        ))}
        
      </div></> : '' }

         
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          justifyItems: "center",
        }}
      >
        {filtered.map((item) => (
          <ProductTemplate product={item} />
        ))}
      </div>
    </>
  );
}
