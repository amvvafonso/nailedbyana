import "../styles/BackofficeHeader.css"

export default function BackofficeHeader({ title, subtitle, onAdd, addButtonLabel, actions }) {

  return (
    <>
      <div className="header-div">
        <div className="header-inner-div">
          <div className="header-text">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="header-actions">
            {actions}
            {onAdd && addButtonLabel && (
              <button className="header-add-btn" onClick={onAdd}>
                {addButtonLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
