/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { IoMdPerson,IoIosFingerPrint, IoIosMail, IoIosPerson } from "react-icons/io";
import Logo from '../../../assets/logowhite.svg';
import './cadastro.css';
import api from '../../../service/api';

export default function Registro() {


  const [ nome, setNome ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ senha, setSenha ] = useState('');
  const [ cep, setCep ] = useState('');
  const [ img, setImg ] = useState();
  const [ preview, setPreview ] = useState('')


  async function Cadastrar(){

    const dataimg = new FormData();
    dataimg.append('images', img)

    try{
     const {data} = await api.post('/cadastrarCliente',{
      nome:nome,
      email:email,
      senha:senha,
      cep:cep,
      img: dataimg
     })
     alert(data)
     alert(`Voce foi cadastrado, seu nome: ${nome}`);
     return window.location.href = "/"
    }
    catch(error){ //DEBUG do ERRO
      console.log('Houve erro!')
    }
   }

   useEffect(() => {
    
   }, [img])


   function MudaImg(e){

    const formData = new FormData()
    formData.append('images', e[0]);

    var reader = new FileReader();
    reader.readAsBinaryString(e[0]);

    reader.onload = function() {
        console.log();
        setPreview(btoa(reader.result))
    };
    reader.onerror = function() {
        console.log('there are some problems');
    };

      setImg(e[0])

   }


  return (
    <>
  <body>
    <div className="cadastroArea">

      <div className="boxLogin">
      <img src={Logo} alt="betterTogether"/>
      <h3 style={{color: "#FFF",}}>Faça seu cadastro!</h3>
      
        <div className="inputGroup">

          <div className="inputWIcon">
            <h3><IoMdPerson size="20px" /></h3>
            <input type="text" name="nome" placeholder="Digite seu nome" onChange={ e => setNome(e.target.value) }/>
          </div>

          <div className="inputWIcon">
            <h3><IoIosMail size="20px" /></h3>
            <input type="email" name="email" placeholder="Digite aqui o seu email" onChange={ e => setEmail(e.target.value) }/>
          </div>

          <div className="inputWIcon" style={{marginBottom: 20}}>
            <h3><IoIosFingerPrint size="20px" /></h3>
            <input type="password" name="senha" placeholder="******" onChange={ e => setSenha(e.target.value) }/>
          </div>

          <div className="inputWIcon">
            <h3><IoIosFingerPrint size="20px" /></h3>
            <input type="text" name="cep" placeholder="digite seu CEP" onChange={ e => setCep(e.target.value) }/>
          </div>

          <div className="inputWIcon">
            <div style={{margin: "0 auto", textAlign: 'center', display: "flex", justifyContent: 'center'}}>
              <label id="labelForFileInput" for="fileInputReg">
              { preview ? <img id="imgPreview" src={`data:${img.type.toString()};base64,${preview}`} alt="foto" />: <IoIosPerson size="35px" color="black" />}
            </label>
            <span style={{color:"white"}}>Adicionar foto</span>
            </div>
            
            <input type="file" id="fileInputReg" name="foto" onChange={ e => MudaImg(e.target.files) }/>
          </div>

        </div>
        <button style={{marginTop: 100}} onClick={()=>Cadastrar()} className="BTNLogin">Cadastrar</button>
      </div>
       
      </div>
    </body>
    </>
  );
}
