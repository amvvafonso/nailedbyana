import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import { useLocation } from "react-router-dom";

export default function useSession() {

  const [user, setUser] = useState(null);
  const [logged, setLogged] = useState()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {

    async function checkSession() {
      try {

        const res = await fetch(`${API_URL}/server/?action=checkAuth`, {
          credentials: "include",
        });

        const auth = await res.json();

        setTimeout(() => {
          setLoading(false)
        }, 500);

        if (auth.logged) {
          setUser(JSON.parse(auth.userLogged));
        } 
        else {
          setUser(null);
          if (window.location.pathname !== "/login") {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Session validation error:", error);
        navigate("/");
      } finally {
      }
    }

    checkSession();
  }, [navigate]);


  return { user, logged ,loading }
}


export function ValidadeSession(){
    const [user, setUser] = useState(null);
    const [logged, setLogged] = useState(false)
    const [loading, setLoading] = useState(true)
    const location = useLocation();



    useEffect(() => {
      async function checkSession() {
        try {
          const res = await fetch(`${API_URL}/server/?action=checkAuth`, {
            credentials: "include",
          });
          const auth = await res.json();

          setTimeout(() => {
            setLoading(false)
          }, 500);
          if(!auth){
            return
          }

          if (auth.logged) {
            setUser(JSON.parse(auth.userLogged));
            setLogged(true)
          } else {
            setUser(null);
            setLogged(false)
          }
        } catch (error) {
          console.error("Session validation error:", error);
        } finally {
        }
      }

      checkSession();
    }, [location]);


    return { user ,logged, loading}
}
