# NLW JOURNEY TRILHA BACKEND

1. Passo

apt-get install nodejs

npm i eslint

npm i typescript @types/node -D

-D = instala dentro do devDependencies

2. Passo

criar arquivo de configuração do typescript

npx tsc --init

3. tsconfig bases

https://github.com/tsconfig/bases

3.1 Configura o tsconfig.json de acordo com o está no npmjs

https://www.npmjs.com/package/@tsconfig/node20

4. mecanismo de conversão typescript para javascript

npm i tsx -D

5. Rodar arquivo typyscript

npx tsx src/server.ts

5. Mante o codigo em execução

npx tsx watch src/server.ts

6. melhoria de execução (package.json)
"scripts": {
    "dev": "npx tsx watch src/server.ts"
  },

6.1 use o comando 

npm run dev

7. instalar o framework fastify

npm i fastify

8. instalar o prisma (facilita na criação das tabelas do banco de dados)

npx prisma init --datasource-provider SQLite

8.1 criando tabelas do banco de dados

npx prisma migrate dev

8.2 criar o arquivo src/lib/prisma.ts

8.3 Resetar o banco de dados

npx prisma migrate reset

8.4 Aplica uma pendencia migrate

npx prisma migrate deploy

npx prisma migrate status