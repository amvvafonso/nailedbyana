import { Carousel } from "primereact/carousel";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or another theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ProductTemplate from "./ProductTemplate";
import { useEffect, useState } from "react";

export default function ProductCarrousel(props) {

  const [width ] = useState(window.screen.width)
  const products = props.data
  const [randomProducts, setRandomProducts] = useState([])
  
  const random = () => {
    try {
    const number = []
    for(let i =0; i < 8; i++){
        const used =[]
        if(i === products.length) {
          break
        }
        let current = Math.floor(Math.random() * products.length)
        if(!used.includes(current) && products[current].state == 1){
            number.push(products[current])
            used.push(current)
        }
        
      }
    
      setRandomProducts(number)
      console.log(number)
    }
    catch(Exce){
      console.log(Exce)
    }
  }

  useEffect(() =>  {
      random()
  }, [])

  return (
    <>
      <div className="carousel-div">
        {randomProducts ? (
          <>
            <h1
              className="carousel-title"
            >
              {props.title}
            </h1>

            <Carousel
              showIndicators={false}
              numVisible={width > 600 ? width > 2000 ? 6 : 4 : 2}
              numScroll={1}
              value={randomProducts}
              circular
              autoplayInterval={10000}
              itemTemplate={(item) => (
                <ProductTemplate
                  product={item}
                />
              )}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
