import FullscreenLoading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";
import API_URL from "../../config";
import { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import "./Admin.css";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { useProducts } from "../../services/ProductProvider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import ProductTable from "./ProductTable";
import ReservationTable from "./ReservationTable";

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useRef(null);

  // Session
  const { user, logged, loading } = useSession();

  // Product provider
  const { products, collection } = useProducts();

  // Data lists
  const [collectionOptions, setCollectionOptions] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [activeCollectionName, setActiveCollectionName] = useState();

  // Creation form
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionYear, setNewCollectionYear] = useState(
    new Date().getFullYear()
  );

  // Dialogs
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  // ------------------------------------------------------------
  // Toast helpers
  // ------------------------------------------------------------

  const deleteCollectionConfirmed = async (collection) => {
    const success = await deleteCollectionRequest(collection);

    toast.current.show({
      severity: success ? "success" : "error",
      summary: success ? "Confirmação" : "Erro",
      detail: success
        ? `Eliminado com sucesso a coleção ${collection.collection_name}!`
        : "Ocorreu um problema na eliminação da coleção!",
      life: 3000,
    });
  };

  const confirmDeleteCollection = (collection) => {
    confirmDialog({
      message: "Tem a certeza que deseja eliminar?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => deleteCollectionConfirmed(collection),
      reject: () => {},
    });
  };

  // ------------------------------------------------------------
  // Fetch Collections
  // ------------------------------------------------------------

  const fetchCollections = async () => {
    try {
      const result = await fetch(`${API_URL}/server/?action=getCollections`).then(
        (res) => res.json()
      );

      setAllCollections(result.data);

      // Build dropdown options
      const formatted = result.data.map((c) => ({
        name: c.collection_name,
        code: c.collection_id,
      }));

      setCollectionOptions(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCollections();
    setActiveCollectionName(collection);
  }, [collection]);

  // ------------------------------------------------------------
  // Collection Actions
  // ------------------------------------------------------------

  const activateCollectionById = async (collectionId) => {
    try {
      const form = document.getElementById("collectionForm");
      const formData = new FormData(form);
      formData.append("collection_id", collectionId);

      const result = await fetch(
        `${API_URL}/server/?action=activateCollection`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      ).then((r) => r.json());

      if (result.status) {
        // Update UI
        setAllCollections((prev) =>
          prev.map((c) => ({
            ...c,
            active: c.collection_id === collectionId ? "1" : "0",
          }))
        );

        const activeCol = allCollections.find(
          (c) => c.collection_id === collectionId
        );

        if (activeCol) setActiveCollectionName(activeCol.collection_name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitNewCollection = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("year", newCollectionYear);
      formData.append("collection_name", newCollectionName);

      const result = await fetch(
        `${API_URL}/server/?action=createCollection`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      ).then((r) => r.json());

      if (result.status) {
        toast.current.show({
          severity: "success",
          summary: "Confirmação",
          detail: "Coleção criada com sucesso!",
          life: 4000,
        });

        fetchCollections();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCollectionRequest = async (collection) => {
    try {
      const formData = new FormData();
      formData.append("collection_id", collection.collection_id);

      const result = await fetch(
        `${API_URL}/server/?action=deleteCollection`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      ).then((res) => res.json());

      if (result.status) {
        setAllCollections((prev) =>
          prev.filter((c) => c.collection_id !== collection.collection_id)
        );
        return true;
      }
    } catch (err) {
      console.log(err);
    }

    return false;
  };

  // ------------------------------------------------------------
  // Templates
  // ------------------------------------------------------------

  const activeCollectionTemplate = (rowData) => (
    <InputSwitch
      onChange={() => activateCollectionById(rowData.collection_id)}
      checked={rowData.active === "1"}
    />
  );

  const collectionOptionsTemplate = (rowData) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <i
        onClick={() => confirmDeleteCollection(rowData)}
        style={{ color: "red" }}
        className="pi pi-times datatable-option"
      />
    </div>
  );

  const collectionForm = (
    <form
      id="collectionForm"
      onSubmit={submitNewCollection}
      className="collection-addition-div"
    >
      <p style={{ fontSize: "25px" }}>Adicionar coleção</p>

      <input
        required
        className="input-field"
        placeholder="Nome"
        value={newCollectionName}
        onChange={(e) => setNewCollectionName(e.target.value)}
      />

      <input
        required
        className="input-field"
        placeholder="Ano"
        value={newCollectionYear}
        onChange={(e) => setNewCollectionYear(e.target.value)}
      />

      <button className="form-button">
        <i className="pi pi-plus" />
      </button>
    </form>
  );

  // ------------------------------------------------------------
  // Page Guard
  // ------------------------------------------------------------

  if (window.screen.width < 600)
    return <h1>Está página só funciona em desktop</h1>;

  if (loading) return <FullscreenLoading />;

  if (!user || user.permission !== "1") navigate("/");

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />

      <h1 style={{ textAlign: "center" }}>Dashboard</h1>
      <Divider />

      <div className="data-div">
        <Card className="dashboard-card" title="Produtos ativos">
          <p>
            Existem <strong>{products.length}</strong> produtos ativos neste
            momento!
          </p>
        </Card>

        <Card className="dashboard-card" title="Coleção ativa">
          <p>
            A coleção ativa é <strong>{activeCollectionName}</strong>
          </p>
          <button
            className="form-button"
            onClick={() => setIsCollectionDialogOpen(true)}
            style={{ fontSize: "20px", margin: 0 }}
          >
            Gerir coleções
          </button>
        </Card>
      </div>

      <Divider />
      <ProductTable />

      <Divider />

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
        <ReservationTable />
      </div>

      {/* -------------------- Collection Dialog -------------------- */}
      <Dialog
        showHeader={false}
        visible={isCollectionDialogOpen}
        modal
        style={{
          width: "50vw",
          paddingTop: "50px",
          backgroundColor: "white",
        }}
        onHide={() => setIsCollectionDialogOpen(false)}
      >
        <h1 style={{ textAlign: "center" }}>Coleções</h1>

        <DataTable footer={collectionForm} value={allCollections}>
          <Column field="collection_name" header="Nome" />
          <Column field="year" header="Ano" />
          <Column
            field="active"
            header="Estado"
            body={activeCollectionTemplate}
          />
          <Column
            header="Opções"
            body={collectionOptionsTemplate}
          />
        </DataTable>

        <button
          onClick={() => setIsCollectionDialogOpen(false)}
          style={{
            position: "absolute",
            top: "5px",
            right: "10px",
            border: 0,
            backgroundColor: "transparent",
            cursor: "pointer",
            margin: 0,
          }}
        >
          <i className="pi pi-times" />
        </button>
      </Dialog>
    </>
  );
}

// ------------------------------------------------------------
// Product Model — cleaned but logic unchanged
// ------------------------------------------------------------

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
