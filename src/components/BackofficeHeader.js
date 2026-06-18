import "../styles/BackofficeHeader.css"

export default function BackofficeHeader({ title, subtitle }) {



  return (
    <>
      <div className="header-div">
        <div className="header-inner-div">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
    </>
  )
}
