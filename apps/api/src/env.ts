import {z} from "zod"

const schema = z.object({
    PORT_API: z.coerce.number().default(4000),
    HOST: z.string().default("0.0.0.0"),
    CORS_ORIGIN: z.string().default("localhost:3000")
        .transform((s)=>
            s.split(",").map((o)=>o.trim()).filter(Boolean)
        ),
    TARGET_URL: z.string().default("localhost:3000")
        .transform((s)=>
            s.split(",").map((o)=>o.trim()).filter(Boolean),  
        ),
})

const parsed = schema.safeParse(process.env);

if(!parsed.success) {
    console.log(parsed.error);
    console.log("Terminated...")
    process.exit(1);
}

export const env = parsed.data;