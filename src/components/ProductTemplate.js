import "../styles/ProductTemplate.css";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import API_URL from "../config";
import { Toast } from 'primereact/toast';
import { useRef } from "react";
import { Cart, useCart } from "../services/Cart";
import {  useNavigate } from "react-router-dom";
import { InputNumber } from 'primereact/inputnumber';

export default function ProductTemplate( {product} ) {

  const toast = useRef(null);

  const { cart, setCart } = useCart()
  const navigate = useNavigate()

  const handleClick = () => {
    try {
      if(product.state == 1){
        navigate(`/item/${product.product_id}`)
      }
      else {
          toast.current.show({severity:'error', summary: 'Produto', detail:'O produto encontra-se indisponível', life: 1000});
      }

    }
    catch(es){
        toast.current.show({severity:'error', summary: 'Produto', detail:'Ocorreu um problema na seleção do produto.', life: 1000});
    }
  }


  return (
    <>
      <Toast ref={toast} />
      <div onClick={handleClick}  className="product-outer-div">
        <div className="product-image-div">
          <img style={{opacity : product.state == 1 ? '1' : '0.4'}} alt={product.name} className="product-image" src={product.image} />
        </div>
        <div className="product-description-div">
          <p className="product-title">
            {product.name}
            <br />
            <span className="product-price">{product.state == 1 ? <>Desde {product.price}€</> : <><span style={{color : 'red'}}>Indisponível</span></>}</span> 
          </p>
        </div>
      </div>
    </>
  );
}
