import fs from "fs";
import { analyzeAgreement } from "./groq.js";

const agreementText = fs.readFileSync("data/agreement.txt", "utf-8");

analyzeAgreement(agreementText).then((jsonResponse) => {
    fs.writeFileSync("data/results/agreement_result.json", JSON.stringify(jsonResponse, null, 2));
  });

