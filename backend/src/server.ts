import { fastify } from "fastify";
import { prisma } from "./lib/prisma";

const app = fastify();

app.get('/cadastrar', async (req, reply) => {
    await prisma.trip.create({
        data: {
            destination: 'Fortaleza',
            starts_at: new Date,
            ends_at: new Date,
        }
    })
    return { message: 'registro cadastrado com sucesso.' };
});


app.get('/listar', async (req, reply) => {
    const trips = await prisma.trip.findMany();
    
    //return { message: 'Seu arquivo foi encontrado.' };
    return trips;
});

app.listen({ 
    port: 3333 }).then(() => {
        console.log('app listening on port 3333');
    });

