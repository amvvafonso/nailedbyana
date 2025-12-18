import { useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";
import API_URL from "../../config";
import { useEffect, useState, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import "./Admin.css";
import { useProducts } from "../../services/ProductProvider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";



export default function ReservationTable() {




  // Dropdown / data sets
  const [reservationStateOptions, setReservationStateOptions] = useState([]);


  // Reservations
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);


  // Dialogs
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);

  // Selected reservation
  const [selectedReservation, setSelectedReservation] = useState([]);
  const [person, setPerson] = useState("unknown")


  /**
   * Open reservation and load products
   */
  const openReservationDialog = async (rowData) => {
    try {
      setIsReservationDialogOpen(true);

      const formData = new FormData();
      formData.append("reservation_id", rowData.data.reservation_id);

      const result = await fetch(
        `${API_URL}/server/?action=getProductsFromReservation`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      ).then((res) => res.json());

      console.log(result)
      if (result.success) {
        setSelectedReservation(result.response);
        setPerson(result.response[0].person)
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Fetch all reservations
   */
  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API_URL}/server/?action=getReservations`, {
        method: "POST",
        credentials: "include",
      }).then((r) => r.json());

      if (res.success) {
        setReservations(res.response);
        setFilteredReservations(res.response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Reservation state dropdown UI
   */
  const reservationStateTemplate = (rowData) => {
    return (
      <>
        {rowData.state !== "CANCELED" && (
          <Dropdown
            value={reservationStateOptions.find(
              (s) => s.state === rowData.state
            )}
            options={reservationStateOptions}
            optionLabel="state"
            onChange={(e) =>
              updateReservationStatus(
                rowData.reservation_id,
                e.value.state_id,
                e.value.state
              )
            }
          />
        )}
      </>
    );
  };

  /**
   * Update reservation state
   */
  const updateReservationStatus = async (
    reservationId,
    newStateId,
    newStateText
  ) => {
    try {
      const formData = new FormData();
      formData.append("reservation_id", reservationId);
      formData.append("state", newStateId);

      const res = await fetch(
        `${API_URL}/server/?action=updateReservationState`,
        {
          body: formData,
          method: "POST",
          credentials: "include",
        }
      ).then((r) => r.json());

      if (res.success) {
        setFilteredReservations((prev) =>
          prev.map((item) =>
            item.reservation_id === reservationId
              ? { ...item, state: newStateText }
              : item
          )
        );

        setReservations((prev) =>
          prev.map((item) =>
            item.reservation_id === reservationId
              ? { ...item, state: newStateText }
              : item
          )
        );
      } else {
        console.error("Failed to update reservation:", res);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Fetch reservation state options
   */
  const fetchReservationStates = async () => {
    try {
      const res = await fetch(
        `${API_URL}/server/?action=getReservationState`,
        {
          method: "POST",
          credentials: "include",
        }
      ).then((r) => r.json());

      if (res.success) {
        setReservationStateOptions(res.response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Filter reservations
   */
  const filterReservations = (search) => {
    try {
      if (!search) {
        setFilteredReservations(reservations);
        return;
      }

      const lowered = search.toLowerCase();

      const filtered = reservations.filter(
        (r) =>
          r.email.toLowerCase().includes(lowered) ||
          r.nomePessoa.toLowerCase().includes(lowered) ||
          r.state.toLowerCase().includes(lowered)
      );

      setFilteredReservations(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReservationStates();
    fetchReservations();
  }, []);

  return (
    <>
      <div
        id="section_reservas"
        style={{
          display: "flex",
          width: "90%",
          margin: "auto",
          padding: "19px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Todas as reservas</h1>

        <div style={{ display: "flex" }}>
          <p style={{ marginRight: "5px" }}>Procurar reserva</p>
          <input
            onChange={(e) => filterReservations(e.target.value)}
            style={{ fontSize: "22px" }}
            placeholder="Nome, Email, Tipo, estado"
          />
        </div>
      </div>

      <DataTable
        showGridlines
        stripedRows
        paginator
        rows={50}
        onRowClick={openReservationDialog}
        rowClassName={(rowData) => {
          switch (rowData.state) {
            case "PENDING":
              return "row-pending";
            case "CONFIRMED":
              return "row-confirmed";
            case "CANCELED":
              return "row-cancelled";
            case "CONCLUDED":
              return "row-concluded";
            default:
              return "";
          }
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        value={filteredReservations}
        tableStyle={{
          minWidth: "50rem",
          width: "100%",
          margin: "auto",
          border: "solid 1px rgba(80,80,80,0.2)",
        }}
      >
        <Column
          headerStyle={{ width: "2%" }}
          className="column-content"
          field="reservation_id"
          header="Id"
        />
        <Column
          headerStyle={{ width: "20%" }}
          className="column-content"
          field="person"
          header="Nome"
        />
        <Column
          headerStyle={{ width: "20%" }}
          className="column-content"
          field="email"
          header="Email"
        />
        <Column
          headerStyle={{ width: "10%" }}
          className="column-content"
          field="date"
          header="Quantidade"
        />
        <Column
          body={reservationStateTemplate}
          headerStyle={{ width: "10%" }}
          className="column-content"
          field="state"
          header="Estado"
        />
      </DataTable>

      <Dialog 
        showHeader={false}
        visible={isReservationDialogOpen}
        modal
        style={{
          width: "50vw",
          paddingTop : '50px',
          backgroundColor: "white",

        }}
        onHide={() => {
          if (!isReservationDialogOpen) return;
          setIsReservationDialogOpen(false);
        }}
        >
          <h1 style={{textAlign : 'center'}}>Reservas de {selectedReservation.person}</h1>
          <DataTable value={selectedReservation}>
            <Column className="column-content" header="Peça" field="name" ></Column>
            <Column className="column-content" header="Quantidade" field="quantity" ></Column>
            <Column className="column-content" header="Cor/Contraste" field="contrast"></Column>
            <Column className="column-content" header="Tipo" field="type" ></Column>

          </DataTable>
             <button
              onClick={() => setIsReservationDialogOpen(false)}
              style={{
                position: "absolute",
                margin : '0',
                top: "5px",
                right: "10px",
                cursor: "pointer",
                border : '0',
                backgroundColor : 'transparent'
              }}
            >
              <i  className="pi pi-times" />
            </button>
      </Dialog>
    </>
  );
}
