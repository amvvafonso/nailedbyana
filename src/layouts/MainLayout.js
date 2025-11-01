import { Outlet } from "react-router-dom"
import NavBar from "../components/shared/NavBar"
import PageFooter from "../components/shared/PageFooter"

export default function MainLayout(){
    

    return (
        <> 
            <NavBar />
            <div style={{minHeight : '100vh'}}>
                <Outlet/>
            </div>
            <PageFooter/>
        </>
    )
}
