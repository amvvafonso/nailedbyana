import API_URL from '../../config'
import { useNavigate } from 'react-router-dom'
import './Auth.css'
import { ValidadeSession } from '../../hooks/useSession'
import { useCart } from '../../services/Cart'



export default function Login(){

    const navigate = useNavigate()
    const {user, logged} = ValidadeSession()
    const { setCart} = useCart()
    if(logged) navigate("/")


    const handleSubmit = async (e) => {
        const alert = document.getElementById("status");
        try {
        e.preventDefault();
        const redirect = localStorage.setItem("redirect_after_login", window.location.pathname + window.location.search)

        const form = document.getElementById("login-form");

        const formData = new FormData(form);

        const result = await fetch(`${API_URL}/server/?action=authenticate`, {
                body : formData,
                method : "post",
                credentials: "include",  
            }).then(Response => Response.json())

        if(result.success){
            if(redirect){
                navigate(redirect)
                setCart([])
            }
            else {
                navigate("/")
            }
            
        }
        else {
            alert.innerHTML = result.response
        }
        }
        catch(Ex){
            alert.innerHTML = "Ocorreu um problema na autenticação. Por favor tente mais tarde ou entre em contacto por geral@nailedbyana.pt"
        }
    }
    

    return (
        <> 
            <div className='input-div'>
                <h1>Login</h1>
                <p style={{fontSize : '15px', color : 'red'}} id='status'></p>
                <form onSubmit={handleSubmit} id='login-form' method='POST'>
                    <p>Email</p>
                    <input type='email' id='email' name='email' placeholder='Enter email' />
                    <p>Password</p>
                    <input type='password' id='password' name='password' placeholder='Enter password' />
                    <button type='submit'>Login</button>
                </form>
            </div>
        </>
    )
}
