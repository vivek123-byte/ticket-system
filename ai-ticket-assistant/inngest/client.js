
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ticketing-system", 
  name: "Ticketing System",
  apiUrl: process.env.INNGEST_API_URL, 
});
