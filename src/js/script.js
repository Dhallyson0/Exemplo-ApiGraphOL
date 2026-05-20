const API = "http://localhost:3000/graphql";


// QUERY -> Buscar usuários
async function carregarUsuarios() {

  const query = `
    query {
      usuarios {
        id
        nome
        idade
      }
    }
  `;

  const response = await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({ query })
  });

  const result = await response.json();

  const usuarios = result.data.usuarios;

  const lista = document.getElementById("lista");

  lista.innerHTML = "";

  usuarios.forEach(usuario => {

    lista.innerHTML += `
      <div class="usuario">

        <div>
          <strong>ID:</strong> ${usuario.id}

          <br>

          <strong>Nome:</strong> ${usuario.nome}

          <br>

          <strong>Idade:</strong> ${usuario.idade}
        </div>

        <div class="acoes">

          <button onclick="editarUsuario(${usuario.id})">
            Editar
          </button>

          <button onclick="deletarUsuario(${usuario.id})">
            Deletar
          </button>

        </div>

      </div>
    `;
  });
}


// MUTATION -> Adicionar usuário
async function adicionarUsuario() {

  const nome = document.getElementById("nome").value.trim();

  const idade = document.getElementById("idade").value;

  const query = `
    mutation {
      adicionarUsuario(
        nome: "${nome}",
        idade: ${Number(idade)}
      ) {
        id
      }
    }
  `;

  await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({ query })
  });

  carregarUsuarios();
}


// MUTATION -> Editar usuário
async function editarUsuario(id) {

  const novoNome = prompt("Novo nome:");

  const novaIdade = prompt("Nova idade:");

  const query = `
    mutation {
      atualizarUsuario(
        id: ${id},
        nome: "${novoNome}",
        idade: ${Number(novaIdade)}
      ) {
        id
      }
    }
  `;

  await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({ query })
  });

  carregarUsuarios();
}


// MUTATION -> Deletar usuário
async function deletarUsuario(id) {

  const query = `
    mutation {
      deletarUsuario(id: ${id})
    }
  `;

  await fetch(API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({ query })
  });

  carregarUsuarios();
}