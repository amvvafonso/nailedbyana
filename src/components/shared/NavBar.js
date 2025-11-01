import "./NavBar.css"
import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import 'primeicons/primeicons.css';
import NavBarComponent from "./NavBarComponent";


function scrollFunction() {
            if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
                document.getElementById("navBarScroll").classList.remove("nav-bar-hidden")
                document.getElementById("navBarScroll").classList.add("nav-bar-visible")
            } 
            else {
                document.getElementById("navBarScroll").classList.add("nav-bar-hidden")
                document.getElementById("navBarScroll").classList.remove("nav-bar-visible")
            }
        
        } 



function NavBar(){
    


    useEffect(() => {
        window.onscroll = function() {scrollFunction()};

    })

    return (
        <>
            
            <NavBarComponent/>
            

        </>
    )
}


export default NavBar;
