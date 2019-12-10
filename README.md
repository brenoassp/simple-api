
#  Passos para execução do projeto

## Clone o repositório
`git clone git@github.com:brenoassp/simple-api.git`

## Instale as dependências do projeto

### Dependências externas ao projeto
- MongoDB (banco de dados NoSQL)
- Redis (banco de dados em memória para cache)

Ambos os bancos são configurados no arquivo `src/config/index.js`. Instalei os dois pelo gerendiador de pacotes do sistema operacional e utilizei as configurações de host e porta padrão.

#### Exemplo para a instação no ubuntu

**MongoDB**

`sudo apt install -y mongodb`

**Redis** 

`sudo apt-get install redis-server`

#### Execute o serviço dos dois bancos após instalá-los

**Redis** 

`redis-server`

**MongoDB**

`mongod`

### Dependências internas do projeto
As dependências internas dos projetos estão definidas no arquivo `packages.json` e para instalá-las basta executar o comando `npm install`.

## Execute o projeto

`npm run start`

## Testando o autocomplete

Abra o arquivo `public/index.html` e digite um prefixo para pesquisar as possíveis palavras que completam o prefixo. O número de possíveis palavras para completar foi limitado em 20.

# Informações adicionais sobre o projeto

## API

A aplicação consiste em uma API que contém dois endpoints.

### POST /api/events

Recebe um parâmetro `event` no body como `x-www-form-urlencoded` que será o nome do novo evento a ser cadastrado.

`{
	event: 'name new event'
}`

### GET /api/events/:prefix

`:prefix` é substituído pelo prefixo digitado pelo usuário.

**Exemplo:** `localhost:9001/api/events/name`
