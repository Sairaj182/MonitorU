import { FastifyInstance } from "fastify";
import { env } from "../env";
import notifier from 'node-notifier'

export function registerRoutes(app:FastifyInstance){
    app.get("/", async (request,reply)=>{
        const results = await Promise.all(env.TARGET_URL.map(async (target) => {
            const start = Date.now();
            try {
                const response = await fetch(target, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000)
                });

                const rt = Date.now() - start;

                return {
                    target,
                    reachable: true,
                    statusCode: response.status,
                    rt,
                    healthy: response.ok,
                    message: response.ok
                        ? 'Target is healthy'
                        : 'Target responded with an error'
                };
            } catch (error: any) {
                const rt = Date.now() - start;

                return {
                    target,
                    reachable: false,
                    rt,
                    healthy: false,
                    message: 'Target could not be reached',
                    error: error.message
                };
            }
        }));

        const hasError = results.some(r => !r.healthy);
        if (hasError) {
            reply.code(502);
        }

        return results;
    })
    app.get("/cron-test", async (request,reply)=>{
        const results = await Promise.all(env.TARGET_URL.map(async (target) => {
            const start = Date.now();
            try {
                const response = await fetch(target, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000)
                });

                const rt = Date.now() - start;

                return {
                    target,
                    reachable: true,
                    statusCode: response.status,
                    rt,
                    healthy: response.ok,
                    message: response.ok
                        ? 'Target is healthy'
                        : 'Target responded with an error'
                };
            } catch (error: any) {
                const rt = Date.now() - start;

                return {
                    target,
                    reachable: false,
                    rt,
                    healthy: false,
                    message: 'Target could not be reached',
                    error: error.message
                };
            }
        }));

        const hasError = results.some(r => !r.healthy);
        const errorResults = results.filter(r => !r.healthy);

        if (hasError) {
            notifier.notify({
                title:"Software Monitor",
                message: errorResults.map(r => `${r.target} is down`).join('\n')
            })
            reply.code(502);
        }

        
        return results;
    })
}