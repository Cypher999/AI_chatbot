import { getToken as OGetToken } from "next-auth/jwt";
export default async function getToken(req){
    const token = await OGetToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        //raw: true, // Allows parsing from raw cookies
        cookieName: "ai-chatbot-token", // Set your custom cookie name here
      });
    return token;
}