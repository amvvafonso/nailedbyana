import "./Pages.css"

export default function About(){
    return (
        <>
            <div style={{minHeight : '100vh !important'}} id="about" className="content">
                <div className="about-outer-div">
                    <div className="about-image-div">
                        <img alt="about" className="about-image" src="./assets/about.webp" />
                    </div>
                    <div className="about-description-div">
                        <h1 className="about-title">BY ANA.</h1>
                        <p className="about-description">
                             O meu nome é <strong>Ana Morgado</strong> e sou esteticista. Sempre fui apaixonado pelo mundo da joalharia, e em Janeiro de 2025 decidi juntar estes dois mundos que me dizem tanto - daí criar a minha própria marca.
                             <br/>

                            A nossa marca nasceu como <strong>NAILED BY ANA.</strong>, inspirada no meu trabalho como esteticista. Contudo, senti necessidade de criar um espaço que refletisse apenas o universos das joias. 
                            Assim surgiu <strong>BY ANA.</strong> a extensão mais delicada e refinada da minha marca - é um reflexo do meu caminho, um toque do meu gosto e um amor incansável por tudo aquilo que nos torna mais confiantes.
                            <br/>

                            Na nossa loja zelamos pela qualidade e elegância, escolhemos as nossas peças a dedo e criamos as nossas coleções garantindo ter os produtos mais bonitos, versáteis e desejáveis. Para isso, os nossos produtos são todos feitos a partir de Aço inoxidável, que é um material que se  destaca por ser resistente à água, ao suor e ao uso contínuo. Não oxida, não escurece facilmente e mantém o acabamento ao longo do tempo - ideal para quem quer usar as suas joias com confiança, no quotidiano ou em ocasiões especiais.
                            <br/>

                            Acreditamos que a elegância deve ser vivida, não guardada. <br/>
                            Obrigada por fazerem parte desta história.

                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
