import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmails(email_addresses){
    for (const email of email_addresses){
        await resend.emails.send({
        from: 'agright.ai@resend.dev',
        to: email,
        subject: `Your Agreement's Deadline is approaching!`,
        html: `
        <p>Hello,</p>
        <p>This is a friendly reminder that the deadline for your agreement is approaching. Please make sure to complete the following tasks:</p>
        <ul>
            <li>Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
        </ul>
        `
        });
    }
}