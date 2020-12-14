import React, {useState,useEffect} from 'react';
import { BiFace,BiHomeAlt,BiLayerPlus, BiPackage,BiBullseye } from "react-icons/bi";
import { IoIosAddCircle,IoIosExit,IoIosBuild, IoIosCheckmarkCircle} from "react-icons/io";
import {FaTrash} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import './style.css'
import Logo from '../../../assets/logored.svg';
import Graph from '../../../assets/Dashboard/graph.svg';
import api from '../../../service/api';

export default function AddProdutos() {


  const [ produtos, setProdutos ] = useState([])

  async function DeletarProduto(prop){
    await api.delete(`/produto/${prop}`)
  }

  useEffect(()=>{
    async function getProdutos(){
      const {data} = await api.get('/produto')
      return setProdutos(data);
    }
    getProdutos();
  },[produtos])


  const [usuarioLogado , setUsuarioLogado ] = useState([])
  const [ metas, setMeta ] = useState()

  //  const [ tituloMeta, setTituloMeta ] = useState('')
  //  const [ descricaoMeta, setDescricaooMeta ] = useState('')
  //  const [ valor, setValor ] = useState('')

  useEffect(()=>{
    async function buscaUser(){
      try{
        const usuarioLogado = JSON.parse(localStorage.getItem('@btgther/usuarioADM'));

        setUsuarioLogado(usuarioLogado);
      }catch(error){
        console.log(error)
      }
    }


    buscaUser()
  },[])

  useEffect(() => {
    async function buscaMetas(){
      try {
        const {data} = await api.get('/metas')
        setMeta(data.metas);
      } catch (error) {
        alert(error)
      }
    }
    buscaMetas()
  }, [metas])
  

  async function DeletarMetas(id){
    const {data} = await api.delete(`/metas/${id}`)

    alert(data.message)
  }



  async function AddMetas(){

    let titulo = window.prompt('Digite um titulo')
    let descricao = window.prompt('Digite uma Descrição breve')
    let valor = window.prompt('Digite um valor')

    const {data} = await api.post('/metas', {
      titulo:titulo,
      descricao: descricao,
      valor: valor
    })

    alert(data.message);
  }

  function Deslogar(){
    localStorage.clear();
    return window.location.href = "/"
  }
  //Para o componente de metas (por enquanto estático);


  return (
    <>
      <div className="Dashboard">

      <div className="header">
        <div className="esquerda">
          <img src={Logo} alt="LogoDashboard"/>
        </div>
        <div className="direta">
          <div className="perfilDash">
            <div className="circleDash"></div>
            <h2>{usuarioLogado.nome}</h2>
            <h3> <IoIosExit className="exitbtn" size="23px" color="#820E0E" onClick={()=>Deslogar()} /> </h3>
          </div>
        </div>
      </div>

      <div className="funcoes">
            <Link to="/dashboard" className="itens"> <BiHomeAlt size="30px"/> </Link>
            <Link to="/produtos" className="itens"> <BiPackage size="30px"/> </Link>
            <Link to="/clientes" className="itens"> <BiFace size="30px"/> </Link>
      </div>

      <div className="main">
          <div className="listaProdutos">
            <h1 style={{color: '#820E0E', fontSize: 20, marginBottom: 30}}>Produtos</h1>

          <div className="produtosCadastrados">
            <Link className="add" to="/addprodutos">
              <IoIosAddCircle size="73px" />
              <h1>Adicionar Produto</h1>
            </Link>

            { produtos.map(e=>{
              //Aqui chamaremos na api, os produtos


              return(
                
              <div key={e.id} className="produto" >
                <BiPackage size="73px" />
                <h1>{e.produto}</h1>
                  <Link to={`/editar/${e.id}`}>
                    <IoIosBuild size="20px" color="#820E0E" />
                  </Link>
                  <FaTrash style={{cursor: 'pointer'}} onClick={()=>DeletarProduto(e.id)} size="20px" />
              </div>
              )
              }) }
            </div>
          </div>

            <div className="CardsEstatisticas">

                <div className="cardEst">

                    <div className="dirCard">
                      <h4>Metas</h4>
                      <BiBullseye size="50px" />  
                      { metas ? (<div>
                        {metas.map(e=>{
                          return (
                            <>
                            <div style={{display: 'flex', width: "100%"}}>
                              <div key={e.id} style={{borderBottom: '2px #820E0E solid', display: 'flex',flexDirection:'column', width: "100%",flexWrap: 'wrap'}}>
                              <h2>{e.titulo}</h2>
                              <p>{e.descricao}</p>
                              </div>
                              <div>
                                <span onClick={()=>DeletarMetas(e.id)} style={{cursor: "pointer"}}><IoIosCheckmarkCircle size="24px" /></span>
                              </div>
                            </div>
                            </>
                          )
                        })}
                      </div>) : <span>Nenhuma meta ainda</span> }
                      <Link className="addMeta">
                      <span><BiLayerPlus /></span>
                      <span onClick={()=>AddMetas()}>Adicionar nova meta</span>
                      </Link>
                    </div>
                </div>

                <div className="cardEst">
                    <div className="dirCard">
                      <h4>Produtos mais vendidos</h4>
                      <span style={{fontSize: 11, paddingTop: 15}}>Não foi possível realizar<br></br> uma estatística ainda</span>
                      {/*data.map(e=>{
                        //Aqui chamaremos da api de estatisticas do produto
                        return(<span>{e.nome}</span>)
                      })*/}
                    </div>

                    <div className="esqCard">
                      <img src={Graph} alt="grafico"/>
                    </div>
                </div>
              
            </div>
      </div>

      </div>
    </>
  );
}
