import API_URL from '../../config'
import { useNavigate } from 'react-router-dom'
import './Auth.css'
import { ValidadeSession } from '../../hooks/useSession'



export default function Login(){

    const navigate = useNavigate()
    const {user, logged} = ValidadeSession()
    if(logged) navigate("/")


    const handleSubmit = async (e) => {
        const alert = document.getElementById("status");

        

        try {
        e.preventDefault();


        const form = document.getElementById("login-form");

        const formData = new FormData(form);

        const result = await fetch(`${API_URL}/server/?action=authenticate`, {
                body : formData,
                method : "post",
                credentials: "include",  
            }).then(Response => Response.json())
            console.log(result)
        if(result.status){
            navigate("/")
            
        }
        else {
            alert.innerHTML = "A palavra passe ou o user estão incorretos"
        }
        }
        catch(Ex){
            alert.innerHTML = "Ocorreu um problema na autenticação. Por favor tente mais tarde"
        }
    }
    

    return (
        <> 
            <div className='input-div'>
                <h1>Login</h1>
                <p style={{fontSize : '15px', color : 'red'}} id='status'></p>
                <form onSubmit={handleSubmit} id='login-form' method='POST'>
                    <p>Username</p>
                    <input type='text' id='username' name='username' placeholder='Enter username' />
                    <p>Password</p>
                    <input type='password' id='password' name='password' placeholder='Enter password' />
                    <button type='submit'>Login</button>
                </form>
            </div>
        </>
    )
}
