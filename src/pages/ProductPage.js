import ProductTemplate from "../components/ProductTemplate";
import { useProducts } from "../hooks/useProducts";
import FullscreenLoading from "../components/Loading";
import { ToggleButton } from 'primereact/togglebutton'
import { useEffect, useState } from "react";
export default function ProductPage(props){
    
    const { products, types ,loading, error } = useProducts();
    const [productsFilter, setProductsFilter] = useState([])




    useEffect((e) => {
        setProductsFilter(products)
    }, [products])

    const filter = (type) => {
        let temp = []
        products.map((item) => {
            if(item.type === type.type_id)
            {
                temp.push(item)
            }
        })
        setProductsFilter(temp)

    }





    if (loading) return <FullscreenLoading/>;

        return (
                <>
                <h1 style={{fontSize : '50px', textAlign : 'center', fontWeight : 'lighter'}}>Produtos</h1>
                <div style={{textAlign : 'center'}}>
                    {types.map((e) => <button onClick={() => filter(e)}>{e.type}</button>)}
                    </div>
                <div
                        style={{
                            width: "90%",                  // container width
                            maxWidth: "1200px",
                            margin: "auto",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                            justifyItems: "center",       // center items in each grid cell
                        }}
                        >
                        {productsFilter.map((item) => ( 
                                <ProductTemplate
                                key={item.id}
                                title={item.name}
                                image={item.image}
                                price={item.price + "€"}
                                />
                            
                        ) )}
                        </div>

                </>
        )
            
    

    
}
