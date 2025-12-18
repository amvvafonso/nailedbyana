export default function StatisticCard(props){



    return (
        <>
            <Card className="dashboard-card" title="Total de reservas">
                  <p>Existem {reservations.length} reservas, das quais {numReservations} estão pendentes!</p>
                   <a
                    className="form-button"
                    href="#section_reservas"
                    style={{ fontSize: "20px", margin: "0", textDecoration : 'none' }}
                  >
                    Gerir reservas
                  </a>
            </Card>
        </>
    )
}
