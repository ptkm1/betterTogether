/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext,useEffect } from 'react';
import { Link } from 'react-router-dom';

//Css
import './menu.css';

//Imagens
import Perfil from '../../assets/testeperfil.png';
import Logo from '../../assets/logowhite.svg';

import {FaHome, FaShoppingCart} from 'react-icons/fa';
import FotoSeUndefined from '../../assets/Ellipse 5.svg'

//Modal
import Modal from '../ModalCarrinho/modalCarrinho';
import { useState } from 'react';

//Context
import Context from '../../contexts/auth';
import { IoIosLogIn, IoIosLogOut,IoIosPerson, IoMdPersonAdd } from 'react-icons/io';

//Menu Responsivo
import  MenuResponsivo  from '../menuResponsivo/menu';

export default function Navbar() {
  const [ FotoReserva, setFotoReserva ] = useState()
  const { logado, usuario } = useContext(Context);
  const [isModalVisible, setIsModalVisible] = useState(false);


  function Deslogar(){
    localStorage.clear();
    return window.location.href = "/"
  }

  

  return (
    <>
      <MenuResponsivo />
      <div className="nav-menu">
        
        <div className="ladoEsquerdo">
        <Link to='/' ><img src={Logo} alt="Logo"/></Link>
        </div>
        <div className="ladoDireito">
                  
                  <div className="botoes">

                      <Link to="/" className="btnNav">
                        <div className="buttonNav">                        
                              <h4>Home</h4>
                              <FaHome />                        
                        </div>
                      </Link> 

                      <Link onClick={() => setIsModalVisible(true)} className="btnNav" to="#">
                        <div className="buttonNav">               
                              <h4>Carrinho</h4> 
                              <FaShoppingCart />
                        </div>
                      </Link>               
                         
                 </div>       
                 { logado ? ( <div className="perfil">
              <h4>{usuario.nome}</h4>
              <div className="circle">
                <img src={usuario.img ? usuario.img : FotoSeUndefined} alt="Perfil foto"/>
              </div>

              <div className="dropdown">
                <Link className="Links" to="#" onClick={()=>Deslogar()}> <IoIosLogOut /> Deslogar</Link>
                <Link className="Links" to="/perfil"> <IoIosPerson /> Perfil</Link>
              </div>

            </div> ) : ( 
            
            <div className="loginEcadastro"> 
              <Link className="BotoesLogin" to="/login"> <span><IoIosLogIn /></span>  Logar</Link>
              <Link className="BotoesLogin" to="/cadastro"> <span><IoMdPersonAdd /></span> Cadastrar</Link> 
            </div>

            )}           
            
        </div>        
      </div>
       {isModalVisible ? <Modal onClose={() => setIsModalVisible(false)} /> : null}
    </>
  );
}
