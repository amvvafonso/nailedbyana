import { useNavigate } from 'react-router-dom'
import API_URL from '../../config'
import { LoadingComponent } from '../../components/Loading'
import './Auth.css'
import { useState } from 'react'

export default function Register(){
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e) => {
        const alert = document.getElementById("status");
        try {
            e.preventDefault()
            setLoading(true)
                

            const form = document.getElementById("register-form");

            const formData = new FormData(form);

            const result = await fetch(`${API_URL}/server/?action=register`, {
                    body : formData,
                    method : "post",
                    credentials: "include",  
                }).then(Response => Response.json())

            
            console.log(result)
            setLoading(false)
            if(result.status){
                navigate("/")
            }
            else {
                if(result.userExists){
                    alert.innerHTML = "Já existe uma conta com esse email!"
                }
            }
        }
        catch(es){
            alert.innerHTML = "Ocorreu um problema no processo de registo, por favor tente mais tarde"
        }
    }
    
    if (loading){
        return <LoadingComponent/>
    }


    return (
        <> 
            <div id='login' className='input-div'>
                <h1>Login</h1>
                <p style={{fontSize : '15px', color : 'red'}} id='status'></p>
                <form onSubmit={handleSubmit} id='register-form' method='POST'>
                    <p>Email</p>
                    <input type='email' id='email' name='email' placeholder='Enter email' />
                    <p>Username</p>
                    <input type='text' id='name' name='name' placeholder='Name' />
                    <p>Username</p>
                    <input type='text' id='user' name='user' placeholder='Enter username' />
                    <p>Password</p>
                    <input type='password' id='password' name='password' placeholder='Enter password' />
                    <button  type='submit'>Register</button>
                </form>
            </div>
        </>
    )
}
