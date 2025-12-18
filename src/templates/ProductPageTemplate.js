import FullscreenLoading from "../components/Loading";
import ProductTemplate from "../components/ProductTemplate";
import { useState, useEffect } from "react";

export default function ProductPageTemplate({ title, products, types, loading, filters }) {

  const [filtered, setFiltered] = useState([]);
  const [grid, setGrid] = useState()
  const [filterLoading, setFilterLoading] = useState(false)

  useEffect(() => {
    setFiltered(products);
    types.sort((a, b) => a.type.localeCompare(b.type))
  }, [products]);

  const filter = (typeId) => {
    try {
      setFilterLoading(true);

      const filteredProducts =
        typeId === 0
          ? products
          : products.filter((p) => p.type === typeId);



      setFiltered(filteredProducts);
      setTimeout(() => {
        setFilterLoading(false);
      }, 300);
    }
    catch(es){
      console.log(es)
    }

  };



  return (
    <>
      <h1 style={{ fontSize: "50px", textAlign: "center", fontWeight: "lighter", marginBottom : '50px' }}>
        {title}
      </h1>
    <div className="filter-button-div">
      
     {filters ? <> 
        <button  className="filter-button" onClick={() => filter(0)}>
          Todos
        </button>
        {types.map((t) => (
          <button
            key={t.type_id}
            className="filter-button"
            onClick={() => {
              filter(t.type_id)

             }}
          >
            {t.type}
          </button>
          
        ))}
        
      </> : '' }
      <button onClick={() => setGrid(!grid)} style={window.screen.width > 600 ? {display : 'none'} : {}}  className="apresentation-button">{!grid ? <><span className="pi pi-th-large"></span></> : <><span className="pi pi-align-justify"></span></>}</button>
      </div>  

      <div
      className={grid ? "content-div-product-grid" : "content-div-product"}
      >
        {filtered.map((item) => (
          <ProductTemplate product={item} />
        ))}
      </div>
    </>
  );
}
