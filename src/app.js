const express = require("express");
const cors = require("cors");
const { json } = require("express");

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

/*It uses express to create a server capable to locally create 
*(via POST), update(via PUT), create Likes (via POST), show all the data stored *(via GET) and delete it via delete repositories with title, url, techs and give likes to it.
*/

const repositories = [];

app.get("/repositories", (request, response) => {
  // TODO
  // GET /repositories: Rota que lista todos os repositórios;
  const param = request.params;

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // TODO
  // POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o link para o github desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto no seguinte formato: { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 }; Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.  

  const { title, url, techs } = request.body;

  id4 = uuidv4();

  const newRepository = { id: id4, title: title, url: url, techs: techs, likes: 0 };
  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
  // PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual ao id presente nos parâmetros da rota;
  const { id } = request.params;
  const { title, url, techs } = request.body;
  console.log(id, title, url, techs);

  const index = repositories.findIndex((repository) => repository.id === id);
  if (index < 0)
    return response.status(400).json('error: bad id argument');

  if (title != null)
    repositories[index].title = title;
  if (url != null)
    repositories[index].url = url;
  if (techs != null)
    repositories[index].techs = techs;

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  // DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id === id);
  console.log(index);
  if (index < 0)
    return response.status(400).json('error: bad id argument');

  repositories.splice(index, 1);

  return response.status(204).json('successfully deleted');

});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  // POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido através do id presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;

  // Dica: Acima utilizamos POST em uma rota, mesmo ela alterando o número de likes do repositório sem criar nada diretamente.

  // Com essa separação, temos diferentes regras de negócio para cada entidade, assim, ao chamar a rota de like e adicionamos apenas um like, podemos interpretar que estamos criando um novo like, e não atualizando os likes.

  // Então por que não usar PUT no lugar de POST? Justamente por estarmos "criando" UM novo like, e não atualizando o número de likes para qualquer outro valor.

  // Talvez fique difícil enxergar por ser apenas um número, mas pense que cada like seja salvo em uma tabela no banco junto do usuário que realizou esse like. Agora fica mais claro que você está criando um novo like, certo?
  const { id } = request.params;
  const index = repositories.findIndex((parameter) => parameter.id === id);
  if (index < 0)
    return response.status(400).json('error: bad id argument');
  repositories[index].likes++;
  return response.status(200).json(repositories[index]);
});

module.exports = app;
