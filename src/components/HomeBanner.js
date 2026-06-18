import { Link } from 'react-router-dom'
import '../styles/HomeBanner.css'
import API_URL from '../config'

export function HomeBanner(){
    return (
        <>
            <div className="home-banner-div">
                    <div className='home-banner-inner-div'>
                            <div className='banner-title-div'>
                                <h1 className='banner-title'>Para usar hoje, amanhã e sempre.</h1>
                                <p className='banner-description'>Torna cada saída uma ocasião. </p>
                                <Link to={"/collection"} ><button className='banner-button'>Conhecer catálogo</button></Link>   
                            </div>
                            <div className='banner-image-div'>
                                <img alt='banner' className='banner-image'  src={API_URL+ '/assets/earing.webp'}/>
                            </div>
                    </div>
            </div>
        </>
    )
}
