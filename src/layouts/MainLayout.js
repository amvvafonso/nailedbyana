import { Outlet } from "react-router-dom"
import NavBar from "../components/shared/NavBar"
import PageFooter from "../components/shared/PageFooter"

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
