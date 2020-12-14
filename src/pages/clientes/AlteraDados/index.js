import React,{useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import Context from '../../../contexts/auth';

//Styles
import { Header, Container, Conteudo, DireitaHeader, CentroHeader, Direita, Esquerda, Botao, Botao2, BotaoAlt } from './styles';

//Componentes
import Navbar from '../../../components/menu/menu';
import Footer from '../../../components/footer/footer';


//imagens e icons
import PerfilFoto from '../../../assets/perfilgrande.png';
import { GiSave } from 'react-icons/gi';

import { IoIosCube } from 'react-icons/io';
import { FaUserCircle } from 'react-icons/fa';
import { AlterContainer } from './styles';
import api from '../../../service/api';




export default function Perfil(){

    const { usuario } = useContext(Context);

    const [ nome, setNome ] = useState(usuario.nome);
    const [ senha, setSenha ] = useState();
    const [ email, setEmail ] = useState(usuario.email);
    const [ cep, setCep ] = useState(usuario.cep);
    


        async function Update(){
            const {data} = await api.put('/cliente', {
                id: usuario.endereco.id_cliente,
                nome,
                email
            })

            alert(data.message);

            if(senha){
                const {data} = await api.put('/cliente',{
                    id: usuario.endereco.id_cliente,
                    senha: senha
                })
                alert(data.message)
            }
        }


    return(
        <>
            <Navbar />
            <Container>
                <Header>
                    <DireitaHeader>
                        <div>
                            <h1>{usuario.nome}</h1>
                            <h3>{usuario.email}</h3>
                        </div>
                    </DireitaHeader>
                    <CentroHeader>
                        <img src={usuario? usuario.img : PerfilFoto} alt="perfil" />
                    </CentroHeader>
                </Header>
                <Conteudo>
                    <Esquerda>
                        <Botao2>
                            <Link to="/perfil">
                                <IoIosCube />
                                <h3>Pedidos</h3>
                            </Link>
                        </Botao2>
                        <Botao>
                            <Link>
                                <FaUserCircle />
                                <h3>Alterar dados</h3>
                            </Link>
                        </Botao>
                    </Esquerda>
                    <Direita>
                        <h1>Cadastro:</h1>

                        <AlterContainer>
                            <h2>Nome:</h2>
                            <input type="text" name="nome" value={nome} onChange={ e => setNome(e.target.value) } />
                            
                        </AlterContainer>

                        <AlterContainer>
                            <h2>Email:</h2>
                            <input type="email" name="email" value={email} onChange={ e => setEmail(e.target.value) } />
                            
                        </AlterContainer>

                        <AlterContainer>
                            <h2>CEP</h2>
                            <input type="text" name="cep" value={cep} onChange={ e => setCep(e.target.value) } />
                            
                        </AlterContainer>

                        <h1>Alterar senha:</h1>

                        <AlterContainer>
                            <h2>Senha atual:</h2>
                            <input type="password" name="senha" />
                        </AlterContainer>                        
                        <AlterContainer>
                            <h2>Nova senha:</h2>
                            <input type="password" name="senha"  onChange={ e => setSenha(e.target.value) } />
                        </AlterContainer>

                        <button onClick={()=> Update()} >Alterar</button>
                    </Direita>
                </Conteudo>
            </Container>
            <Footer />
        </>
    );
}