import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"
import { useState, useEffect, useRef } from "react"
import { useProducts } from "../../services/ProductProvider";
import Dropdown from '../Dropdown'
import { ValidadeSession } from "../../hooks/useSession";
import UserAvatar from "../Avatar";
import Logout from "../Logout";
export default function NavBarComponent(){

    const [toggle, setToggle] = useState(false)
    const navContentRef = useRef(null);
    const navigate = useNavigate()
    const { collection } = useProducts()
    const {user, logged} = ValidadeSession()

    // Close navbar if user clicks/touches outside
    useEffect(() => {
        console.log(user)
    const handleOutsideClick = (e) => {
        if (navContentRef.current && !navContentRef.current.contains(e.target)) {
        setToggle(false);
        }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        document.removeEventListener("touchstart", handleOutsideClick);
    };
    }, []);


    const toggleNav = (e) => {
        if(!toggle){
            setToggle(true)
        }
        else {
            setToggle(false)
        }
    }
   


  
    return (
        
        <>  <div className="hide">
            
            <div id="navbar" className="nav-bar-div">
                <div className="nav-bar-inner-div">
                    <div onClick={() => navigate("/")} className="by-ana-div">
                        <h1  className="by-ana">BY ANA.</h1>
                    </div>
                    <div className="link-div">
                        <Link className="nav-link" to={"/"} style={{textDecoration : 'none'}}>Inicio</Link>
                        {collection ? <><Link className="nav-link" to={"collection"} style={{textDecoration : 'none'}}>{collection}</Link></> : ''}
                        <Dropdown label="Artigos">
                            <Link to={"rings"}>Aneis</Link>
                            <Link to={"earings"}>Brincos</Link>
                            <Link to={"necklace"}>Colares</Link>
                            <Link to={"set"}>Conjuntos</Link>
                            <Link to={"bracelets"}>Pulseiras</Link>
                        </Dropdown>
                        <Link className="nav-link" to={"about"} style={{textDecoration : 'none'}}>Sobre nós</Link>
                        <Link className="nav-link" to={'contact'} style={{textDecoration : 'none'}}>Contacto</Link>
                        {/*!logged ? <><Link className="nav-link" to={"login"} style={{textDecoration : 'none', marginLeft : '50px'}}>Login</Link>
                            {<Link className="nav-link" to={'register'} style={{textDecoration : 'none'}}>Registar</Link>}}</> : ''*/}
                    </div>
                    {logged ? <UserAvatar permission={user.permission} user={user} image={"./assets/user-default.png"}/> : ''}
                </div>
                <div id="navBarScroll" className="nav-bar-div nav-bar-hidden">
                        <div className="nav-bar-inner-div">
                        <div onClick={() => navigate("/")} className="by-ana-div">
                            <h1 className="by-ana">BY ANA.</h1>
                        </div>
                        <div className="link-div">
                            <Link className="nav-link" to={"/"} style={{textDecoration : 'none'}}>Inicio</Link>
                            {collection ? <><Link className="nav-link" to={"collection"} style={{textDecoration : 'none'}}>{collection}</Link></> : ''}
                            <Dropdown label="Loja Online">
                                <Link to={"rings"}>Aneis</Link>
                                <Link to={"earings"}>Brincos</Link>
                                <Link to={"necklace"}>Colares</Link>
                                <Link to={"set"}>Conjuntos</Link>
                                <Link to={"bracelets"}>Pulseiras</Link>
                            </Dropdown>
                            <Link className="nav-link" to={"about"} style={{textDecoration : 'none'}}>Sobre nós</Link>
                            <Link className="nav-link" to={'contact'}  style={{textDecoration : 'none'}}>Contacto</Link>
                            {/*!logged ? <><Link className="nav-link" to={"login"} style={{textDecoration : 'none', marginLeft : '50px'}}>Login</Link>
                            {<Link className="nav-link" to={'register'} style={{textDecoration : 'none'}}>Registar</Link>}}</> : ''*/}
                    </div>
                    {logged ? <UserAvatar user={user} image={"./assets/user-default.png"}/> : ''}
                    </div>
                   </div>
                </div>
            </div>
            <div className="visi">
                 <div ontouch onMouseLeave={() => setToggle(false)} ref={navContentRef} id="navBarContent" className={toggle ? "nav-bar-mobile-content-visible" : "nav-bar-mobile-content-hidden"}>
                    <div className="nav-bar-inner-content-div">
                        <Link onClick={() => setToggle(false)} to={"/"} className="nav-link">Inicio</Link>
                        <Link onClick={() => setToggle(false)} to={"collection"} className="nav-link">{collection}</Link>
                        <Dropdown label={"Artigos"}>
                                <Link onClick={() => setToggle(false)} to={"rings"}>Aneis</Link>
                                <Link onClick={() => setToggle(false)} to={"earings"}>Brincos</Link>
                                <Link onClick={() => setToggle(false)} to={"necklace"}>Colares</Link>
                                <Link onClick={() => setToggle(false)} to={"set"}>Conjuntos</Link>
                                <Link onClick={() => setToggle(false)} to={"bracelets"}>Pulseiras</Link>
                        </Dropdown>
                        <Link onClick={() => setToggle(false)} to={"about"} className="nav-link">Sobre nós</Link>
                        <Link onClick={() => setToggle(false)} to={"contact"} className="nav-link">Contacto</Link>
        
                        
                        {/*!logged ? <><Link onClick={() => setToggle(false)} to={"login"} className="nav-link">Login</Link></> : <><Link onClick={() => setToggle(false)} className="nav-link" to={"/"}>Perfil</Link> <Logout onClick={() => setToggle(false)}/></>*/}
                    </div>
                </div>
    
                <div id="navBarMobile" className="nav-bar-mobile-div">
                    <div className="nav-bar-inner-mobile-div">
                        <div onClick={() => navigate("/")} className="by-ana-div">
                            <h1 className="by-ana">BY ANA.</h1>
                        </div>
                        <div className="toggle-button-div">
                            <i onClick={toggleNav} className="pi pi-bars toggle"/>
                        </div>
                    </div>
                    
                </div>
               
                <div id="navBarMobileScroll" className="nav-bar-mobile-div nav-bar-hidden">
                    <div className="nav-bar-inner-mobile-div">
                        <div className="by-ana-div">
                            <h1 className="by-ana">BY ANA.</h1>
                        </div>
                        <div className="toggle-button-div">
                            <i onClick={toggleNav} className="pi pi-bars toggle"/>
                        </div>
                    </div>
                </div>
               
        </div>
        </>
    )


}
