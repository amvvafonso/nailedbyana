import { Form, useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";
import API_URL from "../../config";
import { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import "./Admin.css";
import { useProducts } from "../../services/ProductProvider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";

export default function ProductTable() {
  const toast = useRef(null);

  // dialog + mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  // products
  const { products, setProducts, collection } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);

  // dropdown lists
  const [typeOptions, setTypeOptions] = useState([]);
  const [collectionOptions, setCollectionOptions] = useState([]);
  const [allCollections, setAllCollections] = useState([]);

  const [selectedType, setSelectedType] = useState();
  const [selectedCollection, setSelectedCollection] = useState();

  // UI counters
  const [productCount, setProductCount] = useState(products.length);

  // product currently being edited or created
  const [selectedProduct, setSelectedProduct] = useState(new Product());

  // -------------------------------------
  // SUBMIT (Add or Edit Product)
  // -------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = document.getElementById("fileUpload");
      const formData = new FormData(form);

      formData.append("collection", selectedCollection.name);
      formData.append("collection_id", selectedCollection.code);
      formData.append("type", selectedType.code);

      if (!isEditMode) {
        // CREATE
        const responseText = await fetch(`${API_URL}/server/?action=createProduct`, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());


        if (responseText.status) {
          selectedProduct.product_id = "Atualizar para ver Id";
          products.push(selectedProduct);
        }
      } else {
        // EDIT
        formData.append("product_id", selectedProduct.product_id);
        formData.append("oldImage", selectedProduct.image);

        const responseText = await fetch(`${API_URL}/server/?action=editProduct`, {
          method: "POST",
          body: formData,
        }).then((res) => res.text());

        console.log("Server response:", responseText);

        if (responseText.status) {
          for (let i = 0; i < products.length; i++) {
            if (products[i].product_id === selectedProduct.product_id) {
              products[i] = selectedProduct;
              break;
            }
          }
        }
      }

      setIsProductDialogOpen(false);
    } catch (err) {
      console.log("Erro:", err);
    }
  };

  // -------------------------------------
  // TABLE ACTIONS
  // -------------------------------------
  const actionColumnTemplate = (row) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <i
        className="pi pi-pencil datatable-option"
        onClick={() => handleEdit(row)}
      />
      <i
        style={{ color: "red" }}
        className="pi pi-times datatable-option"
        onClick={() => confirmProductDeletion(row)}
      />
    </div>
  );

  const previewImage = () => {
    const imageInput = document.getElementById("productImage");
    const previewImg = document.getElementById("preview");
    const [file] = imageInput.files;

    if (file) {
      previewImg.src = URL.createObjectURL(file);
    }
  };

  // -------------------------------------
  // FETCH COLLECTIONS
  // -------------------------------------
  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/server/?action=getCollections`);
      const result = await response.json();

      setAllCollections(result.data);

      const options = result.data.map((c) => ({
        name: c.collection_name,
        code: c.collection_id,
      }));

      setCollectionOptions(options);
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------------------
  // FETCH TYPES
  // -------------------------------------
  const fetchTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/server/?action=getTypes`);
      const result = await response.json();

      const options = result.data.map((t) => ({
        name: t.type,
        code: t.type_id,
      }));

      setTypeOptions(options);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsProductDialogOpen(true);
  };

  // DELETE ACCEPTED
  const acceptDelete = async (product) => {
    const ok = await handleDelete(product);

    toast.current.show({
      severity: ok ? "success" : "error",
      summary: ok ? "Confirmação" : "Erro",
      detail: ok
        ? `Produto ${product.name} eliminado com sucesso!`
        : "Ocorreu um problema na eliminação do produto!",
      life: 3000,
    });
  };

  // CONFIRM DELETE POPUP
  const confirmProductDeletion = (product) => {
    confirmDialog({
      message: "Tem a certeza que deseja eliminar?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      accept: () => acceptDelete(product),
      reject: () => {},
    });
  };

  const createProduct = () => {
    setIsEditMode(false);
    setSelectedProduct(new Product());
    setIsProductDialogOpen(true);
  };

  // DELETE PRODUCT
  const handleDelete = async (product) => {
    try {
      const formData = new FormData();
      formData.append("product_id", product.product_id);

      const result = await fetch(`${API_URL}/server/?action=deleteProduct`, {
        method: "POST",
        body: formData,
        credentials : 'include'
      }).then((res) => res.json());


      if (result.success) {
        const newList = products.filter((p) => p.product_id !== product.product_id);
        setProducts(newList);
        return true;
      }

      return false;
    }
    catch(es){
      console.log(es)
    }
  };

  // -------------------------------------
  // ACTIVATE / DEACTIVATE PRODUCT
  // -------------------------------------
  const toggleProductState = async (productId, currentState) => {
    try {
      console.log(productId)
      console.log(currentState)
  

      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("state", currentState);

      const result = await fetch(`${API_URL}/server/?action=activateProduct`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then((res) => res.json());

      console.log(result)
      if (result.success) {
        setFilteredProducts((prev) =>
          prev.map((p) =>
            p.product_id === productId
              ? {
                  ...p,
                  state: result.newState,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stateColumnTemplate = (row) => (
    <InputSwitch
      onChange={() => toggleProductState(row.product_id, row.state)}
      checked={row.state == 1}
    />
  );

  // -------------------------------------
  // FILTER PRODUCTS BY NAME / TYPE / COLLECTION
  // -------------------------------------
  const filterProducts = (query) => {
    try {
      if (!query) {
        setFilteredProducts(products);
        setProductCount(products.length);
        return;
      }

      const normalized = query.toLowerCase();
      const matched = products.filter(
        (p) =>
          p.name.toLowerCase().includes(normalized) ||
          p.type.toLowerCase().includes(normalized) ||
          p.collection_name.toLowerCase().includes(normalized)
      );

      setFilteredProducts(matched);
      setProductCount(matched.length);
    } catch (err) {
      console.log(err);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchTypes();
    fetchCollections();
  }, []);

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  // -------------------------------------
  // RENDER
  // -------------------------------------
  return (
    <>
      <Toast ref={toast} />
      <button onClick={createProduct}>Novo Produto</button>

      <div style={{ display: "flex", width: "70%", margin: "auto", padding: "19px" }}>
        <h1 style={{ textAlign: "center" }}>
          Todos os produtos
          <p style={{ margin: 0, fontSize: "18px", fontWeight: "lighter" }}>
            Resultados – {productCount}
          </p>
        </h1>

        <div style={{ display: "flex" }}>
          <p style={{ marginRight: 5 }}>Procurar produto</p>
          <input
            onChange={(e) => filterProducts(e.target.value)}
            style={{ fontSize: 22 }}
            placeholder="Nome, Tipo, Coleção"
          />
        </div>
      </div>

      <div
        style={{
          maxHeight: "1000px",
          overflow: "auto",
          height: "1000px",
          margin: "auto",
          textAlign: "center",
          width: "80%",
          borderTop: "solid 1px rgba(80,80,80, 0.2)",
        }}
      >
        <DataTable
          showGridlines
          stripedRows
          paginator
          rows={50}
          rowsPerPageOptions={[5, 10, 25, 50]}
          value={filteredProducts}
          tableStyle={{
            minWidth: "50rem",
            width: "100%",
            margin: "auto",
            border: "solid 1px rgba(80,80,80,0.2)",
          }}
        >
          <Column field="product_id" header="ID" headerStyle={{ width: "2%" }} />
          <Column field="name" header="Nome" headerStyle={{ width: "20%" }} />
          <Column field="type" header="Tipo" headerStyle={{ width: "10%" }} />
          <Column field="total_stock" header="Stock total" headerStyle={{ width: "10%" }} />
          <Column field="reserve_stock" header="Reservado" headerStyle={{ width: "10%" }} />
          <Column field="collection_name" header="Coleção" headerStyle={{ width: "10%" }} />
          <Column
            field="state"
            header="Estado"
            body={stateColumnTemplate}
            headerStyle={{ width: "10%" }}
          />
          <Column
            header="Opções"
            body={actionColumnTemplate}
            headerStyle={{ width: "10%" }}
          />
        </DataTable>
      </div>

      {/* PRODUCT DIALOG */}
      <Dialog
        showHeader={false}
        visible={isProductDialogOpen}
        modal
        style={{
          width: "90vw",
          paddingTop: 50,
          backgroundColor: "white",
          height: "80%",
        }}
        onHide={() => {
          setSelectedProduct(new Product());
          setSelectedCollection();
          setSelectedType();
          setIsProductDialogOpen(false);
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 25 }}>
          {isEditMode ? "Editar produto" : "Adicionar produto"}
        </h1>

        <div className="dialog-div-admin">
          <div className="product-input-div">
            <form id="fileUpload" onSubmit={handleSubmit} encType="multipart/form-data">
              <p>
                Nome
                <input
                  value={selectedProduct.name}
                  required
                  type="text"
                  name="product"
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      name: e.target.value,
                    })
                  }
                />
              </p>

              <p>
                Preço
                <input
                  value={selectedProduct.price}
                  required
                  type="number"
                  step=".01"
                  name="price"
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      price: e.target.value,
                    })
                  }
                />
              </p>

              <p>
                Quantidade
                <input
                  value={selectedProduct.quantity}
                  required
                  type="number"
                  name="quantity"
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      quantity: e.target.value,
                    })
                  }
                />
              </p>

              <Dropdown
                required
                value={selectedType}
                options={typeOptions}
                placeholder="Tipo"
                optionLabel="name"
                onChange={(e) => {
                  setSelectedType(e.value);
                  setSelectedProduct({
                    ...selectedProduct,
                    type: e.value.name,
                  });
                }}
              />

              <Dropdown
                required
                value={selectedCollection}
                options={collectionOptions}
                placeholder="Coleção"
                optionLabel="name"
                onChange={(e) => {
                  setSelectedCollection(e.value);
                  setSelectedProduct({
                    ...selectedProduct,
                    collection_name: e.value.name,
                  });
                }}
              />

              <input
                required={!isEditMode}
                style={{ marginTop: 50 }}
                type="file"
                name="productImage"
                id="productImage"
                onChange={previewImage}
              />

              <button
                type="submit"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 110,
                  cursor: "pointer",
                }}
              >
                {isEditMode ? "Editar" : "Adicionar"}
              </button>
            </form>

            <button
              onClick={() => setIsProductDialogOpen(false)}
              style={{
                position: "absolute",
                bottom: 0,
                right: 10,
                cursor: "pointer",
              }}
            >
              Fechar
            </button>

            <button
              onClick={() => setIsProductDialogOpen(false)}
              style={{
                position: "absolute",
                top: 5,
                right: 10,
                cursor: "pointer",
                border: 0,
                backgroundColor: "transparent",
              }}
            >
              <i className="pi pi-times" />
            </button>
          </div>

          <div className="image-div-admin">
            <img
              className="image-preview"
              id="preview"
              src={selectedProduct.image || "#" }
              alt="preview"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}

// --------------------------------------------------
// PRODUCT CLASS
// --------------------------------------------------
class Product {
  constructor() {
    this.collection_id = "";
    this.collection_name = "";
    this.image = "";
    this.name = "";
    this.price = "";
    this.product_id = "";
    this.quantity = "";
    this.season = "";
    this.state = "";
    this.type = "";
    this.year = "";
  }

  isEqual(other) {
    return this.product_id === other.product_id;
  }

  existing(product) {
    Object.assign(this, {
      collection_id: product.collection_id || "",
      collection_name: product.collection_name || "",
      image: product.image || "",
      name: product.name || "",
      price: product.price || "",
      product_id: product.product_id || "",
      quantity: product.quantity || "",
      season: product.season || "",
      state: product.state || "",
      type: product.type || "",
      year: product.year || "",
    });
  }
}
