import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"
import { useState, useEffect, useRef } from "react"
import { useProducts } from "../../services/ProductProvider";
import Dropdown from '../Dropdown'
import { ValidadeSession } from "../../hooks/useSession";
import UserAvatar from "../Avatar";
import Logout from "../Logout";
import { useCart } from "../../services/Cart";
import Links from "./Links";


export default function NavBarMobile(){

    const {user, logged} = ValidadeSession()
    const { collection } = useProducts()
    const [toggle, setToggle] = useState(false)
    const navContentRef = useRef(null);
    const navigate = useNavigate()

    const { cart} = useCart()

    useEffect(() => {
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
        <>
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
        
                        
                        {!logged ? <>
                        <Link onClick={() => setToggle(false)} to={"login"} className="nav-link">Login</Link></> : <><Link onClick={() => setToggle(false)} to={"cart"} className="nav-link" >Carrinho <i className="pi pi-shopping-cart "/></Link><Link onClick={() => setToggle(false)} className="nav-link" to={"/"}>Perfil</Link> <Logout onClick={() => setToggle(false)}/>
                            
                            </>}
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
        </>
    )
}
