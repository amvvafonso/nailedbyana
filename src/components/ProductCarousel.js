import { Carousel } from "primereact/carousel";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or another theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ProductTemplate from "./ProductTemplate";
import { useState } from "react";

export default function ProductCarrousel(props) {
  const [width, setWidth] = useState(window.screen.width)
  const products = props.data


  return (
    <>
      <div className="carousel-div">
        {products ? (
          <>
            <h1
              className="carousel-title"
            >
              {props.title}
            </h1>

            <Carousel
              showIndicators={false}
              numVisible={width > 600 ? 3 : 2}
              numScroll={1}
              value={products}
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
