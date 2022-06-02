import { createServer, Factory, Model, Response, ActiveModelSerializer } from 'miragejs'
import faker from 'faker'
type User = { 
  name: string;  //defino como se fosse colunas do meu db do mirage
  email: string;
  created_at: string;
}

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },


    models: {  //aqui diz qual tipo de dados vamos ter dentro do mirage
      user: Model.extend<Partial<User>>({}) //pode existir momentos que ue vá usar o User, sem informar todos os campos, então uso o Partial
    },

    factories: {
      user: Factory.extend({ //deve ser o mesmo nome que criei em models
        name(i: number){ //recebe um índice de qual usuário está sendo criado, vamos usar ele para criar os nomes
          return `User ${i + 1}`
        },
        email(){
          return faker.internet.email().toLowerCase(); // irá gerar emails ficticios usando o faker
        },
        createdAt(){
          return faker.date.recent(10) //10 é o quantos dias é recente a criação 
        } //não tem problema sem em CamelCase, a factorie vai entender que estou me referindo a um campo que está em snake_case
      }) 
    },

    seeds(server){
      server.createList('user', 200) //'user' é o nome do factorie e 200 serão qntd de usuários 
    },


    routes() {
      this.namespace = 'api'  // setamos o caminho que nosso app terá que acessar para conseguir chamar as rotas do mirage. Todas as rotas agr vao chamar /api/.. Ex: /api/users

      this.timing = 400; // toda chamada que faço para a API do mirage, demore 750ms, importante para testar os carregamentos, spinners, loadings etc

      this.get('/users', function(schema, request){
        const { page= 1, per_page = 10} = request.queryParams
        const total = schema.all('user').length

        const pageStart = (Number(page) -1) * Number(per_page)
        const pageEnd = pageStart + Number(per_page)

        const users = this.serialize(schema.all('user')).users.slice(pageStart, pageEnd)

        return new Response(
          200, 
          { 'x-total-count': String(total)},
          { users }
        )
      }); // é um shorthand do mirage, ele vai entender automaticamente que quando chamarmos a rota /users, ele deve retornar a lista completa de usuários

      this.get('/users/:id'); // shorthand que cria rota listando os usuários pelo id

      this.post('/users'); //outro shortahand, vai criar a estrutura necessária para criarmos um novo usuário (devemos passar name, email, created_at)

      this.namespace = '' // Por padrão o Next tbm aceita que criamos na pasta pages a pasta api, que dentro dela teremos algumas rotas de api, o caminho delas também é api. Então temos 2 alternativas, ou trocamos o namespace das rotas do mirage, ou resetamos o namespace aqui no final para em branco '', ou seja, ele vai utilizar o namespace lá de cima, mas depois que ele terminar de definir as rotas do mirage (get e post ali de cima), ele volta ao nome original '', para não prejudicar as rotas de api que temos dentro do próprio Next.

      this.passthrough() // vai fazer com que todas as chamdas enviadas p/ o endereço api passem pelo mirage e senão forem detectadsa pelas rotas do mirage, elas passem adiante para suas rotas originais

      this.passthrough('http://localhost:3333/**'); // Ignora todas as rotas de localhost:3333 que não existem no mirage
      
    }
  })

  return server
}

