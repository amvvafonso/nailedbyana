import "./Pages.css";
import "../components/shared/NavBar.css"
import { HomeBanner } from "../components/HomeBanner";
import ProductCarrousel from "../components/ProductCarousel";
import { useProducts } from "../hooks/useProducts";
import FullscreenLoading  from '../components/Loading'


function Home(){
    
    const { products ,loading } = useProducts();

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
