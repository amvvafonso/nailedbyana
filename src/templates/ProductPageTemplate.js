import FullscreenLoading from "../components/Loading";
import ProductTemplate from "../components/ProductTemplate";
import { useState, useEffect, useRef, useCallback } from "react";
import { DeferredContent } from 'primereact/deferredcontent';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { LoadingComponent } from "../components/Loading";

export default function ProductPageTemplate({ title, products, types, loading, filters }) {
  const [filtered, setFiltered] = useState([]);
  const [viewMode, setViewMode] = useState(0); // 0 = 2 col, 1 = 1 col
  const [filterLoading, setFilterLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(0);
  const toastt = useRef(null);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(16);

  useEffect(() => {
    setFiltered(products);
    if (types && types.length > 0) {
      const sorted = [...types].sort((a, b) => a.type.localeCompare(b.type));
      types.length = 0;
      types.push(...sorted);
    }
  }, [products]);

  const filter = useCallback((typeId) => {
    setFilterLoading(true);
    setActiveFilter(typeId);
    const filteredProducts = typeId == 0 ? products : products.filter((p) => p.type == typeId);
    setFiltered(filteredProducts);
    setFirst(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setFilterLoading(false), 250);
  }, [products]);

  const currentProducts = filtered.slice(first, first + rows);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="collection-page">
        <h1 className="collection-title">{title}</h1>

        {filters && (
          <div className="filter-button-div">
            <button
              className={`filter-button ${activeFilter === 0 ? 'active' : ''}`}
              onClick={() => filter(0)}
            >
              Todos
            </button>
            {types.map((t) => (
              <button
                key={t.type_id}
                className={`filter-button ${activeFilter == t.type_id ? 'active' : ''}`}
                onClick={() => filter(t.type_id)}
              >
                {t.type}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setViewMode(viewMode === 0 ? 1 : 0)}
          className="view-mode-button"
          style={window.screen.width > 600 ? { display: 'none' } : {}}
        >
          {viewMode === 0 ? <span className="pi pi-align-justify"></span> : <span className="pi pi-th-large"></span>}
        </button>

        {filterLoading && (
          <div className="filter-loading-overlay">
            <LoadingComponent />
          </div>
        )}

        {!filterLoading && filtered.length > 0 ? (
          <div className={viewMode === 1 ? "content-div-product-single" : "content-div-product"}>
            <Toast ref={toastt} />
            {currentProducts.map((item) => (
              <DeferredContent key={item.id || item.product_id}>
                <ProductTemplate product={item} />
              </DeferredContent>
            ))}
          </div>
        ) : !filterLoading ? (
          <div className="empty-state">
            <span className="pi pi-search empty-icon" />
            <p>Não existem produtos para mostrar</p>
          </div>
        ) : null}

        <div className="paginator-container">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filtered.length}
            onPageChange={onPageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          />
        </div>
      </div>
    </>
  );
}
