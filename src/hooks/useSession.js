import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import { useLocation } from "react-router-dom";



export default function useSession() {
  const [user, setUser] = useState(null);
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${API_URL}/server/?action=checkAuth`, {
          credentials: "include",
          method : 'POST'
        });

        const auth = await res.json();
        setLoading(false);

        if (auth.success) {
          setUser(auth.userLogged);
          setLogged(true);
        } else {
          setUser(null);
          setLogged(false);

          if (window.location.pathname !== "/login") {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Session validation error:", error);
        navigate("/");
      }
    }

    checkSession();

   

  }, [navigate]);

  return { user, logged, loading };
}


export function ValidadeSession() {
    const [user, setUser] = useState(null);
    const [logged, setLogged] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showWarning, setShowWarning] = useState(false);

    const previouslyLogged = useRef(false);
    const location = useLocation();

    useEffect(() => {
        async function checkSession() {
            try {

                const res = await fetch(`${API_URL}/server/?action=checkAuth`, {
                    credentials: "include",
                    method : 'POST'
                });
                const auth = await res.json();

                setTimeout(() => setLoading(false), 300);

                if (auth.success) {
                    setUser(auth.userLogged);
                    setLogged(true);
                    setShowWarning(false);
                    previouslyLogged.current = true;
                } else {
                    setUser(null);

                    if (previouslyLogged.current === true) {
                        setShowWarning(true);
                        previouslyLogged.current = false;
                    }

                    setLogged(false);
                }
            } catch (err) {
                console.error("Session check failed", err);
            }
        }

        checkSession();

        const interval = setInterval(checkSession, 660000); // 10 minutes
        return () => clearInterval(interval);
    }, [location]);

    return { user, logged, loading, showWarning, setShowWarning };
}
