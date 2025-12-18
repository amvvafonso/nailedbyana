import { Link } from "react-router-dom"
import "./NavBar.css"
import { useProducts } from "../../services/ProductProvider";
import Dropdown from '../Dropdown'
import { ValidadeSession } from "../../hooks/useSession";
import { useCart } from "../../services/Cart";



export default function Links(){
    const { cart } = useCart()
    const { collection } = useProducts()
    const {logged} = ValidadeSession()
    return (
        <>
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
                         {/*logged ? <><Link className="nav-link" to={'cart'}  style={{textDecoration : 'none'}}><i className="pi pi-shopping-cart" /> Carrinho {cart.length ? cart.length : 0}</Link></> : ''}
                        {!logged ? <><Link className="nav-link" to={"login"} style={{textDecoration : 'none', marginLeft : '50px'}}>Login</Link>
                            {<Link className="nav-link" to={'register'} style={{textDecoration : 'none'}}>Registar</Link>}</> : ''*/}
        </>
    )
}
