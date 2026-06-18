import CartItem from "../components/CartItem";
import "../styles/Cart.css";
import { useCart } from "../services/Cart";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useEffect, useRef, useState } from "react";
import useSession from "../hooks/useSession";
import FullscreenLoading from "../components/Loading";
import API_URL from "../config";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../services/ProductProvider";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
export default function Cart() {
  const { cart, fetchCart } = useCart();
  const [preco, setPreco] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const { fetchData } = useProducts();
  const toast = useRef();

  useEffect(() => {
    let aux = 0;
    cart.map((product) => {
      aux += Number(product.reserveQty) * Number(product.price);
    });
    setPreco(aux);
  }, [cart.length]);

  const makeReservation = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);

      if (cart.length === 0) {
        toast.current.show({
          severity: "warn",
          summary: "Aviso",
          detail: "Não existe nenhum produto no carrinho",
          life: 3000,
        });
        setLoading(false);
        return;
      }
      const tempCart = cart;
      const formData = new FormData();
      formData.append("cart", cart);

      const result = await fetch(`${API_URL}/server/?action=makeReservation`, {
        body: formData,
        method: "POST",
        credentials: "include",
      }).then((Response) => Response.json());

      setLoading(false);
      if (result.success) {
        setSuccess(true);
        fetchData();

        setTimeout(() => {
          navigate("/");
          fetchCart();
        }, 2000);
      } else {
        toast.current.show({
          severity: "warn",
          summary: "Aviso",
          detail: result.response,
          life: 1000,
        });
      }
    } catch (es) {
      console.log(es);
      setLoading(false);
    }
  };

  if (loading) return <FullscreenLoading />;

  if (success) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>
          Reserva feita com sucesso! Irá receber um email de confirmação para o
          levantamento da mesma.
        </h1>
        <p>Será redirecionado para a página inicial...</p>
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog modal draggable={false} />
      <h1 style={{ textAlign: "center" }}>O seu carrinho</h1>
      <div className="content-grid">
        <div>
          <div className="cart-product-div">
            {cart.length !== 0 ? (
              cart.map((e) => <CartItem key={e.item_id} product={e} />)
            ) : (
              <p
                style={{
                  fontSize: "15px",
                  textAlign: "center",
                  alignContent: "center",
                }}
              >
                Carrinho vazio
              </p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p className="amount">Total de {parseFloat(preco).toFixed(2)} €</p>
            <button onClick={makeReservation} className="reserve-button">
              Reservar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
