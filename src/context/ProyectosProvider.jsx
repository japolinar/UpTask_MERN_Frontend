import React, {useState, useEffect, createContext} from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import io from 'socket.io-client'

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {

  const [proyectos, setProyectos] = useState([]);
  const [proyecto, setProyecto] = useState({});
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
  const [tarea, setTarea] = useState({});
  const [colaborador, setColaborador] = useState({});  
  const [buscador, setBuscador] = useState(false);

  const navigate = useNavigate()
  const {auth} = useAuth()

  useEffect(() => {
    const obtenerProyectos = async ()=>{
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }

        const {data} = await clienteAxios.get('/proyectos', config)
        //console.log(data);
        setProyectos(data)
        
      } catch (error) {
        console.log(error);
      }
    }
    obtenerProyectos()
  }, [auth]);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
  }, []);

  const mostrarAlerta = (alerta) =>{
    setAlerta(alerta)

    setTimeout(() => {
      setAlerta([])
    }, 5000);
  }

  const submitProyecto = async (proyecto) =>{
    //console.log(proyecto);
    if(proyecto.id){
      await editarProyecto(proyecto)
    }else{
      await nuevoProyecto(proyecto)
    }
    
  }

  const editarProyecto = async (proyecto)=>{
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
      //console.log(data);

      //Sincronizar el state
      const proyectosActualizados = proyectos.map(proyectoState =>{
        return proyectoState._id === data._id ? data : proyectoState
        
      })
      //console.log(proyectosActualizados);
      setProyectos(proyectosActualizados)

      //Mostrar la alerta
      setAlerta({
        msg: `Proyecto "${data.nombre}" Actualizado correctamente`,
        error: false
      }) 
      
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);
      

    } catch (error) {
      console.log(error);
    }
  }

  const nuevoProyecto = async (proyecto)=>{
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post('/proyectos', proyecto, config)
      //console.log(data);

      setProyectos([...proyectos, data])

      setAlerta({
        msg: `Proyecto "${data.nombre}" creado correctamente`,
        error: false
      }) 
      
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);

    } catch (error) {
      console.log(error);
    }
  }

  const obtenerProyecto = async (id)=>{
    //console.log(id);
    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.get(`/proyectos/${id}`, config)
      //console.log(data);
      setProyecto(data)
      setAlerta({})

    } catch (error) {
      navigate('/proyectos')
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 3000);
    }finally{
      setCargando(false)
    }
  } 

  const eliminarProyecto = async id =>{
    //console.log('Eliminando', id);
    try {
      const token = localStorage.getItem('token')
        if (!token) return

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }

        const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)
        //console.log(data);

        //Sincronizar el state
        const proyectosActuslizados = proyectos.filter( (proyectoState)=> proyectoState._id !== id)
        setProyectos(proyectosActuslizados)

        setAlerta({
          msg: data.msg,
          error: false
        }) 

        setTimeout(() => {
          setAlerta({})
          navigate('/proyectos')
        }, 3000);

    } catch (error) {
      console.log(error);
    }
  }

  const handleModalTarea = ()=>{
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({})
  }

  const submitTarea = async (tarea)=>{
    //console.log(tarea);
    if(tarea?.id){
      await editarTarea(tarea)
    }else{
      await crearTarea(tarea)
    }
  }

  const crearTarea = async (tarea)=>{
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`/tareas/`, tarea, config)
      //console.log(data);
      
      setAlerta({})
      setModalFormularioTarea(false)

      //SOCKET.IO
      socket.emit('nueva tarea', data)

    } catch (error) {
      console.log(error);
    }
  }

  const editarTarea = async (tarea) =>{
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
      //console.log(data);
      
      setAlerta({})
      setModalFormularioTarea(false)

      //SOCKET IO
      socket.emit('actualizar tarea', data)

    } catch (error) {
      console.log(error);
    }
  }
    
  

  const handleModalEditarTarea = (tarea)=>{
    //console.log(tarea);
    setTarea(tarea)
    setModalFormularioTarea(true)
  }

  const handleModalEliminarTarea = (tarea) =>{
    setTarea(tarea)
    setModalEliminarTarea(!modalEliminarTarea)
  }

  const eliminarTarea = async () =>{
    //console.log(tarea);
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
      //console.log(data);
      setAlerta({
        msg: data.msg,
        error: false
      })
      
      setModalEliminarTarea(false)      

      //SOCKET IO
      socket.emit('eliminar tarea', tarea)

      setTarea({})
      setTimeout(() => {
        setAlerta({})
      }, 3000);

    } catch (error) {
      console.log(error);
    }
  }

  const submitColaborador = async (email)=>{
    //console.log(email);
    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`/proyectos/colaboradores`, {email} ,config)
      //console.log(data);

      setColaborador(data);
      setAlerta({})

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }finally{
      setCargando(false)
    }
  }

  const agregarColaborador = async (email)=>{
    //console.log(email);
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email ,config)
      //console.log(data);  

      setAlerta({
        msg: data.msg,
        error: false
      })  

      setColaborador({})  

      setTimeout(() => {
        setAlerta({})
      }, 3000);

    } catch (error) {  
      setAlerta({
        msg: error.response.data.msg,
        error: true
      }); 
    }
  }

  const handleEliminarColaborador = (colaborador)=>{
    setModalEliminarColaborador(!modalEliminarColaborador)
    //console.log(colaborador);
    setColaborador(colaborador)
  }

  const eliminarColaborador = async ()=>{
    //console.log(colaborador);
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

      const proyectoActualizado = {...proyecto}

      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter((colaboradorState)=> colaboradorState._id !== colaborador._id)

      setProyecto(proyectoActualizado)

      setAlerta({
        msg: data.msg,
        error: false
      })  

      setColaborador({})
      setModalEliminarColaborador(false)

      setTimeout(() => {
        setAlerta({})
      }, 3000);

    } catch (error) {
      console.log(error.response);
    }
  }

  const completarTarea = async (id)=>{
    //console.log(id);
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
      //console.log(data);
      
      setTarea({})
      setAlerta({})

      //SOCKET IO
      socket.emit('cambiar estado', data)
      
    } catch (error) {
      console.log(error.response);
    }
  }

  const handleBuscador = ()=>{
    setBuscador(!buscador)
  }

  //Socket IO
  const submitTareasProyecto = (tarea)=>{
    //Agrega la tarea al state
    const proyectoActualizado = { ...proyecto }
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
    setProyecto(proyectoActualizado)
  }

  const eliminarTareaProyecto = (tarea)=>{
    //actualizar la tarea eliminada al state
    const proyectoActiualizado = {...proyecto}
    proyectoActiualizado.tareas = proyectoActiualizado.tareas.filter( tareaState => tareaState._id !== tarea._id)      
    setProyecto(proyectoActiualizado) 
  }

  const actualizarTareaProyecto = (tarea)=>{
    //actualizar la tarea al state
    const proyectoActiualizado = {...proyecto}
    proyectoActiualizado.tareas = proyectoActiualizado.tareas.map( (tareaState) =>  tareaState._id === tarea._id ? tarea : tareaState )
    setProyecto(proyectoActiualizado)
  }

  const cambiarEstadoTarea = (tarea)=>{
    //actualizar el estado al state
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) => tareaState._id === tarea._id ? tarea : tareaState)
    setProyecto(proyectoActualizado)
  }

  const cerrarSesionProyectos = ()=>{
    setProyectos([])
    setProyecto({})
    setAlerta({})
  }

  return (
    <ProyectosContext.Provider
        value={{
          proyectos,
          alerta,
          mostrarAlerta,
          submitProyecto,
          obtenerProyecto,
          proyecto,
          cargando,
          eliminarProyecto,
          modalFormularioTarea,
          handleModalTarea,
          submitTarea,
          handleModalEditarTarea,
          tarea,
          modalEliminarTarea,
          handleModalEliminarTarea,
          eliminarTarea,
          submitColaborador,
          colaborador,
          agregarColaborador,
          handleEliminarColaborador,
          modalEliminarColaborador,
          eliminarColaborador,
          completarTarea,
          buscador,
          handleBuscador,
          submitTareasProyecto,
          eliminarTareaProyecto,
          actualizarTareaProyecto,
          cambiarEstadoTarea,
          cerrarSesionProyectos
        }}
    >
        {children}
    </ProyectosContext.Provider>
  )
}

export{
    ProyectosProvider
}

export default ProyectosContext
