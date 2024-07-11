// Aula 02
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from '../errors/client-error'
import { env } from '../env'


export async function confirmParticipantes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        '/paticipantes/:participantId/confirm',
        {
            schema: {
                params: z.object({
                    //tripId: z.string().uuid(),
                    participantId: z.string().uuid(),
                })
            }
        }, async (request, reply) => {

            const { participantId } = request.params
           
            const participante = await prisma.participante.findUnique({
                where: { id: participantId },
            })

            if (!participante) {
                throw new Error(`Participante não encontrado.`)
            }

            if (participante.is_confirmed) {
              return reply.redirect(`${env.WEB_BASE_URL}/trips/${participante.trip_Id}`)  
            }
            
            await prisma.participante.update({
                where: { id: participantId },
                data: { is_confirmed: true },
            })


            return reply.redirect(`${env.WEB_BASE_URL}/trips/${participante.trip_Id}`)
            
        },
    )
}