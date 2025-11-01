import { Carousel } from "primereact/carousel";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or another theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ProductTemplate from "./ProductTemplate";

export default function ProductCarrousel(props) {
  return (
    <>
      <div style={{ width: "60%", margin: "auto" }}>
        {props.data ? (
          <>
            <h1
              style={{
                textAlign: "center",
                fontSize: "40px",
                fontWeight: "lighter",
                fontFamily: "Cormorant-Regular",
              }}
            >
              {props.title}
            </h1>

            <Carousel
              showIndicators={false}
              numVisible={3}
              numScroll={1}
              value={props.data}
              circular
              autoplayInterval={10000}
              itemTemplate={(item) => (
                <ProductTemplate
                  title={item.name}
                  image={item.image}
                  price={item.price + "€"}
                  type={item.type}
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
