import React, {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from "../config/clienteAxios";

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  const params = useParams()
  //console.log(params);
  const {id} = params

  useEffect(() => {
    const confirmarCuenta = async ()=>{
      try {
        const url = `/usuarios/confirmar/${id}`
        const {data} = await clienteAxios(url)
        //console.log(data);
        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true);
        
      } catch (error) {
        //console.log(error);
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    confirmarCuenta();
  }, []);

  const {msg} = alerta

  return (
    <>
      <h1 className=' text-sky-600 font-black text-6xl capitalize'>Confirma tu cuenta y empieza a crear tus {' '}
        <span className=' text-slate-700'>proyectos
        </span>
      </h1>

      <div className='mt-20 md:mt-5 shadow-lg px-10 py-10 rounded-xl bg-white'>
        {msg && <Alerta alerta={alerta}/>}
        {cuentaConfirmada && (
          <Link
            className=" block text-center my-5 text-slate-500 uppercase text-sm"
            to={'/'}
          >
            Inicia Sesion
          </Link>
        )}
      </div>
      
    </>
  )
}

export default ConfirmarCuenta