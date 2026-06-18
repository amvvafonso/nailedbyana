export default function BackofficeCard({ title, value }) {


  return (
    <>
      <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(80,80,80,0.1)', maxWidth: '250px' }}>
        <div style={{padding : '20px', textAlign : 'center'}}>
          <h2 style={{fontSize : '15px', color : 'rgba(100,100,100,0.8)'}}>{title || "TOTAL DE PRODUTOS"}</h2>
          <p style={{fontSize : '30px', marginTop : '0'}}>{value || "123 Produtos"}</p>
        </div>
      </div>
    </>
  )
}
