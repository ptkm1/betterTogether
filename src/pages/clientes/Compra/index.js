import React, { useEffect, useState } from "react";
import api from "../../../service/api";
import { IoIosBarcode, IoMdCard } from "react-icons/io";

import axios from "axios";
import Cards from 'react-credit-cards'
import 'react-credit-cards/es/styles-compiled.css'

//components
import Navbar from "../../../components/menu/menu";
import {
  Container,
  Compra,
  PessoalInfo,
  TituloSection,
  DadosEntrega,
  DadosCartao,
  Direita,
  Cartões,
  Form,
  Baixo,
  Form2,
  Form3,
  InfoCartao,
  InfoEndereco,
  InputsCartao,
  Produto,
  CarrinhoDeCompras,
  Botao,
  PagBotao
} from "./styles.js";

export default function Comprar() {
  //Variáveis de estado, resgatados do storage
  const [user, setUser] = useState([]);
  const [endereco, setEndereco] = useState([]);
  const [items, setItems] = useState([]);
  const [ totalItens, setTotalItens ] = useState("");

  //Variáveis de estado, para armazenar as values dos inputs.
  const [numResid, setNumResid] = useState("");
  const [costumerNome, setCostumerNome] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [cvv, setCvv] = useState("");
  const [dataExpiracao, setDataExpiracao] = useState("");
  const [numeroTel, setNumeroTel] = useState("");
  const [cpf, setCpf] = useState("");
  const [referencia, setRef] = useState("");
  const [cep, setCep] = useState("");
  const [ruaNum, setRuaNum] = useState(0);
  //Var de estado para Receber Resposta
  const [metodoPagamento, setMetodoPagamento] = useState("");

  const [pagamento, setPagamento] = useState([]);
  const [focus, setFocus] = useState("");

  //Criando Costumer
  const costumer = {
    external_id: "#3311",
    name: costumerNome,
    type: "individual",
    country: "br",
    email: user.email,
    documents: [
      {
        type: "cpf",
        number: cpf,
      },
    ],
    phone_numbers: [`+55${numeroTel}`, "+5511888889999"],
    birthday: "2000-01-01",
  };

  //Criando adress para usar em billing e shipping
  const adress = {
    country: "br",
    state: endereco.uf,
    city: endereco.localidade,
    neighborhood: endereco.bairro,
    street: endereco.logradouro,
    street_number: ruaNum,
    zipcode: cep,
  };

  //Criando o shipping
  const shipping = {
    name: "Shipping Reeves",
    fee: 1000,
    delivery_date: "2000-12-21",
    expedited: true,
    address: adress,
  };

  //Criando o billing
  const billing = {
    name: "Billing Moss",
    address: adress,
  };

  //Criando um array com os itens no template do pagarme
  const meusItems = items.map((e) => {
    let preco = e.preco;
    let precoSemPonto = preco + "";
    precoSemPonto = precoSemPonto.replace(".", "");
    precoSemPonto = parseInt(precoSemPonto);
    return {
      id: `rb${e.id_produto}`,
      title: e.produto,
      unit_price: precoSemPonto,
      quantity: e.quantidade,
      tangible: true,
    };
  });
  //Pegando o valor total
  let valorTotal = meusItems.map((e) => {
    let qtdItem = e.quantity;
    let precoItem = e.unit_price;
    let precoTotal = qtdItem * precoItem;
    return precoTotal;
  });
  //Resgatar informações do usuário salvos no storage
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("@btgther/usuario"));
    const itemsCarrinho = JSON.parse(localStorage.getItem("@btgther/carrinho"));

    //Setar variaveis de estado
    setEndereco(usuario.endereco);
    setUser(usuario);
    setItems(itemsCarrinho);
    setCostumerNome(usuario.nome);
  }, []);
  //Pegando endereço dos correios (POR ENQUANTO PEGAREMOS O CADASTRADO NO STORAGE)
  useEffect(() => {
    const enderecoDoCliente = JSON.parse(
      localStorage.getItem("@btgther/usuario")
    );
    const enderecoSemTraço = enderecoDoCliente.endereco.cep.replace(
      /[^\d]+/g,
      ""
    );
    async function BuscarCep() {
      const CorreiosCep = await axios
        .get(`https://viacep.com.br/ws/${enderecoSemTraço}/json/`)
        .then((e) => {
          return e.data;
        });
      return setEndereco(CorreiosCep);
    }
    BuscarCep();
  }, []);

  //const [cep, setCep] = useState("");

  async function RealizarCompra() {
    const total1 = valorTotal.reduce(
      (total1, currentElement) => total1 + currentElement
    );

    let valorTotalSemPonto = total1 + "";
    valorTotalSemPonto = valorTotalSemPonto.replace(".", "");
    valorTotalSemPonto = parseInt(valorTotalSemPonto);

    try {
      const response = await api.post("/transaction", {
        amount: valorTotalSemPonto,
        card_number: numeroCartao,
        card_cvv: cvv,
        card_expiration_date: dataExpiracao,
        card_holder_name: nomeCartao,
        customer: costumer,
        billing: billing,
        shipping: shipping,
        items: meusItems,
      },{
        infoEndereco:InfoEndereco,
        numeroResidencia: numResid,
        referencia: referencia,
        nomeIdentificacao: nomeIdent,
      });
      alert(response.status);

      return setPagamento(response);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async function PagarBoleto() {
    const total1 = valorTotal.reduce(
      (total1, currentElement) => total1 + currentElement
    );

    let valorTotalSemPonto = total1 + "";
    valorTotalSemPonto = valorTotalSemPonto.replace(".", "");
    valorTotalSemPonto = parseInt(valorTotalSemPonto);
      try{
        const response = await api.post("/transactionboleto", {
          amount: valorTotalSemPonto,
          costumer:costumer,
          payment_method: "boleto",
          postback_url: "localhost:8080/postbackboletos",
        });
    
        console.log(response);
        console.log(response.data.transaction.boleto_url);
        /**
         * response.data.transaction <- Objeto resposta após gerado o boleto.
         * response.data.transaction.boleto_url <- Url do boleto, para ver o boleto em sí.
         */
        alert("Boleto gerado, olhar o console, e falta aplicar o redirect para o boleto url")
      }catch(erro){
        console.log(erro.response)
      }
    
  }
  //Novos useStates
  const [nomeIdent, setNomeIdent] = useState("");
  
  return (
    <>
      <Navbar />
      <Container>
        <Compra>
          <PessoalInfo>
            <TituloSection>
              <h1>1</h1>
              <h2>Informações pessoais</h2>
            </TituloSection>

            <Form>
              <input
                type="text"
                placeholder="Nome de identificação"
                onChange={(e) => setNomeIdent(e.target.value)}
              />
            </Form>
            <Form>
              <input
                type="text"
                placeholder="CPF"
                onChange={(e) => setCpf(e.target.value)}
              />
            </Form>

            <Form>
              <input
                type="text"
                placeholder="Telefone para contato"
                onChange={(e) => setNumeroTel(e.target.value)}
              />
            </Form>
          </PessoalInfo>

          <DadosEntrega>
            <TituloSection>
              <h1>2</h1>
              <h2>Dados de entrega</h2>
            </TituloSection>

            <Form>
              <input
                type="text"
                placeholder="CEP"
                onChange={(e) => setCep(e.target.value)}
              />
            </Form>
            <div style={{ display: "flex", width: "100%" }}>
              <Form>
                <input
                  type="text"
                  placeholder="Complemento"
                  style={{ width: "100%" }}
                />
              </Form>
              <Form>
                <input
                  type="text"
                  placeholder="Número de residência"
                  style={{ width: "100%" }}
                  onChange={(e) => setNumResid(e.target.value)}
                />
              </Form>
            </div>

            <Form>
              <input
                type="text"
                placeholder="Ponto de Referência"
                onChange={(e) => setRef(e.target.value)}
              />
            </Form>
            <Form>
              <input type="text" placeholder="Cidade" />
            </Form>
            <Form>
              <input type="text" placeholder="Bairro" />
            </Form>

            <div style={{ display: "flex", width: "100%" }}>
              <Form>
                <input
                  type="text"
                  placeholder="Numero da rua"
                  style={{ width: "100%" }}
                  onChange={(e) => setRuaNum(e.target.value)}
                />
              </Form>
              <Form>
                <input type="text" placeholder="UF" style={{ width: "100%" }} />
              </Form>
            </div>
            <Form>
              <input type="text" placeholder="Nome da rua" />
            </Form>
          </DadosEntrega>

          <DadosCartao>
            <TituloSection>
              <h1>3</h1>
              <h2>Dados do cartão</h2>
            </TituloSection>

            <Direita>
              <Cartões>
                <PagBotao onClick={()=>setMetodoPagamento("cartao")}><IoMdCard size="25px" /></PagBotao>
                <PagBotao onClick={()=>setMetodoPagamento("")}><IoIosBarcode size="25px" /></PagBotao>
              </Cartões>
              <InfoCartao>
               
                { metodoPagamento === "cartao" ?
                 (<InputsCartao>
                    <Cards 
                      number={numeroCartao}
                      name={nomeCartao}
                      expiry={dataExpiracao}
                      cvc={cvv}
                      focused={focus}
                    />
                      <Form>
                        <input
                          type="tel"
                          placeholder="Número do cartão"
                          value={numeroCartao}
                          onChange={(e) => setNumeroCartao(e.target.value)}
                          onFocus={(e)=> setFocus(e.target.name)}
                        />
                      </Form>

                      <Form>
                        <input
                          type="text"
                          placeholder="Nome escrito no cartão"
                          value={nomeCartao}
                          onChange={(e) => setNomeCartao(e.target.value)}
                          onFocus={(e)=> setFocus(e.target.name)}
                        />
                      </Form>
                      <Baixo>
                        <Form3>
                          <input
                            type="tel"
                            placeholder="Data expiração"
                            value={dataExpiracao}
                            onChange={(e) => setDataExpiracao(e.target.value)}
                            onFocus={(e)=> setFocus(e.target.name)}
                          />
                        </Form3>

                        <Form2>
                          <input
                            type="tel"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            onFocus={(e)=> setFocus(e.target.name)}
                          />
                        </Form2>
                      </Baixo>
                      <Botao onClick={() => RealizarCompra()}>
                        <h2>Finalizar</h2>
                      </Botao>
                   </InputsCartao>
                  ) 
                : 
                (<button onClick={()=>PagarBoleto()}>Gerar Boleto</button>) }
                
                
                 

                
              </InfoCartao>
            </Direita>
          </DadosCartao>
          
        </Compra>
        
        <CarrinhoDeCompras>
          <h1>Produtos no carrinho</h1>
            {items.map(e=>{
              return(
                <Produto>
                      <img src={e.img} alt=""/>
                    <div>
                      <h1>{e.produto}</h1>
                      <span>{e.descrisao}</span>
                    </div>
                    <ul>
                    <h2>Qtd: {e.quantidade}</h2>
                    <h2>Preço: {e.preco}</h2> 
                    </ul>
                </Produto>
              )
            })}
            
        </CarrinhoDeCompras>
      </Container>
    </>
  );
}
