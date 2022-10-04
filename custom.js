/* Inicio listar os registros do banco de dados */
const tbody = document.querySelector(".listar-usuarios");
const cadForm = document.getElementById("cad-usuario-form");
const msgAlertaErroCad = document.getElementById("msgAlertaErroCad");
const msgAlerta = document.getElementById("msgAlerta");
const cadModal = new bootstrap.Modal(document.getElementById("cadUsuarioModal"));
const form = document.getElementById('form');



// Funcao para listar os registros do banco de dados

const listarUsuarios = async (pagina) => {

    // Fazer a requisicao para o arquivo PHP responsavel em recuperar os registros do banco de dados
    const dados = await fetch("./listexped.php?pagina=" + pagina);

    // Ler o objeto retornado pelo arquivo PHP
    const resposta = await dados.json();
    console.log(resposta);

    // Acessa o IF quando nao encontrar nenhum registro no banco de dados
    if (!resposta['status']) {
        // Envia a mensagem de erro para o arquivo HTML que deve ser apresentada para o usuario
        document.getElementById("msgAlerta").innerHTML = resposta['msg'];
    } else {
        // Recuperar o SELETOR do HTML que deve receber os registros
        const conteudo = document.querySelector(".listar-usuarios");

        // Somente acessa o IF quando existir o SELETOR ".listar-usuarios"
        if (conteudo) {

            // Enviar os dados para o arquivo HTML
            conteudo.innerHTML = resposta['dados'];
            
        }
    }
}

// Chamar a funcao para listar os registro do banco de dados
listarUsuarios(1);


//Cadastrar os pedidos
cadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const dadosForm = new FormData(cadForm);
    dadosForm.append("add", 1);

    document.getElementById("cad-usuario-btn").value = "Salvando...";
    
    const dados = await fetch("cadastrarexpedum.php", {
        method: "POST",
        body: dadosForm,
        
    });

    const resposta = await dados.json();
    
    if(resposta['erro']){
        msgAlertaErroCad.innerHTML = resposta['msg'];
    }else{
        msgAlerta.innerHTML = resposta['msg'];
        cadForm.reset();
        cadModal.hide();
        listarUsuarios(1);
    }
    document.getElementById("cad-usuario-btn").value = "Enviar";
});

/* Fim listar os registros do banco de dados */

/* Inicio substituir o texto pelo campo na tabela */
// Funcao responsavel em substituir o texto pelo campo na tabela e receber o ID do registro que sera editado

function editar_registro(id) {
    // Ocultar o botao editar
    document.getElementById("botao_editar" + id).style.display = "none";
    console.log("acessou o editar: " + id);

    // Apresentar o botao salvar
    document.getElementById("botao_salvar" + id).style.display = "block";

    // Recuperar os valores do registro que esta na tabela
    var datahora = document.getElementById("valor_datahora" + id);
    var numeronf = document.getElementById("valor_numeronf" + id);
    var exped = document.getElementById("valor_exped" + id);
    var quemrecebeu = document.getElementById("valor_quemrecebeu" + id);
    var statusdep = document.getElementById("valor_statusdep" + id);

    





    // Substituir o texto pelo campo e atribuir para o campo o valor que estava na tabela
    datahora.innerHTML = "<input type='text' id='datahora_text" + id + "' value=''" + datahora.innerHTML + "'>";
    numeronf.innerHTML = "<input type='text' id='numeronf_text" + id + "' value='" + numeronf.innerHTML + "'>";
    exped.innerHTML = "<input type='text' id='exped_text" + id + "' value='" + exped.innerHTML + "'>"; //prestar bem atenção se está referenciado o '_text' se não retorna valor nulo 'null'
    quemrecebeu.innerHTML = "<select name='quem' id='quem" + id + "'><option value='MAX'>MAX</option><option value='DUDU'>DUDU</option><option value='TINGA'>TINGA</option> </select>";
    statusdep.innerHTML = "<input type='text' id='statusdep_text" + id + "' value='" + statusdep.innerHTML + "'>";


}

/* Fim substituir o texto pelo campo na tabela */

/* Inicio editar o registro no banco de dados */
// Funcao resposavel em salvar no banco de dados e receber o id do registro que deve ser editado

async function salvar_registro(id) {
    // Recuperar os valore dos campos
    var datahora_valor = document.getElementById("datahora_text" + id).value;
    var numeronf_valor = document.getElementById("numeronf_text" + id).value;
    var exped_valor = document.getElementById("exped_text" + id).value;
    var quemrecebeu_valor = document.getElementById("quem" + id).value;
    var statusdep_valor = document.getElementById("statusdep_text" + id).value;
    

    // Prepara a STRING de valores que deve ser enviado para o arquivo PHP responsavel em salvar no banco de dados
    var dadosForm = "id=" + id + "&datahora=" + datahora_valor + "&numeronf=" + numeronf_valor + "&exped=" + exped_valor + "&quemrecebeu=" + quemrecebeu_valor +  "&statusdep=" + statusdep_valor;
    console.log();

    // Fazer a requisicao com o FETCH para um arquivo PHP e enviar atraves do metodo POST os dados do formulario
    const dados = await fetch("editarexpedum.php", {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dadosForm
        
    });

    // Ler o objeto, a resposta do arquivo PHP
    const resposta = await dados.json();

    // Acessa o IF quando nao conseguir editar no banco de dados
    if (!resposta['status']) {
        // Envia a mensagem de erro para o arquivo HTML que deve ser apresentada para o usuario
        document.getElementById("msgAlerta").innerHTML = resposta['msg'];
    } else {
        // Envia a mensagem de sucesso para o arquivo HTML que deve ser apresentada para o usuario
        document.getElementById("msgAlerta").innerHTML = resposta['msg'];

        // Chamar a funcao para remover a mensagem apos alguns segundos
        removerMsgAlerta();

        // Substituir os campos pelo texto que estava nos campos
        document.getElementById("valor_datahora" + id).innerHTML = datahora_valor;
        document.getElementById("valor_numeronf" + id).innerHTML = numeronf_valor; //se não colocar '_valor' ele até salva mas não oculta o botão salvar!
        document.getElementById("valor_exped" + id).innerHTML = exped_valor;
        document.getElementById("valor_quemrecebeu" + id).innerHTML = quemrecebeu_valor;
        document.getElementById("valor_statusdep" + id).innerHTML = statusdep_valor;


        // Apresentar o botao editar
        document.getElementById("botao_editar" + id).style.display = "block";

        // Ocultar o botao salvar
        document.getElementById("botao_salvar" + id).style.display = "none";
    }
}

/* Fim editar o registro no banco de dados */

/* Inicio remover a mensagem em 5 segundos apos apresentar a mensagem para o usuario */
function removerMsgAlerta() {
    setTimeout(function () {
        // Substituir a mensagem
        document.getElementById("msgAlerta").innerHTML = "";
    }, 5000);
}
/* Fim remover a mensagem em 5 segundos apos apresentar a mensagem para o usuario */


sistemaexped.php

<?php
include_once "conexao.php";
session_start();
ob_start();

if(isset($_SESSION["usuario"]) && is_array($_SESSION["usuario"])){
require("conexao.php");
$adm = $_SESSION["usuario"][1];
$nome = $_SESSION["usuario"][0];
}else{
	echo "<script>window.location = 'home.php'</script>";
	}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
<link rel="icon" href="Ícone-C-de-Cemear-transparente.ico">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <title>EXPEDIÇÃO 1 | CEMEAR </title>
</head>
    <a href="home.php">VOLTAR AO HOME</a>
<style>
          table{
            background-color:#f0f5f6;
            font-family:Arial;
            padding:15px;
            border-radius:15px;
            margin: 3rem auto;
        }
  thead{
    background-color:whitesmoke;
  }
  body{
  font-family: Arial, Helvetica, sans-serif;
  color: black;
  size: 18pt;
  text-emphasis-color: white;
  text-align:center;
  background-image:url(https://static.wixstatic.com/media/2fbcb5_d276e2a6abc54c47befd5d1a5137a5ab~mv2.jpg);
  background-size:1430px
        }
  .table-bg{
   background: rgba(0, 0, 0, 0.8);
   border-radius: 15px 15px 0 0;
        }
  a{
  color:white;
  padding:15px;
        }
  h1{
  color:black;
        }
  h5{
  color:#323232;
        }
  h4{
    font-family:Times, serif;  
  color:white;
  background-image: linear-gradient(to right, rgb(17, 54, 71), rgb(20, 147, 220));
  padding:15px;
  border-radius:8px;
        }
  form{
    background-color: whitesmoke;
  font-family: Arial, Helvetica, sans-serif;
  color: #1c5d8e;
        }
    </style>
<body>
    <div class="container">
        <div class="row mt-4">
            <div class="col-lg-12">
                <div>
                    <h4>EXPEDIÇÃO 1</h4>
                </div>
            </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div id="table" class="col-lg-12">

            <span class="listar-usuarios"></span> <!-- span é usado para setar os dados do list(ele que trás os dados para a tabela) -->

            </div>
        </div>
    </div>
    <div class="modal fade" id="cadUsuarioModal" tabindex="-1" aria-labelledby="cadUsuarioModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="cadUsuarioModalLabel">ENVIAR PEDIDO PARA FINANCEIRO</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <form id="cad-usuario-form"> <!-- este seletor será usado no java script (o javascript que vai receber estes dados)-->
      <div class="mb-3"> 
            <label for="datahora" class="col-form-label">REGISTRO</label>
            <input type="datetime-local" name="datahora" class="form-control" id="datahora" autocomplete="on">
          </div>
          <br>
          <div class="mb-3"> 
            <input type="text" name="numeronf" class="form-control" id="numeronf" value="...">
          </div>
          <br>
          <div class="mb-3"> 
            <input type="text" name="exped" class="form-control" id="exped" value="...">
          </div>
          <br>
          <div class="mb-3"> 
            <input type="text" name="quemrecebeu" class="form-control" id="quemrecebeu" value="...">
          </div>
          <br>
        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Fechar</button> <!-- isso era um type button virou um input -->     <!-- cuidar muito bem o posicionamento das DIV'S no FORM pois dá erro no javascript! foi motivo de alguma raiva passada hoje 31/08 kkkkk -->
        <input type="submit" class="btn btn-outline-success"
         id="cad-usuario-btn" value="Enviar" /> 
          </div>
        </form>
        </div>
        <hr>

        <!-- SELETOR "msgAlerta" responsavel em receber a mensagem de sucesso ou erro -->
        <span id="msgAlerta"></span>

        <div class="row">
            <div class="col-lg-12">
                <!-- SELETOR "listar-usuarios" responsavel em receber os registros do banco de dados -->
                <span class="listar-usuarios"></span>
                
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <script src="js\customexped.js"></script>
</body>

</html>
