import { Link } from "react-router-dom"
import "./NavBar.css"
import { useState, useEffect, useRef } from "react"


export default function NavBarComponent(){

    const [toggle, setToggle] = useState(false)
    const navContentRef = useRef(null);

    // Close navbar if user clicks/touches outside
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
        
        <>  <div className="hide">
            
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
            </div>
            <div className="visi">
                 <div ontouch onMouseLeave={() => setToggle(false)} ref={navContentRef} id="navBarContent" className={toggle ? "nav-bar-mobile-content-visible" : "nav-bar-mobile-content-hidden"}>
                    <div className="nav-bar-inner-content-div">
                        <Link onClick={() => setToggle(false)} to={"/"} className="nav-link">Inicio</Link>
                        <Link onClick={() => setToggle(false)} to={"products"} className="nav-link">Produtos</Link>
                        <Link onClick={() => setToggle(false)} to={"about"} className="nav-link">Sobre nós</Link>
                        <Link onClick={() => setToggle(false)} to={"contact"} className="nav-link">Contacto</Link>
                    </div>
                </div>
    
                <div id="navBarMobile" className="nav-bar-mobile-div">
                    <div className="nav-bar-inner-mobile-div">
                        <div className="by-ana-div">
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
