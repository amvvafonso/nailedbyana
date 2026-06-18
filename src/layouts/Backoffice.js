import { Link, Outlet } from "react-router-dom";
import PageFooter from "../components/shared/PageFooter";
import "./Layout.css";

import useSession, { ValidadeSession } from "../hooks/useSession";
import SideBar from "../components/shared/SideBar";
import { useState } from "react";

export default function BackofficeLayout() {

  const { showWarning, setShowWarning } = useSession()

  return (
    <>
      {showWarning && (
        <div style={{ width: '100vw', height: '100vh', position: 'fixed', backgroundColor: 'rgba(80,80,80,0.5)', alignContent: 'center', textAlign: 'center', zIndex: '1' }}>
          <div className="warning-inner-div">
            <p>A sua sessão expirou</p>
            <Link to={"/"} onClick={() => setShowWarning(false)} className="banner-button">Voltar à pagina principal</Link>
          </div>
        </div>
      )}
      <div style={{ backgroundColor: '#fbf9f9' }} className="backoffice-layout">
        <SideBar />
        <Outlet />
      </div>

    </>
  )
}
