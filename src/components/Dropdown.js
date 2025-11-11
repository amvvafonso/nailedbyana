import './Components.css';

export default function Dropdown({ label, children }) {
  return (
    <div className="dropdown">
      <button className="dropbtn">{label}<i style={{fontSize : '10px', marginLeft : '4px'}} className='pi pi-arrow-down'/></button>
      <div className="dropdown-content">
        {children}
      </div>
    </div>
  );
}
