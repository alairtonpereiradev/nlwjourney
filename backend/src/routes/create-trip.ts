import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import dayjs from "dayjs";
//import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import nodemailer from 'nodemailer';

//dayjs.locale('pt-br')
dayjs.extend(localizedFormat);

export async function createTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema:{
           body: z.object({
            destination: z.string().min(4),
            starts_at: z.coerce.date(),
            ends_at: z.coerce.date(),
            owner_name: z.string(),
            owner_email: z.string().email(),
            emails_to_invite: z.array(z.string().email()),
           }) 
        },
        }, async (request) => {
        const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = request.body
        
        if (dayjs(starts_at).isBefore(new Date())) {
            throw new Error("Data de inicio invalida. Digite outra data.")
        }

        if (dayjs(ends_at).isBefore(starts_at)) {
            throw new Error("Data de fim invalida. Digite outra data.")
        }



        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at,
                participantes: {
                    createMany: {
                        data: [
                        {
                        name: owner_name,
                        email: owner_email,
                        is_owner: true,
                        is_confirmed: true,
                        },
                        ...emails_to_invite.map(email => {
                            return { email }
                        })
                    ],
                        
                    },
                }
            }
         });
        
        const formattedStartDate = dayjs(starts_at).format('LL')
        const formattedEndDate = dayjs(ends_at).format('LL')
        
        const confimarlink = `http://localhost:3333/trips/${trip.id}/confirm`

        const mail = await getMailClient()

        const message = await mail.sendMail({
            from: {
                name: 'equipe plann.er',
                address: 'contato@plann.er',
            },
            to: {
                name: owner_name,
                address: owner_email,
            },
            subject: 'Nova viagem criada',
            //text: `Olá ${owner_name},\n\nSua viagem para ${destination} foi criada com sucesso. Seguem os dados:\n\nID: ${trip.id}\nDestino: ${destination}\nData de início: ${dayjs(starts_at)}`
            html: `
            <div style="font-family: sans-serif; font-size:16px;line-height:1.6">
            <h1>Olá ${owner_name},</h1>
            <p>Sua viagem para ${destination} foi criada com sucesso. Seguem os dados:</p>
            <ul>
                <li>ID: ${trip.id}</li>
                <li>Destino: ${destination}</li>
                <li>Data de início: <strong>${dayjs(formattedStartDate)}</strong></li>
                <li>Data de Fim: <strong>${dayjs(formattedEndDate)}</strong></li>
            </ul>
            <p>Clique no link abaixo para confirmar sua viagem:</p>
            <a href="${confimarlink}">Confirmar sua viagem</a>
            </div>            
            `.trim(),
        })
        
        console.log(nodemailer.getTestMessageUrl(message));

        return { tripId: trip.id }
    })
}