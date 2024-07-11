# NLW JOURNEY TRILHA BACKEND

# 1. Passo

apt-get install nodejs

npm i eslint

npm i typescript @types/node -D

-D = instala dentro do devDependencies

# 2. Passo

criar arquivo de configuração do typescript

npx tsc --init

# 3. tsconfig bases

https://github.com/tsconfig/bases

# 3.1 Configura o tsconfig.json de acordo com o está no npmjs

https://www.npmjs.com/package/@tsconfig/node20

# 4. mecanismo de conversão typescript para javascript

npm i tsx -D

# 5. Rodar arquivo typyscript

npx tsx src/server.ts

# 5.1 Mante o codigo em execução

npx tsx watch src/server.ts

# 6. melhoria de execução (package.json)

"scripts": {
    "dev": "npx tsx watch src/server.ts"
  },

# 6.1 use o comando 

npm run dev

# 7. instalar o framework fastify

npm i fastify

# 8. instalar o prisma (facilita na criação das tabelas do banco de dados)

npx prisma init --datasource-provider SQLite
npm i @prisma/client

# Obs.:

caso o arquivo .env não seja clonado cria-lo e inserir

DATABASE_url="file:./dev.db"

# 8.1 criando tabelas do banco de dados

npx prisma migrate dev

# 8.2 criar o arquivo src/lib/prisma.ts

# 8.3 Resetar o banco de dados

npx prisma migrate reset

# 8.4 Aplica uma pendencia migrate

npx prisma migrate deploy

npx prisma migrate status

npx prisma generate

# 9. Instalar o zod

https://github.com/turkerdev/fastify-type-provider-zod

npm i zod

npm i fastify-type-provider-zod

# copiar e colar essas duas linhas para o server.ts

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

# Inclua essa linha nas rotas

withTypeProvider<ZodTypeProvider>()

# 10. instalar o dayjs

npm i dayjs

10.1 Formatação de datas

https://day.js.org/docs/en/display/format

import localizedFormat from 'dayjs/plugin/localizedFormat'

# 11. Instalar biblioteca para envio de email

npm i nodemailer

biblioteca auxiliar para roda com type script

npm i --save-dev @types/nodemailer

# 11.1 mailtrap

https://mailtrap.io/home

# 11.2 Ethereal (testar o envio de email)

https://ethereal.email/

# 12. Segurança da aplicação

Quem vai poder consumir a API

npm i @fastify/cors
