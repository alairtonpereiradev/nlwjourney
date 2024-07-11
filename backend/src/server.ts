import { fastify } from "fastify";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import { confirmTrip } from "./routes/confirm-trips";
import { confirmParticipantes } from "./routes/confirm-participante";
import { getActivities } from "./routes/get-activities";
import { createActivity } from "./routes/create-activity";
import { createLink } from "./routes/create-links";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { getParticipant } from "./routes/get-participant";
import { createInvite } from "./routes/create-invite";
import { getTripDetails } from "./routes/get-trip-detail";
import { updateTrip } from "./routes/update-trip";
import { env } from "./env";
// import { prisma } from "./lib/prisma";

const app = fastify();

app.register(cors, {
   origin: '*'
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipantes)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(getParticipant)
app.register(createInvite)
app.register(getTripDetails)
app.register(updateTrip)


app.listen({ 
    port: env.PORT }).then(() => {
        console.log('app listening on port 3333');
    });

