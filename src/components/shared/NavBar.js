import "./NavBar.css";
import { useEffect } from "react";
import "primeicons/primeicons.css";
import NavBarDesktop from "./NavBarDesktop";
import NavBarMobile from "./NavBarMobile";

function NavBar() {
  useEffect(() => {
    // Definimos a função dentro do useEffect para maior segurança
    const scrollFunction = () => {
      const navDesktop = document.getElementById("navBarScroll");
      const navMobile = document.getElementById("navBarMobileScroll");

      const isScrolled =
        document.body.scrollTop > 60 || document.documentElement.scrollTop > 60;

      // Verificação de Segurança (O "Null Check")
      // Só executa se os elementos existirem na página atual
      if (navDesktop) {
        if (isScrolled) {
          navDesktop.classList.replace("nav-bar-hidden", "nav-bar-visible");
        } else {
          navDesktop.classList.replace("nav-bar-visible", "nav-bar-hidden");
        }
      }

      if (navMobile) {
        if (isScrolled) {
          navMobile.classList.replace("nav-bar-hidden", "nav-bar-visible");
        } else {
          navMobile.classList.replace("nav-bar-visible", "nav-bar-hidden");
        }
      }
    };

    // Usamos addEventListener em vez de window.onscroll
    window.addEventListener("scroll", scrollFunction);

    // FUNÇÃO DE LIMPEZA (Essencial para não crashar o browser)
    return () => {
      window.removeEventListener("scroll", scrollFunction);
    };
  }, []); // Array vazio [] garante que isto só corre uma vez ao montar

  return (
    <>
      <div className="hide">
        {/* Garante que dentro destes componentes os IDs 'navBarScroll' existem */}
        <NavBarDesktop />
      </div>
      <div className="visi">
        <NavBarMobile />
      </div>
    </>
  );
}

export default NavBar;
