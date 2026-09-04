import { buildApp } from "./app";
import { env } from "./env";


const app = buildApp();

app.listen({port: env.PORT_API, host:env.HOST}, (err,address)=>{
    if(err){
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`App is running at: ${address}`)
})