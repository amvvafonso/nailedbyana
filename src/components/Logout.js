import API_URL from "../config"
import './Components.css'
export default function Logout(){

    const handleLogout = async (e) => {
        try {
            const logout = await fetch(`${API_URL}/server/?action=logout`,
                {
                    credentials : 'include'
                }
            )
            .then(Response => Response.json())

            if(logout.status){
                console.log("success")
            }
            window.location.reload();
           
        }
        catch(es){
            console.log(es)
        }
    }

    return (
        <>
        <button className="logout-navbar-button" onClick={handleLogout}>Logout</button>
        </>
    )
}
