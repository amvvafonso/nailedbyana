import { Link } from "react-router-dom"
import "./Footer.css"

export default function PageFooter(){
    return (
        <>
            <div className="main-footer-div">
                <div className="content-div">
                    <div>
                        <h2 className="footer-title">BY ANA</h2>
                    </div>
                    <div>
                        <h2 className="footer-title">INFORMAÇÃO</h2>
                    </div>
                    <div >
                        <h2 className="footer-title">LOJA</h2>
                        <div style={{display : 'grid'}}>
                            <Link className="footer-content" to={"about"} >Sobre nós</Link>
                            <Link className="footer-content" to={"contact"} >Contacto</Link>
                            </div>
                    </div>
                    <div>
                        <h2 className="footer-title">ONDE NOS ENCONTRAR</h2>
                        <p className="footer-content">Rua Dom Lôpo de Almeida, CC <br/>MILLENIUM. Loja 2.3 2200-281, Abrantes</p>
                    </div>
                </div>
            </div>
        </>
    )
}
