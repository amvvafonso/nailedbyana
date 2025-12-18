import '../styles/Banner.css'

export default function Banner(content){



    return (
        <>
            <div className="banner-outer-div">
                <div className='banner-inner-div'>
                    <div className='banner-promo-div'>
                        <p className='banner-promo'>{content.promo}</p>
                    </div>
                    <div className='banner-description-div'>
                        <p className='promo-description'>{content.description}</p>
                        <p className='banner-extra'>{content.extra}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
