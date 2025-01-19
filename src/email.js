import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmails(email_addresses, html_message){
    for (const email of email_addresses){
        await resend.emails.send({
        from: 'agright.ai@resend.dev',
        to: email,
        subject: `Your Agreement's Deadline is approaching!`,
        html: html_message
        });
    }
}