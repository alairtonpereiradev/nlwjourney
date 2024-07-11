// Aula 02
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from 'nodemailer';
import { z } from "zod";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";
import { env } from "../env";


export async function confirmTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        '/trips/:tripId/confirm',
        {
            schema: {
                params: z.object({
                    tripId: z.string().uuid(),
                })
            }
        }, async (request, reply) => {

            const { tripId } = request.params
            // viagens
            const trip = await prisma.trip.findUnique({
                where: {
                    id: tripId
                },
                // joining
                include: {
                    participantes: {
                        where: { is_owner: false }
                    },
                }
            })

            if (!trip) {
                throw new Error('Viagem não encontrada.')
            }

            if (trip.is_confirmed) {
                return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
            }

            await prisma.trip.update({
                where: { id: tripId },
                data: { is_confirmed: true },
            })

            const formattedStartDate = dayjs(trip.starts_at).format('LL')
            const formattedEndDate = dayjs(trip.ends_at).format('LL')            

            const mail = await getMailClient()

            await Promise.all(
                trip.participantes.map(async (participante) => {
                   // const confimarlink = `${env.API_BASE_URL}/trips/${trip.id}/confirm/$participante.id}`
                    const confimarlink = `${env.API_BASE_URL}/partipantes/$participante.id}/confirm`
                    const message = await mail.sendMail({
                        from: {
                            name: 'Equipe plann.er',
                            address: 'contato@plann.er',
                        },
                        to: participante.email,
                        subject: 'Confirmação sua presença na viagem',
                        html: `
                        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                            Olá, ${participante.name}!
                            
                            <p>Você foi convidado para a viagem <strong>${trip.destination} - ${formattedStartDate} a ${formattedEndDate}</strong> foi confirmada!</p>
                            
                            <p> 
                            <a href="${confimarlink}">Para confirmar, acesse o link:</a></p>
                            
                            <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
                                                        
                            <p>Atenciosamente,</p>
                            
                            <p>Equipe plann.er</p>
                        </div>
                        `.trim(),                        
                    })
                    console.log(nodemailer.getTestMessageUrl(message))
                }),
            )

            return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
            // retorna um json
            //return { tripId: request.params.tripId }
        },
    )
}