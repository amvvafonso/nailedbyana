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
        <ProductCarrousel title="Novidades" data={products}/>
        <br/>
        <br/>
        <br/>

        </>
    )
}


export default Home;
