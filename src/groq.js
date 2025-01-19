import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";

dotenv.config();

const llm = [
  new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.GROQ_API_KEY_1,
    // other params...
  }),
  new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.GROQ_API_KEY_2,
    // other params...
  }),
  new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.GROQ_API_KEY_3,
    // other params...
  }),
  new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.GROQ_API_KEY_4,
    // other params...
  }),
];

export async function analyzeAgreement(agreementText) {
  //break into 1000 character parts and then analyze each part in round robin fashion

  //instead of a direct split by characters, divide by fullstop or line end and then reach closest or slightly lesser than 1000 characters per part
  const sentences = agreementText.split(/(?<=[.!?])\s+/);
  const parts = [];
  let currentPart = "";

  for (const sentence of sentences) {
    if ((currentPart + sentence).length <= 1000) {
      currentPart += sentence + " ";
    } else {
      parts.push(currentPart.trim());
      currentPart = sentence + " ";
    }
  }

  if (currentPart.length > 0) {
    parts.push(currentPart.trim());
  }

  const results = [];
  for (let i = 0; i < parts.length; i++) {
    const llm_number = i % llm.length;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const result = await analyzeAgreementParts(parts[i], llm_number);
    results.push(result);
  }
  console.log(results);
  //merge the results
  const finalResult = {
    draftedBy: results[0].draftedBy,
    draftedFor: results[0].draftedFor,
    description: results[0].description,
    nonNegotiableClauses: [],
    deadlines: [],
    termsAndConditions: [],
  };
  for (let i = 0; i < results.length; i++) {
    finalResult.nonNegotiableClauses = finalResult.nonNegotiableClauses.concat(
      results[i].nonNegotiableClauses
    );
    finalResult.deadlines = finalResult.deadlines.concat(results[i].deadlines);
    finalResult.termsAndConditions = finalResult.termsAndConditions.concat(
      results[i].termsAndConditions
    );
  }
  return finalResult;
}

async function analyzeAgreementParts(agreementText, llm_number) {
  const aiResponse = await llm[llm_number].invoke([
    {
      role: "system",
      content: `You are a helpful assistant that analyzes agreements. Extract the following information from the provided agreement text:
                        1. Who the agreement is drafted by.
                        2. Who the agreement is drafted for.
                        3. A description in 2 lines about the agreement.
                        4. Non-negotiable clauses in the agreement that should make sense when presented by themselves and should not be short.
                        5. Deadlines that should be met along with what should be met at those deadlines as a pair. If no exact date mentioned, do not include it in the list. Do not explicitly remarks about this.
                        6. Terms and conditions of the agreement in atleast 1 to 2 sentences and NO LESS. Provide a rating out of 5 in favour of the draftedFor party based on the agreement according to the current industry standards in India. If it harms the drafterFor party, then 1, if it's very much balanced then 3, if it's very much in favor of the drafterFor party, then 5 for each term/condition in the list made. This rating is provided alongside the term/condition in the list itself. The list is a list of lists with first element of the sublist being the term and the second element being the rating. If a rating cannot be given, then rate it 0 and do not explicitly remark on it's inaccuracies.
                        You are a backend machine not talking to a real user, so you don't have to add anything other than inside the JSON. Any issues or concerns should be writeen in the notes column or avoided overall together.
                        These should be provided in the form of a JSON like the following with only the JSON present and nothing else in the response. If there is something that cannot be deciphered do not include it and IGNORE IT. DO NOT ADD ANYTHING OUTSIDE THE JSON IN ANY SITUATION POSSIBLE AS IT IS DETRIMENTAL TO THE WHOLE SYSTEM AND CAN BREAK IT:
                        
                        {
                                "draftedBy": "person/organization 1",
                                "draftedFor": "person/organization 2",
                                "description": "This agreement is for the sale of a car.",
                                "nonNegotiableClauses": ["Clause 1 detailed", "Clause 2 detailed"],
                                "deadlines": [
                                        {
                                                "date": "2023-01-01 or if there is no exact date mentioned, then ignore and do not add here, also do not notify the user that you have ignored this",
                                                "description": "Payment of $1000"
                                        },
                                        {
                                                "date": "2023-02-01",
                                                "description": "Delivery of the car"
                                        }
                                ],
                                "termsAndConditions": [["long terms/condition 1 and should not include small conditions", 2], ["long terms/condition 2 and should not include small conditions", <term2 rating here>]],
                                "notes": "This is where you put all observations and notes about everything you were going to put outside the JSON so that the structure is not spoiled and the machine can still parse it successfully. Keep notes as short as possible in 10 words or less. Do not forget to add the last bracket in the JSON"
                        }
                                
                        Always begin and end the output with curly brackets as it is a JSON`,
    },
    { role: "user", content: agreementText },
  ]);

  console.log(
    "\x1b[32m%s\x1b[0m",
    "**********************************************"
  );
  console.log(aiResponse);
  console.log(
    "\x1b[32m%s\x1b[0m",
    "**********************************************"
  );
  let jsonResponse;
  try {
    jsonResponse = JSON.parse(aiResponse.content);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    jsonResponse = {
      draftedBy: "undefined",
      draftedFor: "undefined",
      description: "undefined",
      nonNegotiableClauses: [],
      deadlines: [],
      termsAndConditions: [],
    };
  }

  return jsonResponse;
}

export async function generateAgreement(category, answers, templateContent) {
  // Create a mapping of answers to placeholders
  let agreement = templateContent;

  // Replace the date in the first line
  agreement = agreement.replace(
    '___ day of ________, 20',
    answers.lease_date
  );

  // Replace landlord details
  agreement = agreement.replace(
    '[Landlord\'s Full Name]',
    answers.landlord_name
  ).replace(
    '[Landlord\'s Address]',
    answers.landlord_contact_address
  );

  // Replace tenant details
  agreement = agreement.replace(
    '[Tenant\'s Full Name]',
    answers.tenant_name
  ).replace(
    '[Tenant\'s Address]',
    answers.tenant_contact_address
  );

  // Replace property address
  agreement = agreement.replace(
    '[Complete Address of the Property]',
    answers.property_address
  );

  // Replace lease terms
  agreement = agreement.replace(
    '[Start Date]',
    answers.lease_term_start
  ).replace(
    '[End Date]',
    answers.lease_term_end
  );

  // Replace rent details
  agreement = agreement.replace(
    '₹[Amount]',
    `₹${answers.monthly_rent}`
  ).replace(
    '[Due Date]',
    answers.rent_due_date
  );

  // Replace security deposit
  agreement = agreement.replace(
    'security amount of ₹[Amount]',
    `security amount of ₹${answers.monthly_rent * 2}`
  );

  // Replace pet policy
  agreement = agreement.replace(
    '[Specify pet policy: e.g., "Pets are not allowed on the premises." or "Pets are allowed with prior written consent and may require an additional deposit."]',
    `Pets are ${answers.allow_pets} on the premises`
  );

  // Replace notice period
  agreement = agreement.replace(
    '[Notice Period, e.g., "30 days"]',
    '30 days'
  );

  // Replace governing law
  agreement = agreement.replace(
    '[State/Country]',
    'India'
  );

  // Add additional sections for keys, inspection, and guests
  const additionalSections = `\n12. Keys and Security

The Tenant acknowledges receipt of all keys and access devices. In case of loss or damage, the Tenant shall pay ₹${answers.key_replacement_fee} for replacement.

13. Property Inspection

If the property is unoccupied for 4 or more consecutive days, ${answers.inspection_contact} will inspect the property to ensure its security.

14. Guest Policy

Guests may stay for up to ${answers.guest_stay_limit} days without written permission from the Landlord.

15. Additional Contact Information

For all notices under this Agreement:

Landlord Contact Phone: ${answers.landlord_contact_phone}
Tenant Contact Phone: ${answers.tenant_contact_phone}`;

  // Insert additional sections before the witness section
  agreement = agreement.replace(
    /IN WITNESS WHEREOF/,
    additionalSections + '\n\nIN WITNESS WHEREOF'
  );

  // Replace signature and witness sections
  const signatureSection = `Landlord: ${answers.landlord_name}              Tenant: ${answers.tenant_name}

Date: ${answers.agreement_signature_date}          Date: ${answers.agreement_signature_date}

Witnesses:

1. ${answers.landlord_name}                     2. ${answers.tenant_name}
Date: ${answers.agreement_signature_date}        Date: ${answers.agreement_signature_date}`;

  agreement = agreement.replace(
    /Landlord: ___________________________ Tenant: ___________________________\s*\nDate: _______________________________ Date: _______________________________\s*\nWitnesses:\s*\n\s*___________________________ 2\. ___________________________\s*\nDate: _______________________________ Date: _______________________________/,
    signatureSection
  );

  return agreement;
}
