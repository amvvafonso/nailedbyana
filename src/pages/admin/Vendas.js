import { useEffect, useState, useRef } from "react";
import API_URL from "../../config";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FaPlus, FaFileDownload } from "react-icons/fa";
import BackofficeHeader from "../../components/BackofficeHeader";
import FullscreenLoading from "../../components/Loading";
import "./CollectionTable.css";

export default function Vendas() {
  const toast = useRef(null);

  // Sales history
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sale dialog
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);

  // Products with items data
  const [productsWithItems, setProductsWithItems] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [itemsList, setItemsList] = useState([]);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch sales history
  const fetchSales = async () => {
    try {
      setLoading(true);
      const result = await fetch(`${API_URL}/server/?action=getSales`, {
        credentials: "include",
        method: "POST",
      }).then((res) => res.json());

      if (result.success) {
        setSales(result.response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products with items for sale form
  const fetchProductsWithItems = async () => {
    try {
      const result = await fetch(
        `${API_URL}/server/?action=getProductsWithItems`,
        {
          credentials: "include",
          method: "POST",
        },
      ).then((res) => res.json());
      console.log(result);
      if (result.success) {
        setProductsWithItems(result.response);

        // Build unique products list
        const uniqueProducts = {};
        result.response.forEach((row) => {
          if (!uniqueProducts[row.product_id]) {
            uniqueProducts[row.product_id] = {
              label: row.name,
              value: row.product_id,
              name: row.name,
              image: row.product_image,
            };
          }
        });

        setProductsList(Object.values(uniqueProducts));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchProductsWithItems();
  }, []);

  // When product is selected, filter items
  const onProductChange = (e) => {
    const productId = e.value;
    setSelectedProduct(productId);
    setSelectedItem(null);
    setQuantity(1);
    const items = productsWithItems
      .filter((row) => row.product_id === productId)
      .filter((row) => {
        const available =
          parseInt(row.total_stock) - parseInt(row.reserve_stock);
        return available > 0;
      })
      .map((row) => ({
        label: `${row.contrast} - Stock: ${parseInt(row.total_stock) - parseInt(row.reserve_stock)} - ${row.price}€`,
        value: row.item_id,
        item_id: row.item_id,
        contrast: row.contrast,
        price: parseFloat(row.price),
        available: parseInt(row.total_stock) - parseInt(row.reserve_stock),
      }));

    setItemsList(items);
  };

  // Open sale dialog
  const openSaleDialog = () => {
    setSelectedProduct(null);
    setSelectedItem(null);
    setQuantity(1);
    setItemsList([]);
    setIsSaleDialogOpen(true);
  };

  // Register sale
  const registerSale = async () => {
    if (!selectedProduct || !selectedItem) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Selecciona um produto e um item",
        life: 3000,
      });
      return;
    }

    if (quantity > selectedItem.available) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: `Stock insuficiente. Disponível: ${selectedItem.available}`,
        life: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "items",
        JSON.stringify([
          {
            item_id: selectedItem.item_id,
            quantity: parseInt(quantity),
            price: selectedItem.price,
          },
        ]),
      );

      const result = await fetch(`${API_URL}/server/?action=registerSale`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then((res) => res.json());

      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: `Venda registada! Total: ${result.total}€`,
          life: 4000,
        });

        setIsSaleDialogOpen(false);
        fetchSales();
        fetchProductsWithItems();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: result.error || "Falha ao registar venda",
          life: 4000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao registar venda",
        life: 3000,
      });
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group sales by sale_id for display
  const groupedSales = {};
  sales.forEach((row) => {
    const id = row.sale_id;
    if (!groupedSales[id]) {
      groupedSales[id] = {
        sale_id: id,
        date: row.date,
        total: row.total,
        product_name: row.product_name,
        product_image: row.product_image,
        items: [],
      };
    }
    groupedSales[id].items.push({
      contrast: row.contrast,
      quantity: row.quantity,
      price: row.price,
    });
  });

  const salesList = Object.values(groupedSales);

  const itemsBodyTemplate = (rowData) => {
    return rowData.items
      .map((i) => `${i.contrast} x${i.quantity} (${i.price}€)`)
      .join(", ");
  };

  const totalBodyTemplate = (rowData) => `${rowData.total}€`;

  const dateBodyTemplate = (rowData) => formatDate(rowData.date);

  // Export sales to CSV (each item as a separate row with individual columns)
  const exportToCSV = () => {
    const headers = [
      "Data",
      "Venda ID",
      "Produto",
      "Contraste",
      "Qtd",
      "Preço Unitário (€)",
      "Subtotal (€)",
    ];

    const rows = salesList.flatMap((sale) =>
      sale.items.map((item) => [
        formatDate(sale.date),
        sale.sale_id,
        sale.product_name,
        item.contrast,
        item.quantity,
        item.price,
        (item.quantity * item.price).toFixed(2),
      ]),
    );

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((r) =>
          r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"),
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <FullscreenLoading />;
  }

  return (
    <div className="collection-table-page">
      <Toast ref={toast} />

      <BackofficeHeader title="Vendas" subtitle="Regista e acompanha vendas" />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginBottom: "16px",
          marginRight: "20px",
        }}
      >
        <button
          onClick={exportToCSV}
          disabled={salesList.length === 0}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "0.6rem 1.25rem",
            backgroundColor: "transparent",
            color: "var(--primary)",
            border: "1px solid var(--primary)",
            borderRadius: "4px",
            cursor: salesList.length ? "pointer" : "not-allowed",
            fontSize: "0.85rem",
            fontFamily: '"Times New Roman", Times, serif',
            opacity: salesList.length ? 1 : 0.4,
            transition: "all 0.2s",
          }}
        >
          <FaFileDownload />
          Exportar Excel
        </button>
        <button className="header-add-btn" onClick={openSaleDialog}>
          Nova Venda
        </button>
      </div>

      {/* Sales History Table */}
      <DataTable
        value={salesList}
        className="collection-datatable"
        emptyMessage="Ainda não há vendas registadas"
      >
        <Column field="date" header="Data" body={dateBodyTemplate} />
        <Column field="product_name" header="Produto" />
        <Column header="Itens" body={itemsBodyTemplate} />
        <Column field="total" header="Total" body={totalBodyTemplate} />
      </DataTable>

      {/* New Sale Dialog */}
      <Dialog
        visible={isSaleDialogOpen}
        onHide={() => setIsSaleDialogOpen(false)}
        header="Nova Venda"
        className="collection-dialog"
        style={{ width: "450px" }}
      >
        <div className="collection-form">
          <div>
            <label className="collection-form-label">Produto</label>
            <Dropdown
              value={selectedProduct}
              options={productsList}
              optionLabel="label"
              placeholder="Selecciona um produto"
              onChange={onProductChange}
              className="collection-input"
              filter
            />
          </div>

          <div>
            <label className="collection-form-label">Contraste / Item</label>
            <Dropdown
              value={selectedItem?.item_id}
              options={itemsList}
              optionLabel="label"
              placeholder="Selecciona um item"
              onChange={(e) =>
                setSelectedItem(
                  productsWithItems.find((pr) => pr.item_id === e.value),
                )
              }
              className="collection-input"
              disabled={!selectedProduct}
            />
          </div>

          <div>
            <label className="collection-form-label">Quantidade</label>
            <InputText
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(val < 1 ? 1 : val);
              }}
              min={1}
              className="collection-input"
              disabled={!selectedItem}
            />
          </div>

          {selectedItem && (
            <div style={{ marginTop: "0.5rem" }}>
              <span className="collection-form-label">
                Subtotal:{" "}
                <strong>{(selectedItem.price * quantity).toFixed(2)}€</strong>
              </span>
            </div>
          )}

          <div className="collection-form-buttons">
            <button
              className="collection-cancel-btn"
              onClick={() => setIsSaleDialogOpen(false)}
            >
              Cancelar
            </button>
            <button className="collection-save-btn" onClick={registerSale}>
              Registar Venda
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
