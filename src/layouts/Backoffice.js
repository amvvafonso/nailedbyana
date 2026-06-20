import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "primeicons/primeicons.css";
import "./Layout.css";

import { ValidadeSession } from "../hooks/useSession";
import SideBar from "../components/shared/SideBar";
import API_URL from "../config";

export default function BackofficeLayout() {
  const { showWarning, setShowWarning } = ValidadeSession();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function guardAuth() {
      try {
        const res = await fetch(`${API_URL}/server/?action=checkAuth`, {
          credentials: "include",
          method: "POST",
        });
        const auth = await res.json();
        if (!auth?.success) {
          navigate("/login", { replace: true });
          return;
        }
      } catch {
        navigate("/login", { replace: true });
        return;
      } finally {
        setChecking(false);
      }
    }
    guardAuth();
  }, [navigate]);

  if (checking) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fbf9f9" }}>
        A carregar...
      </div>
    );
  }

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
