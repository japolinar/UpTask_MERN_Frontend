import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({children})=>{

    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    //const navigate = useNavigate()

    useEffect(() => {
        const autenticarUsuario = async ()=>{
            const token = localStorage.getItem('token')
            //console.log(token);
            if(!token){
                setCargando(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const {data} = await clienteAxios.get('/usuarios/perfil', config)
                //console.log(data);
                setAuth(data)
                //navigate('/proyectos') //Para que siempre al dar F5 se redireccione a la pagina de '/proyectos'

            } catch (error) {
                console.log(error.response.data.msg);
                setAuth({})
            } 
            setCargando(false)

        }

        autenticarUsuario();

    }, []);


    const cerrarSesionAuth = ()=>{
        setAuth({})
    }

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
};

export default AuthContext