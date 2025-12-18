import { Form, Link, useNavigate, useParams } from "react-router-dom";
import API_URL from "../config";
import { useEffect, useState, useRef } from "react";
import FullscreenLoading, { LoadingComponent } from "../components/Loading";
import "../styles/Item.css"
import Contrast from "../components/Contrast";
import { Cart, useCart } from "../services/Cart";
import { Toast } from "primereact/toast";



export default function Item(){

    const { cart, setCart } = useCart()
    const { id } = useParams()
    const [selectedItem, setSelectedItem] = useState()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [imageLoading, setImageLoading] = useState(false)
    const [visible, setVisible] = useState(false);
    const [inCart, setInCart] = useState()
    const [enable, setEnable] = useState(true)
    const toast = useRef()
    const [qty, setQty] = useState(1)
    const nagivate = useNavigate()

    const fetchItem = async (first) => {
        try {
            const res = await fetch(`${API_URL}/server/?action=fetchItem&id=${id}`, {
                method : 'POST'
            }).then((Response) => Response.json())

            if(first){
                setItems(res.response)
                setImageLoading(true)
                setSelectedItem(res.response.find(e => e.state == 1))
                setTimeout(() => {
                    setImageLoading(false)
                }, 500);
                
            }
            else {
                setItems(res.response)
            }
        
            setLoading(false)
        }
        catch(es){
            console.log(es)
        }
    }

    useEffect(() => {
        fetchItem(true)

        const interval = setInterval(( ) => fetchItem(), 5000);

        return () => clearInterval(interval); 

    },[])


    useEffect(() => {
        try {
            setEnable(!cart.some(e => e.item_id == selectedItem.item_id))
        }
        catch(es){
            console.log(es)
        }
    }, [selectedItem, cart])

    const changeContrast = (item) => {
        setImageLoading(true)
        setSelectedItem(item)
        setTimeout(() => {
            setImageLoading(false)
        }, 500);
    }
  

    const addToCart = async (selected) => {
        selected["reserveQty"] = qty
        

        try {
        const form = new FormData();
        form.append("item", JSON.stringify(selected));

        const result = await fetch(`${API_URL}/server/?action=addToCart`, {
            body: form,
            credentials: 'include',
            method: 'POST'
        }).then(res => res.json());


        if(result.success){
            setCart(result.response); 
            setVisible(false)
        } else {
            toast.current.show({severity:'error', summary: 'Carrinho', detail:result.response, life: 1000});
            return
        }

        toast.current.show({severity:'info', summary: 'Produto', detail:'Produto adicionado ao carrinho!', life: 1000});
        }
        catch(es){
            console.log(es)
        }
};

  const removeFromCart = async (selected) => {
    try {
        const form = new FormData()
        form.append("product", JSON.stringify(selected))

        const result = await fetch(`${API_URL}/server/?action=removeFromCart`, {
          body: form,
          credentials: 'include',
          method : 'POST'
        }).then((Response) => Response.json())

        if(result.success){
          setCart(result.response)
        }
        
    }
    catch(es){
      console.log(es)
    }
  }


    if (!loading && (!selectedItem || selectedItem.state === 0)) nagivate("/")
    if(loading) return <FullscreenLoading/>

    return (
        <>  
        <Toast ref={toast}/>
            <div className="item-main-div">
                <div className="back-div">
                    <Link style={{textDecoration : 'none', color : 'black'}} to={"/collection"}><i className="pi pi-arrow-left"/>Voltar</Link>
                </div>
                <div className="item-outer-div">
                    <div className="item-image-div">
                        <img className="item-image" src={selectedItem.image} />
                    </div>
                    <div className="item-info-div">
                        <div className="item-info-inner-div">
                            <h1 className="item-title">{selectedItem.name}</h1>
                            {selectedItem.state == 1 ? <><p className="item-price">{selectedItem.price}€</p></> : <><p key={selectedItem.item_id} style={{color : selectedItem.state == 1 ? 'black' : 'red'}} className="item-state" >Indisponível</p></>}
                            <div className="contrast-div">
                                {items > 1 ? items.map((item, index) => <><span key={items[index].item_id} onClick={() => item.state == 1 && item.item_id != selectedItem.item_id ? changeContrast(items[index]) : ''}><Contrast selected={selectedItem.item_id === item.item_id ? true : false} state={item.state} contrast={item.contrast}/></span></>) : ''}
                                
                            </div>
                            <p style={{fontSize : '16px'}}>
                                Pode visitar a loja física ou contactar-nos através das redes sociais 
                                <br/>
                                <a
                                    style={{ textDecoration: "none", color: "#666", fontWeight: "bold" }}
                                    rel="noreferrer"
                                    target="_blank"
                                    href="https://ig.me/m/naiiledbyana?text=Hello"
                                >
                                    @naiiledbyana
                                </a> ou <a
                                    style={{ textDecoration: "none", color: "#666", fontWeight: "bold" }}
                                    rel="noreferrer"
                                    target="_blank"
                                    href="https://www.facebook.com/p/Nailed-By-Ana-61571734991010/"
                                >
                                    Nailed by Ana
                                </a>.
                            </p>
                            {enable ? <>
                                <button disabled={selectedItem.state == 0 ? true : false} onClick={() => addToCart(selectedItem)} className="dialog-button">
                                    <i
                                    className="pi pi-shopping-bag"
                                    style={{ marginRight: "10px", fontSize: "16px" }}
                                    />
                                    Adicionar ao carrinho
                                </button>
                                </> : <>
                                <button onClick={() => removeFromCart(selectedItem)} className="dialog-button">
                                    <i
                                    className="pi pi-times"
                                    style={{ marginRight: "10px", fontSize: "16px" }}
                                    />
                                    Remover do carrinho
                                </button>
                                </>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
