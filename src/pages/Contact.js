import "./Pages.css"


export default function Contact(){


    return (
        <>
            <div style={{width : '100%'}}>
                <div className="content">
                    <h1 className="contact-title">CONTACTO</h1>
                    <div className="contact-content">
                        <h2 className="contact-subtitle">NAILED BY ANA</h2>
                        <p className="contact-description">Precisas de ajuda ou queres saber mais sobre as nossas joias? Fala connosco — teremos todo o gosto em responder. </p>
                    </div>
                    <div className="contact-content">
                         <i style={{marginRight : '5px'}} className="pi pi-facebook" />
                        <a className="contact-link" target="_blank" href="https://www.facebook.com/profile.php?id=61571734991010">Facebook</a>
                    </div>
                    <div className="contact-content">
                        <i style={{marginRight : '5px'}} className="pi pi-instagram" />
                        <a className="contact-link" target="_blank" href="https://www.instagram.com/naiiledbyana">Instagram</a>
                    </div>
                    <div style={{marginTop : '30px'}} className="contact-content">
                            <a style={{textDecoration : 'none'}} className="contact-link" href="mailto:nailedbana@gmail.com"><i style={{marginRight : '10px'}} className="pi pi-envelope"/>nailedbana@gmail.com</a>
                            <p className="contact-link">Número de telefone: 962864713</p>
                    </div>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12319.977107998182!2d-8.202152!3d39.469458!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd186c3f21d9095b%3A0xe44ed2688157d2ab!2sRua%20Dom%20Lopo%20de%20Almeida%2C%20Abrantes%2C%20Portugal!5e0!3m2!1spt-PT!2sus!4v1761868156499!5m2!1spt-PT!2sus" width="1000" height="350" style={{border: '0'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>  
        </>
    )
}
