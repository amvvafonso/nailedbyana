import { useEffect } from "react"
import API_URL from "../config"
import "../styles/BackofficeProductCard.css"
import { DeferredContent } from "primereact/deferredcontent"
import { BiEdit } from "react-icons/bi";
import { Tooltip } from "primereact/tooltip";
import { ConfirmDialog } from "primereact/confirmdialog";
export default function BackofficeProductCard({ product, type, deleteItem, editItem }){
    return(
        <>
        <DeferredContent>
            <div className="product-card-main-div">
                
                    <img className="product-card-image" src={API_URL + product.productImage}/>
                
                <div className="product-card-info-div">
                    <div>
                        <p className="product-card-type">{type?.name}</p>
                        <p className="product-card-name">{product?.name}</p>
                        <p className="product-card-type">SN: {product?.product_id}</p>
                    </div>
                    <div>
                        <p className="product-card-price">{product?.price}€</p>
                        <p className="product-card-stock">{product?.total_stock} em stock</p>
              </div>
              <div className="edit-div">
                <i onClick={() => editItem(product)} title="Editar" className="product-card-btn pi pi-pencil" />
                <i onClick={() => deleteItem(product)} title="Eliminar" className="product-card-btn pi pi-trash" />
              </div>
            </div>
            </div>
            </DeferredContent>
        </>
    )
}
