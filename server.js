const express = require("express");

const { graphqlHTTP } = require("express-graphql");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require("graphql");

const sqlite3 = require("sqlite3").verbose();

const cors = require("cors");

const app = express();

app.use(cors());

// Banco SQLite
const db = new sqlite3.Database("./database/database.db");

db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    idade INTEGER
  )
`);

// Tipo Usuario
const UsuarioType = new GraphQLObjectType({

  name: "Usuario",

  fields: () => ({
    id: { type: GraphQLInt },
    nome: { type: GraphQLString },
    idade: { type: GraphQLInt }
  })
});

// Queries -> GET
const RootQuery = new GraphQLObjectType({

  name: "RootQueryType",

  fields: {

    // Buscar todos usuários
    usuarios: {
      type: new GraphQLList(UsuarioType),

      resolve(parent, args) {

        return new Promise((resolve, reject) => {

          db.all(
            "SELECT * FROM usuarios",
            [],
            (err, rows) => {

              if (err) reject(err);

              resolve(rows);
            }
          );
        });
      }
    }
  }
});

// Mutations
// POST / PUT / DELETE

const Mutation = new GraphQLObjectType({

  name: "Mutation",

  fields: {

    // Criar usuário
    adicionarUsuario: {

      type: UsuarioType,

      args: {
        nome: { type: GraphQLString },
        idade: { type: GraphQLInt }
      },

      resolve(parent, args) {

        return new Promise((resolve, reject) => {

          db.run(
            "INSERT INTO usuarios(nome, idade) VALUES(?, ?)",
            [args.nome, args.idade],

            function (err) {

              if (err) reject(err);

              resolve({
                id: this.lastID,
                nome: args.nome,
                idade: args.idade
              });
            }
          );
        });
      }
    },


    // Atualizar usuário
    atualizarUsuario: {

      type: UsuarioType,

      args: {
        id: { type: GraphQLInt },
        nome: { type: GraphQLString },
        idade: { type: GraphQLInt }
      },

      resolve(parent, args) {

        return new Promise((resolve, reject) => {

          db.run(
            `
            UPDATE usuarios
            SET nome = ?, idade = ?
            WHERE id = ?
            `,
            [args.nome, args.idade, args.id],

            function (err) {

              if (err) reject(err);

              resolve({
                id: args.id,
                nome: args.nome,
                idade: args.idade
              });
            }
          );
        });
      }
    },


    // Deletar usuário
    deletarUsuario: {

      type: GraphQLString,

      args: {
        id: { type: GraphQLInt }
      },

      resolve(parent, args) {

        return new Promise((resolve, reject) => {

          db.run(
            "DELETE FROM usuarios WHERE id = ?",
            [args.id],

            function (err) {

              if (err) reject(err);

              resolve("Usuário deletado");
            }
          );
        });
      }
    }
  }
});

// Schema GraphQL
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

// Endpoint GraphQL
app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

// Servidor
app.listen(3000, () => {
  console.log("Servidor GraphQL rodando");
});