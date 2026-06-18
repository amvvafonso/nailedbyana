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
import { Chart } from 'primereact/chart';
import { FaSearch } from "react-icons/fa";
import BackofficeHeader from "../../components/BackofficeHeader";
import BackofficeCard from "../../components/BackofficeCard";
import { Avatar } from "primereact/avatar";
import UserAvatar from "../../components/Avatar";


export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useRef(null);

  // Session
  const { user, logged, loading } = useSession();

  // Product provider
  const { products, collection, types } = useProducts();

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
  const [isTypeCollectionOpen, setIsTypeCollectionOpen] = useState(false);

  // ------------------------------------------------------------
  // Dashboard Stats & Charts
  // ------------------------------------------------------------
  const [totalStats, setTotalStats] = useState(null);
  const [salesByDate, setSalesByDate] = useState([]);
  const [topContrasts, setTopContrasts] = useState([]);
  const [reservationsByState, setReservationsByState] = useState([]);

  const fetchDashboardStats = async () => {
    const actions = [
      { url: `${API_URL}/server/?action=getTotalStats`, setter: setTotalStats },
      { url: `${API_URL}/server/?action=getSalesByDate`, setter: setSalesByDate },
      { url: `${API_URL}/server/?action=getTopContrasts`, setter: setTopContrasts },
      { url: `${API_URL}/server/?action=getReservationsByState`, setter: setReservationsByState },
    ];
    console.log(totalStats)
    for (const { url, setter } of actions) {
      try {
        const res = await fetch(url, { credentials: "include" }).then((r) => r.json());
        if (res.success) setter(res.response);
      } catch (err) {
        console.error(err);
      }
    }
  };

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
      reject: () => { },
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
    fetchDashboardStats();
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
      console.log(collection.collection_id)
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
  // Chart Data Configuration
  // ------------------------------------------------------------
  const chartColors = {
    gold: "rgba(113, 88, 26, 0.8)",
    goldLight: "rgba(113, 88, 26, 0.15)",
    gray: "rgba(80, 80, 80, 0.6)",
    grayLight: "rgba(80, 80, 80, 0.15)",
    white: "#ffffff",
  };

  const chartDefaults = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: chartColors.gray },
      },
    },
    scales: {
      x: {
        ticks: { color: chartColors.gray },
        grid: { color: chartColors.grayLight },
      },
      y: {
        ticks: { color: chartColors.gray },
        grid: { color: chartColors.grayLight },
      },
    },
  };

  const doughnutDefaults = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: chartColors.gray, padding: 15 },
      },
    },
  };

  const salesChartDS = salesByDate.length
    ? {
        labels: salesByDate.map((d) => d.day),
        datasets: [
          {
            type: "line",
            label: "Receita (€)",
            borderColor: chartColors.gold,
            backgroundColor: chartColors.goldLight,
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: chartColors.gold,
            pointRadius: 5,
            pointHoverRadius: 7,
            data: salesByDate.map((d) => parseFloat(d.total_revenue)),
          },
          {
            type: "bar",
            label: "Nº Vendas",
            backgroundColor: chartColors.gray,
            borderColor: "#ffffff",
            borderWidth: 1,
            borderRadius: 4,
            data: salesByDate.map((d) => d.sales_count),
          },
        ],
      }
    : { labels: [], datasets: [] };

  const topContrastDS = topContrasts.length
    ? {
        labels: topContrasts.map((d) => d.contrast),
        datasets: [
          {
            label: "Unidades Vendidas",
            data: topContrasts.map((d) => parseInt(d.total_sold)),
            backgroundColor: topContrasts.map((_, i) =>
              i % 2 === 0 ? chartColors.gold : chartColors.gray
            ),
          },
        ],
      }
    : { labels: [], datasets: [] };

  const reservationColors = [
    "#f1c40f", // pending
    "#2ecc71", // confirmed
    "#e74c3c", // cancelled
    "#95a5a6", // concluded
    "#9b59b6",
    "#1abc9c",
  ];

  const reservationDS = reservationsByState.length
    ? {
        labels: reservationsByState.map((d) => d.state),
        datasets: [
          {
            data: reservationsByState.map((d) => parseInt(d.count)),
            backgroundColor: reservationsByState.map((_, i) => reservationColors[i % reservationColors.length]),
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // ------------------------------------------------------------
  // Page Guard
  // ------------------------------------------------------------

  if (window.screen.width < 600)
    return <h1>Está página só funciona em desktop</h1>;

  if (loading) return <FullscreenLoading />;

  if (!user || user.permission !== "1") navigate("/login");

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  return (
    <>
      <div className="main-div">
        <div className="search-div">
          {/* <div className="search-inner-div">
            <FaSearch color="rgba(var(--primary), 0.5)" />
            <input className="search-input" placeholder={"SEARCH INVENTORY..."} />
          </div> */}
        </div>
        <BackofficeHeader title={"Olá, " + user.name} subtitle={"Aqui poderá ver um Overview da loja"} />

      {/* ---- Stats Cards ---- */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "space-evenly", marginTop: "20px" }}>
        <BackofficeCard
          title={"TOTAL VENDAS"}
          value={totalStats?.sales ? `${totalStats.sales.total_sales} vendas` : "—"}
        />
        <BackofficeCard
          title={"RECEITA TOTAL"}
          value={totalStats?.sales ? `${parseFloat(totalStats.sales.total_revenue).toFixed(2)} €` : "—"}
        />
        <BackofficeCard
          title={"VENDAS HOJE"}
          value={totalStats?.today ? `${totalStats.today.count} (${parseFloat(totalStats.today.revenue).toFixed(2)} €)` : "—"}
        />
        <BackofficeCard
            title={"RESERVAÇÕES PENDENTES"}
          value={totalStats?.reservations.pending ? totalStats.reservations.pending : "—"}
        />
      </div>

      {/* ---- Charts Row 1: Sales Over Time ---- */}
      <div style={{ width: "80%", margin: "30px auto 0" }}>
        <h2 className="dashboard-header" style={{ fontSize: "18px", marginBottom: "15px" }}>Vendas Últimos 30 Dias</h2>
        <div style={{ height: "300px", backgroundColor: "rgba(80,80,80,0.05)", borderRadius: "8px", padding: "15px" }}>
          <Chart
            type="line"
            data={salesChartDS}
            options={{
              ...chartDefaults,
            }}
          />
        </div>
      </div>

      {/* ---- Charts Row 2: Top Contrasts + Reservations ---- */}
      <div style={{ display: "flex", gap: "20px", width: "80%", margin: "30px auto 0" }}>
        <div style={{ flex: 1 }}>
          <h2 className="dashboard-header" style={{ fontSize: "18px", marginBottom: "15px" }}>Top Contrastes</h2>
          <div style={{ height: "300px", backgroundColor: "rgba(80,80,80,0.05)", borderRadius: "8px", padding: "15px" }}>
            <Chart
              type="bar"
              data={topContrastDS}
              options={{
                ...chartDefaults,
                indexAxis: "y",
                scales: {
                  x: { ticks: { color: chartColors.gray }, grid: { color: chartColors.grayLight } },
                  y: { ticks: { color: chartColors.gray }, grid: { display: false } },
                },
              }}
            />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="dashboard-header" style={{ fontSize: "18px", marginBottom: "15px" }}>Reservas por Estado</h2>
          <div style={{ height: "300px", backgroundColor: "rgba(80,80,80,0.05)", borderRadius: "8px", padding: "15px" }}>
            <Chart
              type="doughnut"
              data={reservationDS}
              options={doughnutDefaults}
            />
          </div>
        </div>
      </div>
      </div>

      {/* <Toast ref={toast} /> */}
      {/* <ConfirmDialog /> */}
      {/**/}
      {/* <h1 style={{ textAlign: "center" }}>Dashboard</h1> */}
      {/* <Divider /> */}
      {/**/}
      {/* <div className="data-div"> */}
      {/*   <Card className="dashboard-card" title="Produtos ativos"> */}
      {/*     <p> */}
      {/*       Existem <strong>{products.length}</strong> produtos ativos neste */}
      {/*       momento! */}
      {/*     </p> */}
      {/*   </Card> */}
      {/*  <Card className="dashboard-card" title="Tipos de produtos"> */}
      {/*     <p> */}
      {/*       Tipos de produtos */}
      {/*     </p> */}
      {/*     <button */}
      {/*       className="form-button" */}
      {/*       onClick={() => setIsTypeCollectionOpen(true)} */}
      {/*       style={{ fontSize: "20px", margin: 0 }} */}
      {/*     > */}
      {/*       Gerir tipos de produtos */}
      {/*     </button> */}
      {/*   </Card>  */}
      {/**/}
      {/*   <Card className="dashboard-card" title="Coleção ativa"> */}
      {/*     <p> */}
      {/*       A coleção ativa é <strong>{activeCollectionName}</strong> */}
      {/*     </p> */}
      {/*     <button */}
      {/*       className="form-button" */}
      {/*       onClick={() => setIsCollectionDialogOpen(true)} */}
      {/*       style={{ fontSize: "20px", margin: 0 }} */}
      {/*     > */}
      {/*       Gerir coleções */}
      {/*     </button> */}
      {/*   </Card> */}
      {/* </div> */}
      {/**/}
      {/* <Divider/> */}
      {/*  <ProductTable/> */}
      {/**/}
      {/* <Divider /> */}
      {/**/}
      {/* <div */}
      {/*   style={{ */}
      {/*     maxHeight: "1000px", */}
      {/*     overflow: "auto", */}
      {/*     height: "1000px", */}
      {/*     margin: "auto", */}
      {/*     textAlign: "center", */}
      {/*     width: "80%", */}
      {/*     borderTop: "solid 1px rgba(80,80,80, 0.2)", */}
      {/*   }} */}
      {/* > */}
      {/*   <ReservationTable /> */}
      {/* </div> */}
      {/**/}
      {/**/}
      {/*   <Divider/> */}
      {/**/}
      {/**/}
      {/* {/* -------------------- Collection Dialog -------------------- */}
      {/* <Dialog */}
      {/*   showHeader={false} */}
      {/*   visible={isCollectionDialogOpen} */}
      {/*   modal */}
      {/*   style={{ */}
      {/*     width: "50vw", */}
      {/*     paddingTop: "50px", */}
      {/*     backgroundColor: "white", */}
      {/*   }} */}
      {/*   onHide={() => setIsCollectionDialogOpen(false)} */}
      {/* > */}
      {/*   <h1 style={{ textAlign: "center" }}>Coleções</h1> */}
      {/**/}
      {/*   <DataTable footer={collectionForm} value={allCollections}> */}
      {/*     <Column field="collection_name" header="Nome" /> */}
      {/*     <Column field="year" header="Ano" /> */}
      {/*     <Column */}
      {/*       field="active" */}
      {/*       header="Estado" */}
      {/*       body={activeCollectionTemplate} */}
      {/*     /> */}
      {/*     <Column */}
      {/*       header="Opções" */}
      {/*       body={collectionOptionsTemplate} */}
      {/*     /> */}
      {/*   </DataTable> */}
      {/**/}
      {/*   <button */}
      {/*     onClick={() => setIsCollectionDialogOpen(false)} */}
      {/*     style={{ */}
      {/*       position: "absolute", */}
      {/*       top: "5px", */}
      {/*       right: "10px", */}
      {/*       border: 0, */}
      {/*       backgroundColor: "transparent", */}
      {/*       cursor: "pointer", */}
      {/*       margin: 0, */}
      {/*     }} */}
      {/*   > */}
      {/*     <i className="pi pi-times" /> */}
      {/*   </button> */}
      {/* </Dialog> */}
      {/* <Dialog visible={isTypeCollectionOpen} onHide={() => { setIsTypeCollectionOpen(false)}}> */}
      {/*     <DataTable value={types}> */}
      {/*       <Column field="type" header="Tipo"/> */}
      {/*     </DataTable> */}
      {/**/}
      {/* </Dialog> */}
    </>
  );
}
