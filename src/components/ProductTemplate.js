import "./Components.css"
import { useState } from "react"
import { Dialog } from 'primereact/dialog'

export default function ProductTemplate(product){
    
    const [visible, setVisible] = useState(false)

    const selected = product.product

    return (
        <>    
                <div onClick={() => setVisible(true)} className="product-outer-div">
                    <div className="product-image-div">
                        <img alt="Product" style={{width : '100%', height : '100%'}} src={selected.image}/>
                    </div>
                    <div className="product-description-div">
                        <p className="product-title">{selected.name}<br/><span className="product-price">{selected.price}</span></p>
                    </div>
                </div>
                 <Dialog closeOnEscape draggable={false} visible={visible} style={{ width: '70vw'}} onHide={() => {if (!visible) return; setVisible(false); }}>
                        <div className="outer-div">
                            <div className="image-div">  
                                <img style={{width : '100%'}} src={selected.image} />
                            </div>
                            <div className="product-div">
                                <h1 className="dialog-title">{selected.name}</h1>
                                <p>{selected.state}</p>
                                <p>De momento, não é possível reservar online! <br/> Caso deseja reservar envie mensagem privada para <a style={{textDecoration : 'none', color : '#666', fontWeight : 'bold'}} target="_blank" href="https://ig.me/m/naiiledbyana?text=Hello">@naiiledbyana</a>.</p>
                                <p className="dialog-price">{selected.price}€</p>
                                
                                <br/>
                                <button disabled onClick={(e) => e.preventDefault()} className="dialog-button"><i className="pi pi-shopping-bag" style={{marginRight : '10px', fontSize : '16px'}}/>Adicionar ao carrinho</button>
                            </div>
                        </div>
                </Dialog>
        </>
    )
}



