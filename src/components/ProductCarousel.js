import { Carousel } from "primereact/carousel";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or another theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ProductTemplate from "./ProductTemplate";

export default function ProductCarrousel(props) {

  const products = props.data

  return (
    <>
      <div style={{ width: "60%", margin: "auto" }}>
        {products ? (
          <>
            <h1
              style={{
                textAlign: "center",
                fontSize: "40px",
                fontWeight: "lighter",
                fontFamily: "Cormorant-Regular",
              }}
            >
              {products.title}
            </h1>

            <Carousel
              showIndicators={false}
              numVisible={3}
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
