import { sendEmails } from "./email.js";
import fs from "fs";

// DB is a JSON file
const db = JSON.parse(fs.readFileSync("dates.json", "utf-8"));

export async function notifyDeadlines() {
    // in the JSON, the date is of the form 2024-01-25
    const today = new Date().toISOString().split("T")[0];
    // go across every JSON object in the list that is in db, and check if date is today, then send the message in the db to all these recepients.
    for (const obj of db) {
        if (obj.date === today) {
            await sendEmails(obj.to_notify, obj.message);
        }
    }
}
