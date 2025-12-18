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
import NavBarMobile from "./NavBarMobile";

export default function NavBarDesktop(){

    
    const navigate = useNavigate()
    
    const {user, logged} = ValidadeSession()
    const { cart } = useCart()

useEffect(() => {

}, [user])


   
  
    return (
        
        <> 
        
            
            <div id="navbar" className="nav-bar-div">
                <div className="nav-bar-inner-div">
                    <div onClick={() => navigate("/")} className="by-ana-div">
                        <h1  className="by-ana">BY ANA.</h1>
                    </div>
                    <div className="link-div">
                        <Links/>
                    </div>
                    {logged ? <UserAvatar permission={user.permission} user={user} image={"./assets/user-default.png"}/> : ''}
                </div>
                <div id="navBarScroll" className="nav-bar-div nav-bar-hidden">
                        <div className="nav-bar-inner-div">
                        <div onClick={() => navigate("/")} className="by-ana-div">
                            <h1 className="by-ana">BY ANA.</h1>
                        </div>
                        <div className="link-div">
                            <Links/>
                        </div>
                        {logged ? <UserAvatar user={user} image={"./assets/user-default.png"}/> : ''}
                    </div>  
                   </div>
                </div>

 
        </>
    )


}
