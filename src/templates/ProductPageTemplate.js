import FullscreenLoading from "../components/Loading";
import ProductTemplate from "../components/ProductTemplate";
import { useState, useEffect } from "react";

export default function ProductPageTemplate({ title, products, types, loading, filters }) {

  const [filtered, setFiltered] = useState([]);

  const [filterLoading, setFilterLoading] = useState(false)

  useEffect(() => {
    setFiltered(products);
    types.sort((a, b) => a.type.localeCompare(b.type))
    console.log(types)
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

     {filters ? <> <div className="filter-button-div">
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
      className="content-div-product"
      >
        {filtered.map((item) => (
          <ProductTemplate product={item} />
        ))}
      </div>
    </>
  );
}
