import "./Pages.css";
import "../components/shared/NavBar.css"
import { HomeBanner } from "../components/HomeBanner";
import ProductCarrousel from "../components/ProductCarousel";
import FullscreenLoading  from '../components/Loading'
import { useProducts } from "../services/ProductProvider";
import Banner from "../components/Banner";


function Home(){
    
    const { products ,loading } = useProducts()

    if (loading) return <FullscreenLoading/>;


    
    return (
        <>  
        <HomeBanner/>
        <Banner promo={"10% OFF"} description={"Em compras iguais ou superiores a 45 Euros"} extra={"Promoção válida entre 15/11 e 30/11"}/>
        <ProductCarrousel title="Novidades" data={products}/>
        <br/>
        <br/>
        <br/>

        </>
    )
}


export default Home;
