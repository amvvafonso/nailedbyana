import ProductCarrousel from "../components/ProductCarousel";


export default function Tests(){

        const test = [
                {"name":"John", "preco" : 23},
                {"name":"John", "preco" : 23},
                {"name":"John", "preco" : 23},
                {"name":"John", "preco" : 23},
                {"name":"John", "preco" : 23},
        ]
    return (
        <>
            <ProductCarrousel title="Novidades" data={test}/>
        </>
    )
}
