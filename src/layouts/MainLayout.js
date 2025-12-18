import { Link, Outlet } from "react-router-dom";
import NavBar from "../components/shared/NavBar";
import PageFooter from "../components/shared/PageFooter";
import "./Layout.css";

import { ValidadeSession } from "../hooks/useSession";




export default function MainLayout() {
    const { showWarning, setShowWarning } = ValidadeSession(); 




    return (
        <> 
        
            

            {showWarning && (
                <div style={{width : '100vw', height : '100vh', position : 'fixed', backgroundColor : 'rgba(80,80,80,0.5)', alignContent : 'center', textAlign : 'center', zIndex : '1'}}>
                    <div className="warning-inner-div">
                        <p>A sua sessão expirou</p>
                        <Link to={"/"} onClick={() => setShowWarning(false)} className="banner-button">Voltar à pagina principal</Link>
                    </div>
                </div>
            )}
            <NavBar />
            <div className="layout">
                <Outlet/>
            </div>

            <PageFooter/>
        </>
    )
}
