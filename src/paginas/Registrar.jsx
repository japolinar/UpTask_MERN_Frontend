import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const Registrar = () => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if ([nombre, email, password, repetirPassword].includes('')) {
      //console.log('Todos los campos son obligatorios')
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }

    if(password !== repetirPassword){
      setAlerta({
        msg: 'Los password no son iguales',
        error: true
      })
      return
    }

    if(password.length < 6){
      setAlerta({
        msg: 'El password es muy corto agrega minimo 6 caracteres',
        error: true
      })
      return
    }

    setAlerta({})

    //Creando el usuario en la API
    try {      
      const {data} = await clienteAxios.post(`/usuarios`,{nombre, email, password})
      //console.log(data);
      setAlerta({
        msg: data.msg,
        error: false
      })

      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')

    } catch (error) {
      //console.log(error.response.data.msg)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const {msg} = alerta

  return (
    <>
      <h1 className=' text-sky-600 font-black text-6xl capitalize'>Crea tu cuenta y administra tus {' '}
        <span className=' text-slate-700'>proyectos
        </span>
      </h1>

      {msg && <Alerta alerta={alerta}/>}

      <form 
        className=' my-10 bg-white shadow rounded-lg p-10'
        onSubmit={handleSubmit}
      >
        <div className='my-5'>
          <label 
            className=' uppercase text-gray-600 block text-xl font-bold'
            htmlFor='nombre'
          >
            Nombre
          </label>
          <input 
            type="text"
            placeholder='Tu Nombre'
            className=' w-full border mt-3 p-3 rounded-xl bg-gray-50'
            id='nombre'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)} 
          />
        </div>

        <div className='my-5'>
          <label 
            className=' uppercase text-gray-600 block text-xl font-bold'
            htmlFor='email'
          >
            Email
          </label>
          <input 
            type="email"
            placeholder='Email de Registro'
            className=' w-full border mt-3 p-3 rounded-xl bg-gray-50'
            id='email' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='my-5'>
          <label 
            className=' uppercase text-gray-600 block text-xl font-bold'
            htmlFor='password'
          >
            Password
          </label>
          <input 
            type="password"
            placeholder='Password de Registro'
            className=' w-full border mt-3 p-3 rounded-xl bg-gray-50'
            id='password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className='my-5'>
          <label 
            className=' uppercase text-gray-600 block text-xl font-bold'
            htmlFor='password2'
          >
            Repite tu Password
          </label>
          <input 
            type="password"
            placeholder='Repetir tu Password'
            className=' w-full border mt-3 p-3 rounded-xl bg-gray-50'
            id='password2' 
            value={repetirPassword}
            onChange={(e) => setRepetirPassword(e.target.value)}
          />
        </div>

        <input 
          type="submit" 
          value="Crear Cuenta" 
          className=' bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
        />
      </form>

      <nav className=" lg:flex lg:justify-between">
        <Link
          className=" block text-center my-5 text-slate-500 uppercase text-sm"
          to={'/'}
        >
          ¿Ya tienes una cuenta? Inicia Sesion
        </Link>

        <Link
          className=" block text-center my-5 text-slate-500 uppercase text-sm"
          to={'/olvide-password'}
        >
          Olvide mi password
        </Link>
      </nav>

    </>
  )
}

export default Registrar
