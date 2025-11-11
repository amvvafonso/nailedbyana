import { Outlet } from "react-router-dom"
import NavBar from "../components/shared/NavBar"
import PageFooter from "../components/shared/PageFooter"
import "./Layout.css"

export default function MainLayout(){
    

    return (
        <> 
        
            <NavBar />
            
            <div className="layout">
                <Outlet/>
            </div>
            <PageFooter/>
        
        </>
    )
}
