import React, {useState, useEffect} from 'react'
import useProyectos from '../hooks/useProyectos';
import { useParams } from "react-router-dom";
import Alerta from './Alerta';

const FormularioProyecto = () => {
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [cliente, setCliente] = useState('');

    const {mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos()

    const params = useParams()
    
    useEffect(() => {
        if(params.id){
            setId(proyecto._id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    }, [params]);

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg: 'Todos los campos son Obligatorios',
                error: true
            })
            return
        }

        //Pasar los Datos hacia el provider
        await submitProyecto({id, nombre, descripcion, fechaEntrega, cliente})

        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
    }

    const {msg} = alerta

  return (
    <>    
        <form 
            className=' bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
            onSubmit={handleSubmit}
        >
            {msg && <Alerta alerta={alerta}/> }
        <div className=' mb-5'>
            <label 
                htmlFor="nombre"
                className=' text-gray-700 uppercase font-bold text-sm'
            >
            Nombre Proyecto
            </label>
            <input 
                type="text" 
                className=' border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-lg' 
                id="nombre" 
                placeholder='Nombre del Proyecto'
                value={nombre}
                onChange={(e)=> setNombre(e.target.value)}
            />
        </div>

        <div className=' mb-5'>
            <label 
                htmlFor="descripcion"
                className=' text-gray-700 uppercase font-bold text-sm'
            >
            Descripcion
            </label>
            <textarea              
                className=' border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-lg' 
                id="descripcion" 
                placeholder='Descripcion del Proyecto'
                value={descripcion}
                onChange={(e)=> setDescripcion(e.target.value)}
            />
        </div>

        <div className=' mb-5'>
            <label 
                htmlFor="fecha-entrega"
                className=' text-gray-700 uppercase font-bold text-sm'
            >
            Fecha del Proyecto
            </label>
            <input 
                type="date" 
                className=' border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-lg' 
                id="fecha-entrega"             
                value={fechaEntrega}
                onChange={(e)=> setFechaEntrega(e.target.value)}
            />
        </div>

        <div className=' mb-5'>
            <label 
                htmlFor="cliente"
                className=' text-gray-700 uppercase font-bold text-sm'
            >
            Nombre Cliente
            </label>
            <input 
                type="text" 
                className=' border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-lg' 
                id="cliente" 
                placeholder='Nombre del Cliente'
                value={cliente}
                onChange={(e)=> setCliente(e.target.value)}
            />
        </div>

        <input 
            type="submit" 
            value={id ? "Actualizar Proyecto" : "Crear Proyecto"} 
            className=' bg-sky-600 w-full text-white uppercase rounded-lg p-3 font-bold cursor-pointer hover:bg-sky-700 transition-colors' 
        />
        </form>
    </>
  )
}

export default FormularioProyecto
