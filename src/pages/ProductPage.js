import ProductTemplate from "../components/ProductTemplate";
import { useProducts } from "../hooks/useProducts";
import FullscreenLoading from "../components/Loading";
import { useEffect, useState } from "react";
import "./Pages.css"




export default function ProductPage(props){
    
    const { products, types ,loading, error } = useProducts();
    const [productsFilter, setProductsFilter] = useState([])



    useEffect((e) => {
        setProductsFilter(products)
    }, [products])

    const filter = (type) => {
        let temp = []
        let all =  document.getElementById('0')
        products.map((item) => {
            let button =  document.getElementById(item.type)
            if(type === 0){
                temp = products
                button.classList.remove("filter-button-active")

            }
            else {
                if(item.type === type.type_id)
                {
                    button.classList.add("filter-button-active")
                    temp.push(item)
                    
                }
                else {
                    button.classList.remove("filter-button-active")
                }
            }
        })
        if(type === 0){
            all.style.display = 'none'
        }
        else {
            all.style.display = ''
        }

        setProductsFilter(temp)

    }





    if (loading) return <FullscreenLoading/>;

        return (
                <>
                <h1 style={{fontSize : '50px', textAlign : 'center', fontWeight : 'lighter'}}>Produtos</h1>
                <div style={{textAlign : 'center'}}>
                    <button style={{display : 'none'}} className="filter-button" id={0} onClick={() => filter(0)}>Todos</button>
                    {types.map((e) => <button className="filter-button" id={e.type_id} onClick={() => filter(e)}>{e.type}</button>)}
                    <br/>
                    <br/>
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
                                product={item}
                                />
                        ) )}
                        </div>

                       

                </>
        )
            
    

    
}
