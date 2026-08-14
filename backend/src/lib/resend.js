import {Resend} from 'resend';
import dotenv from 'dotenv'
dotenv.config()

// import 'dotenv/config'
export const resendClient = new Resend(process.env.EMAIL_API_KEY)
export const sender = {
    "email" : process.env.EMAIL_FROM,
    "name":process.env.EMAIL_FROM_NAME
}