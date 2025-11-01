import { Link } from "react-router-dom"
import "./NavBar.css"



export default function NavBarComponent(){

    return (
        <>
            <div id="navbar" className="nav-bar-div">
                <div className="nav-bar-inner-div">
                    <div className="by-ana-div">
                        <h1 className="by-ana">BY ANA.</h1>
                    </div>
                    <div className="link-div">
                        <Link className="nav-link" to={"/"} style={{textDecoration : 'none'}}>Inicio</Link>
                        <Link className="nav-link" to={"products"} style={{textDecoration : 'none'}}>Produtos</Link>
                        <Link className="nav-link" to={"about"} style={{textDecoration : 'none'}}>Sobre nós</Link>
                        <Link className="nav-link" to={'contact'} style={{textDecoration : 'none'}}>Contacto</Link>
                    </div>
                </div>
                <div id="navBarScroll" className="nav-bar-div nav-bar-hidden">
                        <div className="nav-bar-inner-div">
                        <div className="by-ana-div">
                            <h1 className="by-ana">BY ANA.</h1>
                        </div>
                        <div className="link-div">
                            <Link className="nav-link" to={"/"} style={{textDecoration : 'none'}}>Inicio</Link>
                            <Link className="nav-link" to={"products"} style={{textDecoration : 'none'}}>Produtos</Link>
                            <Link className="nav-link" to={"about"} style={{textDecoration : 'none'}}>Sobre nós</Link>
                            <Link className="nav-link" to={'contact'}  style={{textDecoration : 'none'}}>Contacto</Link>
                        </div>
                    </div>
                    
                   </div>
                </div>
        </>
    )


}
