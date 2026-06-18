import FullscreenLoading from "../components/Loading";
import ProductTemplate from "../components/ProductTemplate";
import { useState, useEffect, useRef } from "react";
import { DeferredContent } from 'primereact/deferredcontent';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator'; // Importado

export default function ProductPageTemplate({ title, products, types, loading, filters }) {
  const [filtered, setFiltered] = useState([]);
  const [grid, setGrid] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const toastt = useRef(null);

  // Estados da Paginação
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(16);  


  useEffect(() => {
    setFiltered(products);
    types.sort((a, b) => a.type.localeCompare(b.type));
  }, [products]);

  const filter = (typeId) => {
    try {
      setFilterLoading(true);
      const filteredProducts = typeId === 0 ? products : products.filter((p) => p.type === typeId);

      setFiltered(filteredProducts);
      setFirst(0); // Resetar para a primeira página ao filtrar

      setTimeout(() => {
        setFilterLoading(false);
      }, 300);
    } catch (es) {
      console.log(es);
    }
  };

  const currentProducts = filtered.slice(first, first + rows);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <h1 style={{ fontSize: "50px", textAlign: "center", fontWeight: "lighter", marginBottom: '50px' }}>
        {title}
      </h1>
      
      <div className="filter-button-div">
        {filters ? (
          <>
            <button className="filter-button" onClick={() => filter(0)}>Todos</button>
            {types.map((t) =>  (
              <button
                key={t.type_id}
                className="filter-button"
                onClick={() => filter(t.type_id)}
              >
                {t.type}
              </button>
            ))}
          </>
        ) : ''}
        <button onClick={() => setGrid(!grid)} style={window.screen.width > 600 ? { display: 'none' } : {}} className="apresentation-button">
          {!grid ? <span className="pi pi-th-large"></span> : <span className="pi pi-align-justify"></span>}
        </button>
      </div>

      {products.length != 0 ?  <div className={grid ? "content-div-product-grid" : "content-div-product"}>
        <Toast ref={toastt} />
        {currentProducts.map((item) => (
          <DeferredContent key={item.id || item.product_id}>
            <ProductTemplate product={item} />
          </DeferredContent>
        ))}
      </div> : <h3 style={{textAlign : 'center'}}>Não existe nenhum produto atualmente</h3>}

      <div className="paginator-container" style={{ marginTop: '20px' }}>
        <Paginator 
          first={first} 
          rows={rows} 
          totalRecords={filtered.length} 
          onPageChange={onPageChange} 
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        />
      </div>
    </>
  );
}
