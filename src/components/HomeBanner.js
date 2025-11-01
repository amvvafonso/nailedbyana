import './Components.css'
import {Image} from 'primereact/image'
export function HomeBanner(){



    return (
        <>
            <div className="home-banner-div">
                    <div className='home-banner-inner-div'>
                            <div className='banner-title-div'>
                                <h1 className='banner-title'>Para usar hoje, amanhã e sempre.</h1>
                                <p className='banner-description'>Torna cada saída uma ocasião. </p>
                                <button className='banner-button'>Reserva já</button>   
                            </div>
                            <div className='banner-image-div'>
                                <img className='banner-image'  src='../assets/earing.webp'/>
                            </div>
                    </div>
            </div>
        </>
    )
}
