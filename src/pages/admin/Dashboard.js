import FullscreenLoading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";
import API_URL from "../../config";
import { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import "./Admin.css";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { useProducts } from "../../services/ProductProvider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { InputSwitch } from 'primereact/inputswitch';
import { Tooltip } from 'primereact/tooltip';



export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useRef(null);

  //session hook
  const { user, loading } = useSession();

  //state var
  const [edit, setEdit] = useState(false);

  // Data retrievel hook
  const { products, setProducts, collection } = useProducts();

  // Data hooks
  const [listCol, setListCol] = useState([]);
  const [listType, setListType] = useState([]);

  //Dialog hooks
  const [productDialog, setProductDialog] = useState(false);
  const [collectionDialog, setCollectionDialog] = useState(false);

  const [currentProduct, setcurrentProduct] = useState(new Product());

  //Dropdowns - products
  const [selectedCollection, setSelectedCollection] = useState();
  const [type, setType] = useState();

  

  // state function

  const handleEdit = (product) => {
    setcurrentProduct(product);
    setEdit(true);
    setProductDialog(true);
  };

  const accept = async (product) => {
    const result = await handleDelete(product);
    if (result) {
      toast.current.show({
        severity: "info",
        summary: "Confirmação",
        detail: `Eliminado com sucesso o produto ${product.name}!`,
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: `Ocorreu um problema na eliminação do produto! `,
        life: 3000,
      });
    }
  };

  const reject = () => {};

  const confirmDeletion = (product) => {
    confirmDialog({
      message: "Tem a certeza que deseja eliminar?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => accept(product),
      reject,
    });
  };

  const createProduct = () => {
    setEdit(false);
    setcurrentProduct(new Product());
    setProductDialog(true);
  };


  // Fetch form data

  const getCollections = async (e) => {
    try {
      let temp = [];
      const collection = await fetch(
        `${API_URL}/server/?action=getCollections`,
        {}
      ).then((Response) => Response.json());

      collection.data.map((e) => {
        temp.push({ name: e.collection_name, code: e.collection_id });
      });
      setListCol(temp)
    } catch (Exception) {
      console.log(Exception);
    }
  };

  const getTypes = async (e) => {
    try {
      let temp = [];
      const types = await fetch(`${API_URL}/server/?action=getTypes`, {}).then(
        (Response) => Response.json()
      );

      types.data.map((e) => {
        temp.push({ name: e.type, code: e.type_id });
      });
      setListType(temp)
    } catch (Exception) {
      console.log(Exception);
    }
  };

  useEffect((e) => {
    getCollections();
    getTypes();
  }, []);





  // Form

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!edit) {
        const form = document.getElementById("fileUpload");
        const formData = new FormData(form); // Pega TODOS os campos do form automaticamente
        formData.append("collection", selectedCollection.name);
        formData.append("collection_id", selectedCollection.code);
        formData.append("type", type.code);

        const response = await fetch(
          `${API_URL}/server/?action=createProduct`,
          {
            method: "POST",
            body: formData,
          }
        ).then((Response) => Response.json());


        if (response.status) {
          currentProduct.product_id = "Atualizar para ver Id";
          products.push(currentProduct);
        }
        setProductDialog(false);
      } else {
        const form = document.getElementById("fileUpload");
        const formData = new FormData(form); // Pega TODOS os campos do form automaticamente
        formData.append("collection", selectedCollection.name);
        formData.append("collection_id", selectedCollection.code);
        formData.append("type", type.code);
        formData.append("product_id", currentProduct.product_id);
        formData.append("oldImage", currentProduct.image);

        const response = await fetch(`${API_URL}/server/?action=editProduct`, {
          method: "POST",
          body: formData,
        }).then((Response) => Response.json());

        console.log("Server response:", response);

        if (response.status) {
          for (let i = 0; i < products.length; i++) {
            if (products[i].product_id === currentProduct.product_id) {
              products[i] = currentProduct;
              break;
            }
          }
        }

        setProductDialog(false);
      }
    } catch (Es) {
      console.log("erro", Es);
    }
  };

  const handleDelete = async (product1) => {
    const formData = new FormData();
    formData.append("product_id", product1.product_id);
    const result = await fetch(`${API_URL}/server/?action=deleteProduct`, {
      method: "POST",
      body: formData,
    }).then((Response) => Response.json());

    if (result.status) {
      const newProducts = products.filter(
        (p) => p.product_id !== product1.product_id
      );
      setProducts(newProducts);
      return true;
    } else {
      return false;
    }
  };



  // React templates

  const options = (rowData) => {
    return (
      <>
        <div style={{ display: "flex" }}>
          <i
            className="pi pi-pencil datatable-option"
            onClick={() => handleEdit(rowData)}
          />
          <i
            style={{ color: "red" }}
            className="pi pi-times datatable-option"
            onClick={() => confirmDeletion(rowData)}
          />
        </div>
      </>
    );
  };

  const productState = (rowData) => {
      return (
        <>
          { rowData.state === 'AVAILABLE' ? <i className="pi pi-circle-fill" tooltip={"Disponivel"} style={{color : 'green'}}/> : <i className="pi pi-circle-fill" style={{color : 'red'}}/>}
        </>
      )
  }

  const preview = (e) => {
    const uploaded = document.getElementById("productImage");
    const images = document.getElementById("preview");
    const [file] = uploaded.files;
    if (file) {
      images.src = URL.createObjectURL(file);
    }
  };


  if (loading) return <FullscreenLoading />;
  if (user.permission !== "1") navigate("/");

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <h1 style={{ textAlign: "center" }}>Dashboard</h1>
      <Divider />
      <br />
      <div className="data-div">
        <Card className="dashboard-card" title="Produtos ativos">
          <p>
            Existem <strong>{products.length}</strong> produtos ativos neste
            momento!
          </p>
          <button
            onClick={createProduct}
            style={{ fontSize: "20px", margin: "0" }}
          >
            Adicionar produto
          </button>
        </Card>
        <Card className="dashboard-card" title="Coleção ativa">
          <p>
            A coleção ativa é <strong>{collection}</strong>
          </p>
        </Card>
        <Card className="dashboard-card" title="Total de reservas">
          <p>Existem 40 reservas, das quais 10 estão pendentes!</p>
        </Card>
      </div>

      <Divider />

      <div
        style={{
          maxHeigh: "500px",
          overflow: "auto",
          height: "500px",
          margin: "auto",
        }}
      >
        <DataTable
          paginator
          rows={50}
          rowsPerPageOptions={[5, 10, 25, 50]}
          value={products}
          tableStyle={{ minWidth: "50rem", width: "80%", margin: "auto" }}
        >
          <Column field="product_id" header="Id"></Column>
          <Column field="name" header="Nome"></Column>
          <Column field="type" header="Tipo"></Column>
          <Column field="quantity" header="Quantidade"></Column>
          <Column field="collection_name" header="Coleção"></Column>
          <Column field="state" body={productState} header="Estado"></Column>
          <Column header="Opções" body={options}></Column>
        </DataTable>
      </div>

      <i
        style={{ paddingLeft: "50x", cursor: "pointer" }}
        onClick={() => setProductDialog(true)}
        className="pi pi-plus"
      />

      <Dialog
        showHeader={false}
        visible={productDialog}
        modal
        style={{
          width: "90vw",
          paddingTop: "50px",
          backgroundColor: "white",
          height: "80%",
        }}
        onHide={() => {
          setcurrentProduct(new Product());
          if (!productDialog) return;
          setProductDialog(false);
          setSelectedCollection()
          setType()
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
          {edit ? "Editar produto" : "Adicionar produto"}
        </h1>
        <div className="dialog-div-admin">
          <div className="product-input-div">
            <form
              id="fileUpload"
              name="fileUpload"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <p>
                Nome
                <input
                  value={currentProduct.name}
                  required
                  type="text"
                  name="product"
                  id="product"
                  onChange={(e) =>
                    setcurrentProduct({
                      ...currentProduct,
                      name: e.target.value,
                    })
                  }
                />
              </p>

              <p>
                Preço
                <input
                  value={currentProduct.price}
                  required
                  type="number"
                  step={".01"}
                  name="price"
                  id="price"
                  onChange={(e) =>
                    setcurrentProduct({
                      ...currentProduct,
                      price: e.target.value,
                    })
                  }
                />
              </p>

              <p>
                Quantidade
                <input
                  value={currentProduct.quantity}
                  required
                  type="number"
                  name="quantity"
                  id="quantity"
                  onChange={(e) =>
                    setcurrentProduct({
                      ...currentProduct,
                      quantity: e.target.value,
                    })
                  }
                />
              </p>

              <Dropdown
                required
                value={type}
                options={listType}
                placeholder="Tipo"
                optionLabel="name"
                onChange={(e) => {
                  setType(e.value);
                  setcurrentProduct({
                    ...currentProduct,
                    type: e.value.name,
                  });
                }}
              />
              <Dropdown
                required
                value={selectedCollection}
                options={listCol}
                placeholder="Coleção"
                optionLabel="name"
                onChange={(e) => {
                  setSelectedCollection(e.value);
                  setcurrentProduct({
                    ...currentProduct,
                    collection_name: e.value.name,
                  });
                }}
              />
              <input
                required={edit ? false : true}
                style={{ marginTop: "50px" }}
                type="file"
                name="productImage"
                id="productImage"
                onChange={preview}
              />
              <button
                type="submit"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "110px",
                  cursor: "pointer",
                }}
              >
                {edit ? "Editar" : "Adicionar"}
              </button>
            </form>
            <button
              onClick={() => setProductDialog(false)}
              style={{
                position: "absolute",
                bottom: "0",
                right: "10px",
                cursor: "pointer",
              }}
            >
              Fechar
            </button>
          </div>
          <div className="image-div-admin">
            <img
              className="image-preview"
              id="preview"
              src={currentProduct.image || "#"}
              alt="preview"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}

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
    if (this.product_id === other.product_id) return true;
    return false;
  }

  existing(product) {
    this.collection_id = product.collection_id || "";
    this.collection_name = product.collection_name || "";
    this.image = product.image || "";
    this.name = product.name || "";
    this.price = product.price || "";
    this.product_id = product.product_id || "";
    this.quantity = product.quantity || "";
    this.season = product.season || "";
    this.state = product.state || "";
    this.type = product.type || "";
    this.year = product.year || "";
  }
}
