import "./Components.css"


export default function ProductTemplate(props){
    
    return (
        <>     
                <div className="product-outer-div">
                    <div className="product-image-div">
                        <img alt="Product" style={{width : '100%', height : '100%'}} src={props.image}/>
                    </div>
                    <div className="product-description-div">
                        <p className="product-title">{props.title}<br/><span className="product-price">{props.price}</span></p>
                    </div>
                </div>
        </>
    )
}



