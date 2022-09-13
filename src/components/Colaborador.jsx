import React from 'react'
import useProyectos from '../hooks/useProyectos'

const Colaborador = ({colaborador}) => {

  const {nombre, email} = colaborador  
  //console.log(colaborador);
  const {handleEliminarColaborador, modalEliminarColaborador} = useProyectos()

  return (
    <div className=' border-b p-5 flex justify-between'>
      <div>
        <p>{nombre}</p>
        <p className=' text-sm text-gray-700'>{email}</p>
      </div>

      <div>
        <button
            type='button' 
            onClick={()=>handleEliminarColaborador(colaborador)}
            className=' bg-red-600 px-4 py-3 text-white rounded-lg uppercase font-bold text-sm'
        >Eliminar</button>
      </div>
    </div>
  )
}

export default Colaborador
