import "../styles/CartItem.css"
import API_URL from "../config"
import { useCart } from "../services/Cart"
import { confirmDialog } from 'primereact/confirmdialog'; 
import { useRef } from "react";


export default function CartItem(product){
    
    product = product.product
    const { setCart } = useCart()
    const toast = useRef(null);


    const accept = () => {
        removeFromCart(product)     
    }

    const reject = () => {
       
    }

    const confirmRemovable = () => {
        confirmDialog({
            message: `Tem a certeza que deseja retirar o produto ${product.name} do seu carrinho?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            headerStyle : {height : '100px'},
            style: {width : '400px', paddingBottom : '0'},
            accept,
            reject
        });
    };



      const removeFromCart = async (product) => {
            try {
                const form = new FormData()
                form.append("product", JSON.stringify(product))

                const result = await fetch(`${API_URL}/server/?action=removeFromCart`, {
                body: form,
                credentials: 'include',
                method : 'POST'
                }).then((Response) => Response.json())
                
                if(result.success){
                setCart(result.response)
                }
                
            }
            catch(es){
            console.log(es)
            }
        }

    return (
        <>  
            <div className="cart-item-outer-div">
                <div className="cart-item-inner-div">
                    <div className="cart-image-div">
                        <img className="cart-image" src={product.image}/>
                    </div>
                    <div className="cart-info-div">
                        <h1 className="cart-item-title">{product.name} {product.reserveQty}</h1>
                        <p className="cart-item-collection">{product.collection_name}</p>
                        <p className="cart-item-collection">{product.price}€</p>
                        <p className="cart-item-collection">{product.contrast}</p>
                    </div>
                    <div className="cart-item-options">
                        <i onClick={confirmRemovable} className="pi pi-times cart-remove" />
                    </div>
                </div>
            </div>  
        </>
    )
}
