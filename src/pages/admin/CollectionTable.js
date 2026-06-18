import { useEffect, useState, useRef } from "react";
import API_URL from "../../config";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import BackofficeHeader from "../../components/BackofficeHeader";
import FullscreenLoading from "../../components/Loading";
import "./CollectionTable.css";

export default function CollectionTable() {
  const toast = useRef(null);

  // Collections
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionYear, setNewCollectionYear] = useState(
    new Date().getFullYear(),
  );

  // Edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCollection, setEditCollection] = useState({
    collection_name: "",
    year: "",
    collection_id: "",
  });

  // Fetch collections
  const fetchCollections = async () => {
    try {
      setLoading(true);
      const result = await fetch(`${API_URL}/server/?action=getCollections`, {
        credentials: "include",
      }).then((res) => res.json());

      if (result.status) {
        setCollections(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Activate / deactivate collection
  const toggleActive = async (collection) => {
    try {
      const formData = new FormData();
      formData.append("collection_id", collection.collection_id);

      const result = await fetch(
        `${API_URL}/server/?action=activateCollection`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      ).then((res) => res.json());

      if (result.status) {
        setCollections((prev) =>
          prev.map((c) => ({
            ...c,
            active: c.collection_id === collection.collection_id ? "1" : "0",
          })),
        );
        toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: `Coleção "${collection.collection_name}" ${collection.active === "1" ? "desativada" : "ativada"} com sucesso!`,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: result.error || "Falha ao alterar estado da coleção.",
          life: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao alterar estado da coleção.",
        life: 3000,
      });
    }
  };

  // Create collection
  const submitNewCollection = async (e) => {
    e.preventDefault();

    if (!newCollectionName.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Nome da coleção é obrigatório.",
        life: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("collection_name", newCollectionName);
      formData.append("year", newCollectionYear);

      const result = await fetch(`${API_URL}/server/?action=createCollection`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then((res) => res.json());

      if (result.status) {
        toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: `Coleção "${newCollectionName}" criada com sucesso!`,
          life: 3000,
        });
        setNewCollectionName("");
        setNewCollectionYear(new Date().getFullYear());
        setIsCreateDialogOpen(false);
        fetchCollections();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: result.error || "Falha ao criar coleção.",
          life: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao criar coleção.",
        life: 3000,
      });
    }
  };

  // Edit collection
  const openEditDialog = (collection) => {
    setEditCollection({
      collection_id: collection.collection_id,
      collection_name: collection.collection_name,
      year: collection.year,
    });
    setIsEditDialogOpen(true);
  };

  const submitEditCollection = async (e) => {
    e.preventDefault();

    if (!editCollection.collection_name.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Nome da coleção é obrigatório.",
        life: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("collection_id", editCollection.collection_id);
      formData.append("collection_name", editCollection.collection_name);
      formData.append("year", editCollection.year);

      const result = await fetch(`${API_URL}/server/?action=editCollection`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then((res) => res.json());

      if (result.status) {
        toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Coleção editada com sucesso!",
          life: 3000,
        });
        setIsEditDialogOpen(false);
        fetchCollections();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: result.error || "Falha ao editar coleção.",
          life: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao editar coleção.",
        life: 3000,
      });
    }
  };

  // Delete collection
  const confirmDelete = (collection) => {
    confirmDialog({
      message: `Tem a certeza que deseja eliminar "${collection.collection_name}"?`,
      header: "Eliminar Coleção",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept: () => deleteCollection(collection),
    });
  };

  const deleteCollection = async (collection) => {
    try {
      const formData = new FormData();
      formData.append("collection_id", collection.collection_id);

      const result = await fetch(`${API_URL}/server/?action=deleteCollection`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then((res) => res.json());

      if (result.status) {
        setCollections((prev) =>
          prev.filter((c) => c.collection_id !== collection.collection_id),
        );
        toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: `Coleção "${collection.collection_name}" eliminada!`,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: result.error || "Falha ao eliminar coleção.",
          life: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao eliminar coleção.",
        life: 3000,
      });
    }
  };

  // Column templates
  const activeBodyTemplate = (rowData) => (
    <InputSwitch
      checked={rowData.active === "1" || rowData.active === true}
      onChange={() => toggleActive(rowData)}
    />
  );

  const actionsBodyTemplate = (rowData) => (
    <div className="collection-actions">
      <span
        className="collection-action-btn edit-btn"
        onClick={() => openEditDialog(rowData)}
        title="Editar"
      >
        <FaEdit />
      </span>
      <span
        className="collection-action-btn delete-btn"
        onClick={() => confirmDelete(rowData)}
        title="Eliminar"
      >
        <FaTrash />
      </span>
    </div>
  );

  if (loading) return <FullscreenLoading />;

  return (
    <div className="collection-table-page">
      <BackofficeHeader
        title="Coleções"
        onAdd={() => setIsCreateDialogOpen(true)}
        addButtonLabel={
          <>
            <FaPlus /> Nova Coleção
          </>
        }
      />

      <DataTable
        value={collections}
        className="collection-datatable"
        emptyMessage="Nenhuma coleção encontrada."
      >
        <Column field="collection_id" header="ID" style={{ width: "80px" }} />
        <Column field="collection_name" header="Nome" />
        <Column field="year" header="Ano" style={{ width: "100px" }} />
        <Column
          header="Ativa"
          body={activeBodyTemplate}
          style={{ width: "100px", textAlign: "center" }}
        />
        <Column
          header="Ações"
          body={actionsBodyTemplate}
          style={{ width: "120px", textAlign: "center" }}
        />
      </DataTable>

      {/* Create Dialog */}
      <Dialog
        visible={isCreateDialogOpen}
        onHide={() => setIsCreateDialogOpen(false)}
        header="Nova Coleção"
        className="collection-dialog"
        style={{ width: "450px" }}
      >
        <form onSubmit={submitNewCollection} className="collection-form">
          <label className="collection-form-label">Nome</label>
          <InputText
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Nome da coleção"
            className="collection-input"
          />

          <label className="collection-form-label">Ano</label>
          <InputText
            type="number"
            value={newCollectionYear}
            onChange={(e) => setNewCollectionYear(e.target.value)}
            className="collection-input"
          />

          <div className="collection-form-buttons">
            <button
              type="button"
              className="collection-cancel-btn"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="collection-save-btn">
              Criar
            </button>
          </div>
        </form>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        visible={isEditDialogOpen}
        onHide={() => setIsEditDialogOpen(false)}
        header="Editar Coleção"
        className="collection-dialog"
        style={{ width: "450px" }}
      >
        <form onSubmit={submitEditCollection} className="collection-form">
          <label className="collection-form-label">Nome</label>
          <InputText
            value={editCollection.collection_name}
            onChange={(e) =>
              setEditCollection((prev) => ({
                ...prev,
                collection_name: e.target.value,
              }))
            }
            placeholder="Nome da coleção"
            className="collection-input"
          />

          <label className="collection-form-label">Ano</label>
          <InputText
            type="number"
            value={editCollection.year}
            onChange={(e) =>
              setEditCollection((prev) => ({
                ...prev,
                year: e.target.value,
              }))
            }
            className="collection-input"
          />

          <div className="collection-form-buttons">
            <button
              type="button"
              className="collection-cancel-btn"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="collection-save-btn">
              Guardar
            </button>
          </div>
        </form>
      </Dialog>

      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
}
