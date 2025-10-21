
import { Inngest } from 'inngest';


export const inngest = new Inngest({
    id: "paymentscharts",
    ai: { openai: process.env.OPENAI_API_KEY! }
});