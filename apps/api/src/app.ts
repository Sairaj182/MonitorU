import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyCron from 'fastify-cron'

import { env } from "./env"
import { registerRoutes } from "./routes/index.ts"
export function buildApp() {

    const app = Fastify({
        logger: { level: "debug" },
        trustProxy: true,
    })

    app.register(fastifyCors, {
        origin: env.CORS_ORIGIN,
        methods: ["GET"]
    });

    registerRoutes(app);

    app.register(fastifyCron, {
        jobs: [
            {
                cronTime: '0 * * * *',
                onTick: async () => {
                    try {
                        console.log("cron started")

                        await fetch(`http://${env.HOST}:${env.PORT_API}/cron-test`)
                        console.log("cron completed");
                    } catch (err) {
                        console.log(err);
                    }

                },
                startWhenReady: true
            }
        ]
    })
    return app;

}