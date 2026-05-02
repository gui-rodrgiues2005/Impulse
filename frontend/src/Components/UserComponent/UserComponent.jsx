import React from 'react'
import './UserComponent.scss'

const UserComponent = () => {
  return (
    <div className='user__account'>
        <div className='user__perfil'>
            <img src="" alt="Foto de Perfil" className='user__foto'/>
            <div className='user__info'>
                <h3 className='user__name'>Guilherme</h3>
                <p className='user__role'>Aluno</p>
            </div>
        </div>
    </div>
  )
}

export default UserComponent
