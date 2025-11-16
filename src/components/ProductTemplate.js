import "./Components.css";
import { useState } from "react";
import { Dialog } from "primereact/dialog";

export default function ProductTemplate({ product }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div onClick={() => setVisible(true)}  className="product-outer-div">
        <div className="product-image-div">
          <img style={{opacity : product.state === 'AVAILABLE' ? '1' : '0.4'}} alt={product.name} className="product-image" src={product.image} />
        </div>
        <div className="product-description-div">
          <p className="product-title">
            {product.name}
            <br />
            <span className="product-price">{product.state === 'AVAILABLE' ? <>{product.price}€</> : <><span style={{color : 'red'}}>{product.state}</span></>}</span>
          </p>
        </div>
      </div>

      <Dialog
        style={{paddingTop : '40px',backgroundColor : 'white'}}
        showHeader={false}
        closeOnEscape
        draggable={false}
        visible={visible}
        className="dialog-div"
        onHide={() => setVisible(false)}
      >
        <i onClick={() => setVisible(false)} style={{position : 'absolute', right : '10px', top : '10px', cursor : 'pointer'}} className="pi pi-times"/>
        <div className="outer-div">
          <div className="image-div">
            <img alt={product.name} style={{ width: "100%" }} src={product.image} />
          </div>

          <div className="product-div">
            <h1 className="dialog-title">{product.name}. <i style={{fontSize : '20px'}}>{product.collection_name} - {product.year}</i></h1>
            
            <p style={{fontSize : '15px', color : product.state==='AVAILABLE' ? 'green' : 'red'}}>{product.state}</p>

            <p style={{fontSize : '16px'}}>
              As compras no nosso site estão temporariamente indisponíveis.
              Pode visitar a loja física ou contactar-nos através das redes sociais
              <br/>
              <a
                style={{ textDecoration: "none", color: "#666", fontWeight: "bold" }}
                rel="noreferrer"
                target="_blank"
                href="https://ig.me/m/naiiledbyana?text=Hello"
              >
                 @naiiledbyana
              </a> ou <a
                style={{ textDecoration: "none", color: "#666", fontWeight: "bold" }}
                rel="noreferrer"
                target="_blank"
                href="https://www.facebook.com/p/Nailed-By-Ana-61571734991010/"
              >
                 Nailed by Ana
              </a>.
            </p>

            <p className="dialog-price">{product.price}€</p>

            <br />

            <button disabled className="dialog-button">
              <i
                className="pi pi-shopping-bag"
                style={{ marginRight: "10px", fontSize: "16px" }}
              />
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
