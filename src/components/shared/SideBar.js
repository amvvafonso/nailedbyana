import { FaArrowLeft, FaProductHunt, FaShoppingBag } from "react-icons/fa";
import "../shared/SideBar.css";
import { IoDiamondOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { BiCollection } from "react-icons/bi";
export default function SideBar() {
  const [optionSelected, setOptionSelected] = useState(
    window.location.pathname.split("/").filter(Boolean).pop(),
  );

  return (
    <>
      <div className="side-bar-main-div">
        <Link
          style={{
            position: "absolute",
            top: "10px",
            left: "30px",
            textDecoration: "none",
            color: "rgba(80,80,80,0.7)",
          }}
          to={"/"}
        >
          <FaArrowLeft /> Voltar atrás
        </Link>

        <div className="side-bar-header-div">
          <h1 className="side-bar-header">BY ANA.</h1>
          <p className="side-bar-subheader">Backoffice</p>
        </div>
        <div className="side-bar-link-div">
          <div className="side-bar-link-div">
            <Link
              onClick={() => {
                setOptionSelected("dashboard");
              }}
              style={{
                backgroundColor:
                  optionSelected == "dashboard"
                    ? "rgba(80,80,80,0.05)"
                    : "transparent",
              }}
              to={"dashboard"}
              className="side-bar-link"
            >
              {" "}
              <MdOutlineDashboardCustomize /> Dashboard
            </Link>
            <Link
              onClick={() => {
                setOptionSelected("produtos");
              }}
              style={{
                backgroundColor:
                  optionSelected == "produtos"
                    ? "rgba(80,80,80,0.05)"
                    : "transparent",
              }}
              to={"produtos"}
              className="side-bar-link"
            >
              {" "}
              <IoDiamondOutline /> Produtos
            </Link>
            <Link
              onClick={() => {
                setOptionSelected("vendas");
              }}
              style={{
                backgroundColor:
                  optionSelected == "vendas"
                    ? "rgba(80,80,80,0.05)"
                    : "transparent",
              }}
              to={"vendas"}
              className="side-bar-link"
            >
              {" "}
              <FaShoppingBag /> Vendas
            </Link>
            <Link
              onClick={() => {
                setOptionSelected("colecoes");
              }}
              style={{
                backgroundColor:
                  optionSelected == "colecoes"
                    ? "rgba(80,80,80,0.05)"
                    : "transparent",
              }}
              to={"colecoes"}
              className="side-bar-link"
            >
              {" "}
              <BiCollection /> Coleções
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
