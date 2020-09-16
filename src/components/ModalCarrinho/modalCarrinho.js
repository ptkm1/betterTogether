import React from 'react';
import {Container, Conteudo, Card, Foto, Descricao, Preco, Icons, Close, LinkComprar} from './style';

//icons
import {IoMdCheckmarkCircle} from 'react-icons/io';
import {FaTrash} from 'react-icons/fa';
import {RiCloseCircleFill} from 'react-icons/ri';

//api
import data from '../../api/api';

const Modal = ({ id = 'modal' ,onClose = () => {}}) => {

    const clickFora = (e) => {
        if(e.target.id === id) onClose();
    };

    return ( 
        
            <Container id={id} onClick={clickFora}>
                    <Conteudo >
                        <Close> <span><RiCloseCircleFill onClick={onClose} /></span></Close>
                        { data.map(e => {
                            return( 
                            <Card key={e.id}>
                                <Foto  ><img src={e.thumb} alt=""/></Foto>
                                <Descricao>
                                    <h1>{e.nome}</h1>
                                    <p>{e.descricao}</p> 
                                </Descricao>
                                <Preco>
                                    <Icons>
                                        <span><FaTrash /></span>
                                    </Icons>
                                    <div>
                                        <h1>{e.preco}</h1>
                                    </div>
                                </Preco>
                            </Card>
                            )   
                        })}   
                        <LinkComprar>
                            <span>                               
                                Finalizar compra 
                                <IoMdCheckmarkCircle />
                            </span>
                        </LinkComprar> 
                    </Conteudo>
                
            </Container>    
       
    )
};

export default Modal;