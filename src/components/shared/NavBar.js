import "./NavBar.css"
import { useEffect } from "react";
import 'primeicons/primeicons.css';
import NavBarDesktop from "./NavBarDesktop";
import NavBarMobile from "./NavBarMobile";


function scrollFunction() {
            if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
                document.getElementById("navBarScroll").classList.remove("nav-bar-hidden")
                document.getElementById("navBarScroll").classList.add("nav-bar-visible")
                document.getElementById("navBarMobileScroll").classList.remove("nav-bar-hidden")
                document.getElementById("navBarMobileScroll").classList.add("nav-bar-visible")
            } 
            else {
                document.getElementById("navBarScroll").classList.add("nav-bar-hidden")
                document.getElementById("navBarScroll").classList.remove("nav-bar-visible")
                document.getElementById("navBarMobileScroll").classList.add("nav-bar-hidden")
                document.getElementById("navBarMobileScroll").classList.remove("nav-bar-visible")
            }
        
        } 



function NavBar(){
    


    useEffect(() => {
        window.onscroll = function() {scrollFunction()};

    })

    return (
        <>
        <div className="hide">
            <NavBarDesktop/>
        </div>
             <div className="visi">
                <NavBarMobile/>           
            </div>
        </>
    )
}


export default NavBar;
