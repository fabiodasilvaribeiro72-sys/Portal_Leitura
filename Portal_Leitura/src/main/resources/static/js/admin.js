async function carregarClientes(){

 const resposta = await fetch("http://localhost:8080/cliente/listar");

 if(!resposta.ok){
  alert("Erro ao carregar clientes");
  return;
 }

 const clientes = await resposta.json();

 mostrarClientes(clientes);
}


function mostrarClientes(lista){

 const tabela = document.getElementById("lista-clientes");

 tabela.innerHTML = "";

 lista.forEach(cliente =>{

  const enderecoEntrega = cliente.enderecosEntrega?.[0];
  const enderecoCobranca = cliente.enderecosCobranca?.[0];

  tabela.innerHTML += `
  <tr>

    <td>${cliente.id}</td>
    <td>${cliente.nome}</td>
    <td>${cliente.email}</td>
    <td>${cliente.telefone}</td>

    <td>
    ${enderecoEntrega
      ? `${enderecoEntrega.logradouro} - ${enderecoEntrega.bairro} - ${enderecoEntrega.numero} - ${enderecoEntrega.estado}`
      : ""}
    </td>

    <td>
    ${enderecoCobranca
      ? `${enderecoCobranca.logradouro} - ${enderecoCobranca.bairro} - ${enderecoCobranca.numero} - ${enderecoCobranca.estado}`
      : ""}
    </td>

    <td>${cliente.cpf}</td>

    <td>${cliente.ativo ? "Ativo" : "Inativo"}</td>

    <td>

      <button onclick="abrirModal(${cliente.id}, '${cliente.nome}', '${cliente.email}', '${cliente.telefone}')">
        Editar
      </button>

      <button onclick="inativar(${cliente.id})">
        Inativar
      </button>

    </td>

  </tr>
  `;
 });
}


function abrirModal(id, nome, email, telefone){

 document.getElementById("modalEditar").style.display = "flex";

 document.getElementById("editId").value = id;
 document.getElementById("editNome").value = nome;
 document.getElementById("editEmail").value = email;
 document.getElementById("editTelefone").value = telefone;
}


function fecharModal(){
 document.getElementById("modalEditar").style.display = "none";
}


async function atualizar(){

 const id = document.getElementById("editId").value;

 const cliente = {
  nome: document.getElementById("editNome").value,
  email: document.getElementById("editEmail").value,
  telefone: document.getElementById("editTelefone").value
 };

 const resposta = await fetch(`http://localhost:8080/cliente/${id}`,{
  method:"PUT",
  headers:{
   "Content-Type":"application/json"
  },
  body: JSON.stringify(cliente)
 });

 if(!resposta.ok){
  alert("Erro ao atualizar cliente");
  return;
 }

 alert("Cliente atualizado!");

 fecharModal();
 carregarClientes();
}


async function inativar(id){

 if(!confirm("Deseja inativar este cliente?")){
  return;
 }

 const resposta = await fetch(`http://localhost:8080/cliente/inativar/${id}`,{
  method:"PUT"
 });

 if(!resposta.ok){
  alert("Erro ao inativar cliente");
  return;
 }

 alert("Cliente inativado!");

 carregarClientes();
}



carregarClientes();
