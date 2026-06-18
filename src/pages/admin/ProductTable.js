import { Form, useFetcher, useNavigate } from "react-router-dom";
import useSession, { ValidadeSession } from "../../hooks/useSession";
import API_URL from "../../config";
import { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import "./Admin.css";
import "../../styles/ProductTable.css";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import FullscreenLoading, { LoadingComponent } from "../../components/Loading";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import BackofficeHeader from "../../components/BackofficeHeader";
import BackofficeProductCard from "../../components/BackofficeProductCard";
import { Paginator } from "primereact/paginator";
import { Checkbox } from "primereact/checkbox";
import { HiOutlineTrash } from "react-icons/hi2";

export default function ProductTable() {
  const toast = useRef(null);
  const session = ValidadeSession();

  // dialog + mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [deleteEntireProduct, setDeleteEntireProduct] = useState(false);
  // products
  const [products, setProducts] = useState();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [allProduct, setAllProduct] = useState();
  const [filteredAllProduct, setFilterAllProduct] = useState(allProduct);
  const [isVisibleProduct, setIsVisibleProduct] = useState();

  // dropdown lists
  const [typeOptions, setTypeOptions] = useState([]);
  const [collectionOptions, setCollectionOptions] = useState([]);

  // UI counters
  const [productCount, setProductCount] = useState(products?.length);

  // product currently being edited or created
  const [selectedProduct, setSelectedProduct] = useState(new Product());
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  // -------------------------------------
  // SUBMIT (Add or Edit Product)
  // -------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (
      items.find(
        (item) =>
          item.contrast == "" || item.price == null || item.total_stock == "",
      )
    ) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "É obrigatório preencher todos os campos dos items",
        life: 3000,
      });
      return;
    }

    try {
      const form = document.getElementById("createProductForm");
      const formData = new FormData(form);

      formData.append("name", selectedProduct.name);
      formData.append("type", selectedProduct.type);
      formData.append("items", JSON.stringify(items));

      if (selectedProduct.imageFile) {
        formData.append("coverImage", selectedProduct.imageFile);
      }

      // 2. Imagens dos Itens (O PHP espera encontrar $_FILES[item_id])
      items.forEach((item) => {
        if (item.imageFile) {
          // Garante que guardas o ficheiro real no onUpdate do card
          console.log(item.imageFile);
          formData.append(item.item_id, item.imageFile);
        }
      });

      if (!isEditMode) {
        // Create
        formData.append("collection", selectedProduct.collection.collection_name);
        formData.append("collection_id", selectedProduct.collection.collection_id,);
        const responseText = await fetch(
          `${API_URL}/server/?action=createProduct`,
          {
            method: "POST",
            body: formData,
          },
        ).then((res) => res.json());

        if (responseText.success) {
          products.push(selectedProduct);
        }
      } else {
        // EDIT
        formData.append("product_id", selectedProduct.product_id);
        formData.append("collection_id", selectedProduct.collection);
        formData.append("type", selectedProduct.type);
        items.forEach((item) => {
          if (item.imageFile) {
            formData.append(item.item_id, item.imageFile);
          }
          else {
            formData.append("previousImage", item.itemImage);
          }
        });
        const responseText = await fetch(
          `${API_URL}/server/?action=editProduct`,
          {
            method: "POST",
            body: formData,
          },
        ).then((res) => res.text());

        console.log(responseText)

        if (responseText.success) {
          for (let i = 0; i < products.length; i++) {
            if (products[i].product_id === selectedProduct.product_id) {
              products[i] = selectedProduct;
              break;
            }
          }
        }
      }

      setLoading(false);
      hideDialog();
    } catch (err) {
      setLoading(false);
      console.log("Erro:", err);
    }
  };

  // -------------------------------------
  // FETCH COLLECTIONS
  // -------------------------------------
  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/server/?action=getCollections`);
      const result = await response.json();

      const options = result.data.map((c) => ({
        collection_name: c.collection_name,
        collection_id: c.collection_id,
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

  const fetchAllData = async () => {
    try {
      const res = await fetch(`${API_URL}/server/?action=fetchAllData`, {
        method: "POST",
        credentials: "include",
      }).then((Response) => Response.json());

      if (res.success) {
        setProducts(res.response);
      }
    } catch (es) {
      console.log(es);
    }
  };

  const fetchAllProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/server/?action=getAllProduct`, {
        method: "GET",
        credentials: "include",
      }).then((Response) => Response.json());


      if (res.success) {
        setAllProduct(res.response);
      }
    } catch (es) {
      console.log(es);
    }
  };

  const hideDialog = () => {
    setSelectedProduct(new Product());
    setIsProductDialogOpen(false);
    setItems([]);
  };
  // DELETE ACCEPTED
  const acceptDelete = async (product, entireProduct) => {
    if (entireProduct) {
      const ok = await removeProduct(product);

      toast.current.show({
        severity: ok ? "success" : "error",
        summary: ok ? "Confirmação" : "Erro",
        detail: ok
          ? `Produto ${product.name} eliminado com sucesso!`
          : "Ocorreu um problema na eliminação do produto!",
        life: 3000,
      });
      return;
    } else {
      const ok = await deleteItem(product);

      toast.current.show({
        severity: ok ? "success" : "error",
        summary: ok ? "Confirmação" : "Erro",
        detail: ok
          ? `Produto ${product.name} eliminado com sucesso!`
          : "Ocorreu um problema na eliminação do produto!",
        life: 3000,
      });
      return;
    }
  };

  // CONFIRM DELETE POPUP
  const confirmProductDeletion = (product, checked) => {
    confirmDialog({
      message: (
        <div style={{ minWidth: "30vw" }}>
          <button
            onClick={() => acceptDelete(product, true)}
            className="delete-whole-button"
          >
            Eliminar {product.name}
          </button>
          <label className="confirm-deletion-dialog-label">
            {" "}
            Tem a certeza que deseja eliminar o item?
          </label>
        </div>
      ),
      header: "Tem a certeza?",
      accept: () => acceptDelete(product, false),
      reject: () => { },
    });
  };

  const editProduct = (product) => {
    setIsEditMode(true);
    setSelectedProduct(
      allProduct.find((p) => p.product_id === product.product_id),
    );
    setItems(products.filter((item) => item.product_id == product.product_id));
    setIsProductDialogOpen(true);
  };

  const createProduct = () => {
    setIsEditMode(false);
    setSelectedProduct(new Product());
    setIsProductDialogOpen(true);
  };

  const createItem = () => {
    setItems((prev) => [
      ...prev,
      {
        item_id: crypto.randomUUID(),
        new: true,
        product_id: selectedProduct ? selectedProduct.product_id : "",
        ...new Item(),
      },
    ]);
  };



  const removeItem = (item_id) => {
    setItems((prev) => prev.filter((item) => item.item_id !== item_id));
  };

  const updateItem = (item_id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.item_id === item_id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // DELETE PRODUCT
  const removeProduct = async (product) => {
    try {
      const formData = new FormData();
      formData.append("product_id", product.product_id);

      const result = await fetch(`${API_URL}/server/?action=deleteProduct`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then((res) => res.json());

      if (result.success) {
        const newList = products.filter(
          (p) => p.product_id !== product.product_id,
        );
        setProducts(newList);
        return true;
      }

      return false;
    } catch (es) {
      console.log(es);
    }
  };

  const deleteItem = async (item) => {
    try {
      const formData = new FormData();
      formData.append("item_id", item.item_id);

      const result = await fetch(`${API_URL}/server/?action=deleteItem`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then((res) => res.json());

      if (result.success) {
        const newList = products.filter((p) => p.item_id !== item.item_id);
        setFilteredProducts(newList);
        return true;
      }

      return false;
    } catch (es) {
      console.log(es);
    }
  };

  // -------------------------------------
  // ACTIVATE / DEACTIVATE PRODUCT
  // -------------------------------------
  const toggleProductState = async (productId, currentState) => {
    try {
      console.log(productId + " /" + currentState);
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("state", currentState);

      const result = await fetch(`${API_URL}/server/?action=activateProduct`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then((res) => res.json());

      console.log(result);
      if (result.success) {
        setFilteredProducts((prev) =>
          prev.map((p) =>
            p.product_id === productId
              ? {
                ...p,
                state: result.newState,
              }
              : p,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------
  // FILTER PRODUCTS BY NAME / TYPE / COLLECTION
  // -------------------------------------
  const filterProducts = (query) => {
    try {
      if (!query) {
        setFilteredProducts(products);
        setProductCount(products?.length);
        return;
      }

      const normalized = query.toLowerCase();
      const matched = products.filter(
        (p) =>
          p.name.toLowerCase().includes(normalized) ||
          p.contrast.toLowerCase().includes(normalized),
      );

      setFilteredProducts(matched);
      setProductCount(matched?.length);
    } catch (err) {
      console.log(err);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchTypes();
    fetchCollections();
    fetchAllData();
    fetchAllProduct();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // -------------------------------------
  // RENDER
  // -------------------------------------




  const displayProducts = filteredProducts?.slice(first, first + rows);
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    setFilterAllProduct(allProduct);
  }, [allProduct]);

  return (
    <>
      <ConfirmDialog />
      <Toast ref={toast} />
      <div className="main-div">
        <div className="search-div">
          <div className="search-inner-div">
            <FaSearch color="rgba(var(--primary), 0.5)" />
            <input
              onChange={(e) => {
                filterProducts(e.target.value);
                setFirst(0);
              }}
              className="search-input"
              placeholder={"SEARCH INVENTORY..."}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "flow" }}>
          <BackofficeHeader
            title={"Product Inventory"}
            subtitle={"Aqui poderá gerir todos os artigos da loja"}
          />
          <div
            style={{
              alignContent: "center",
              margin: "auto",
              position: "relative",
              top: "30px",
              right: "20px",
            }}
          >
            <button
              onClick={() => {
                createProduct();
              }}
              className="add-product-button"
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <FaPlus /> Adicionar produto
              </span>
            </button>
          </div>
        </div>
        <div className="grid-container">
          {displayProducts?.map((e) => (
            <BackofficeProductCard
              editItem={editProduct}
              deleteItem={confirmProductDeletion}
              key={e.id}
              product={e}
              type={typeOptions.find((type) => type.code == e.type)}
            />
          ))}
        </div>
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filteredProducts?.length || 0}
          rowsPerPageOptions={[9, 15, 27]}
          onPageChange={onPageChange}
          className="custom-paginator"
        />
      </div>
      <Dialog
        showHeader={false}
        visible={isProductDialogOpen}
        onHide={hideDialog}
        style={{
          width: "80vw",
          paddingTop: "20px",
          backgroundColor: "#fbf9f9",
        }}
      >
        {loading ? (
          <LoadingComponent />
        ) : (
          <form id="createProductForm" onSubmit={handleSubmit}>
            <div className="dialog-main-div">
              <div className="dialog-left">
                <h1 style={{ color: "black" }}>Nova aquisição</h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ color: "#664b09" }}>Preview do produto</p>
                  <label className="product-cover-input" htmlFor="coverImage">
                    Escolher capa
                  </label>
                </div>
                <input
                  accept=".jpeg, .png, .jpg"
                  id="coverImage"
                  name="coverImage"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setSelectedProduct({
                      ...selectedProduct,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }}
                  type="file"
                  className="product-cover-input"
                  placeholder="Title of the piece"
                />
                <img
                  src={API_URL + selectedProduct?.image || "/addImage.webp"}
                  alt={"Preview do produto"}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    maxHeight: "540px",
                  }}
                  id="coverPreview"
                />
              </div>
              <div className="dialog-right">
                <h2 style={{ color: "#664b09" }}>Detalhes</h2>
                <input
                  value={selectedProduct.name}
                  onChange={(e) => {
                    setSelectedProduct({
                      ...selectedProduct,
                      name: e.target.value,
                    });
                  }}
                  type="text"
                  className="title-input"
                  placeholder="Title of the piece"
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "50% 50%",
                    gap: "30px",
                  }}
                >
                  <div>
                    <h3>Categoria</h3>
                    <div className="button-group">
                      {typeOptions.map((type) => {
                        return (
                          <button
                            style={{
                              backgroundColor:
                                selectedProduct?.type == type?.code
                                  ? "rgb(113, 88, 26)"
                                  : "transparent",
                              color:
                                selectedProduct?.type == type?.code
                                  ? "white"
                                  : "black",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedProduct({
                                ...selectedProduct,
                                type: type.code,
                              });
                            }}
                            className="type-button"
                            key={type.id}
                          >
                            {type.name}
                          </button>
                        );
                      })}
                    </div>
                    <div>
                      <h3>Outras configurações</h3>
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          gap: "5px",
                        }}
                      >
                        <Checkbox
                          inputId="IsProductVisible"
                          checked={selectedProduct.visible == 1 ? true : false}
                          onChange={(e) => {
                            setSelectedProduct({
                              ...selectedProduct,
                              visible: e.checked,
                            });
                          }}
                        />
                        <label htmlFor="IsProductVisible">Visivel</label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3>Coleção</h3>
                    <Dropdown
                      required
                      value={selectedProduct.collection}
                      options={collectionOptions}
                      placeholder="Selecione a coleção"
                      optionLabel="collection_name"
                      optionValue="collection_id"
                      onChange={(e) => {
                        console.log(e.value);
                        setSelectedProduct({
                          ...selectedProduct,
                          collection: e.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ width: "100%", minHeight: "200px" }}>
              <h3>Gestão dos items</h3>
              <div className="item-div">
                {items?.map((item, index) => (
                  <ItemCard
                    isEditMode={isEditMode}
                    key={item.item_id}
                    item={item}
                    onRemove={() => removeItem(item.item_id)}
                    onUpdate={updateItem}
                  />
                ))}

                <AddItemCard onAdd={createItem} />
              </div>
            </div>
            <div
              style={{ display: "flex", justifyContent: "right", gap: "10px" }}
            >
              <button className="cancel-button" onClick={() => hideDialog()}>
                Cancelar
              </button>
              <button className="create-button" type="submit">
                {isEditMode ? "Atualizar" : "Publicar"}
              </button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}

export function ItemCard({ item, onRemove, onUpdate, isEditMode }) {
  const [hovered, setHovered] = useState(false);

  // Estilo mantido conforme pediste
  const rowContainerStyle = {
    height: "35px",
    display: "flex",
    alignItems: "center",
  };

  const handleImageChange = (e) => {
    console.log(e.target.files);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Opção A: Usar URL temporário (desaparece no refresh, bom para preview rápido)
      const newImageUrl = URL.createObjectURL(file);
      onUpdate(item.item_id, "image", newImageUrl);
      onUpdate(item.item_id, "imageFile", file);
      // Opção B: Converter para Base64 (persiste no refresh, mas aumenta o estado)
      /*
        const reader = new FileReader();
        reader.onloadend = () => {
          onUpdate(item.item_id, 'image', reader.result);
        };
        reader.readAsDataURL(file);
        */
    }
  };

  const commonElementStyle = {
    height: "100%",
    width: "50%",
    margin: 0,
    padding: "5px 8px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div
      onMouseLeave={() => setHovered(false)}
      onMouseEnter={() => setHovered(true)}
      className="item-inner-div"
      style={{ transition: "all 0.3s ease", position: "relative" }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="remove-item-button"
      >
        <HiOutlineTrash />
      </button>
      <label htmlFor={item.item_id}>
        <img
          onClick={() => { }}
          className="change-item-image"
          src={
            item.itemImage
              ? API_URL + item.itemImage
              : item.image || "/addImage.webp"
          }
          alt={item.name}
        />
      </label>
      <input
        name={item.item_id}
        id={item.item_id}
        accept=".png, .JPEG, .jpg"
        style={{ display: "none" }}
        type="file"
        onChange={handleImageChange}
      />
      <div
        style={{
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={rowContainerStyle}>
          {hovered ? (
            <input
              className="item-input"
              style={commonElementStyle}
              placeholder="Contraste"
              value={item.contrast || ""}
              onChange={(e) =>
                onUpdate(item.item_id, "contrast", e.target.value)
              }
            />
          ) : (
            <p className="item-label" style={commonElementStyle}>
              {item.contrast || "Contraste"}
            </p>
          )}
        </div>

        <div style={rowContainerStyle}>
          {hovered ? (
            <input
              className="item-input"
              style={commonElementStyle}
              placeholder="Preço"
              value={item.price || ""}
              onChange={(e) => onUpdate(item.item_id, "price", e.target.value)}
            />
          ) : (
            <p
              className="item-label"
              style={{ ...commonElementStyle, fontWeight: "bold" }}
            >
              {item.price}€
            </p>
          )}
        </div>

        {/* Campo 3: Stock */}
        <div style={rowContainerStyle}>
          {hovered ? (
            <input
              className="item-input"
              style={commonElementStyle}
              placeholder="Stock"
              value={item.total_stock || ""}
              onChange={(e) =>
                onUpdate(item.item_id, "total_stock", e.target.value)
              }
            />
          ) : (
            <p
              className="item-label"
              style={{
                ...commonElementStyle,
                color: "#666",
                fontSize: "0.9em",
              }}
            >
              Stock: {item.total_stock || "0"} un.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AddItemCard({ onAdd }) {
  const [hovered, setHovered] = useState(false);

  // Mantemos exatamente os mesmos estilos base do ItemCard para alinhamento
  const cardStyle = {
    transition: "all 0.3s ease",
    position: "relative",
    cursor: "pointer",
    border: hovered ? "2px dashed #71581a" : "2px dashed #ddd", // Efeito de borda no hover
    borderRadius: "8px",
    backgroundColor: hovered ? "#fdfbf6" : "#fafafa",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // Ajusta estas medidas para baterem certo com o tamanho do teu item-inner-div

    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={onAdd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={cardStyle}
      className="item-inner-div add-item-blank" // Mantém a classe base para layout
    >
      {/* Ícone Grande de Mais */}
      <div
        style={{
          fontSize: "50px",
          color: hovered ? "#71581a" : "#aaa",
          transition: "color 0.3s ease",
        }}
      >
        <i className="pi pi-plus-circle"></i> {/* Ícone do PrimeIcons */}
      </div>

      {/* Texto Informativo */}
      <p
        style={{
          margin: 0,
          fontWeight: "bold",
          color: hovered ? "#71581a" : "#666",
          transition: "color 0.3s ease",
          fontSize: "1.1em",
        }}
      >
        Adicionar Novo Item
      </p>

      <p
        style={{
          color: "#888",
          fontSize: "0.9em",
          textAlign: "center",
        }}
      >
        Clique para configurar contraste, preço e stock.
      </p>
    </div>
  );
}

// --------------------------------------------------
// PRODUCT CLASS
// --------------------------------------------------
class Product {
  constructor() {
    this.product_id = "";
    this.visible = "";
    this.type = "";
    this.name = "";
    this.collection = "";
    this.state = "";
    this.image = "";
    this.item_id = "";
  }

  isEqual(other) {
    return this.product_id === other.product_id;
  }
}

class Item {
  constructor() {
    this.visible = "";
    this.contrast = "";
    this.total_stock = "";
    this.reserve_stock = "";
    this.price = "";
    this.state = "";
    this.image = "";
  }
}
