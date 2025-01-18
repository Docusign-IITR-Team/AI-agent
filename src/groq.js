import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  // other params...
});

export async function analyzeAgreement(agreementText) {
  const aiResponse = await llm.invoke([
    {
      role: "system",
      content: `You are a helpful assistant that analyzes agreements. Extract the following information from the provided agreement text:
                        1. Who the agreement is drafted by.
                        2. Who the agreement is drafted for.
                        3. A description in 2 lines about the agreement.
                        4. Non-negotiable clauses in the agreement.
                        5. Deadlines that should be met along with what should be met at those deadlines as a pair.
                        6. Terms and conditions of the agreement in a summarized form. Provide a rating out of 5 in favour of the draftedFor party based on the agreement according to the current industry standards in India. If it harms the drafterFor party, then 1, if it's very much balanced then 3, if it's very much in favor of the drafterFor party, then 5 for each term/condition in the list made. This rating is provided alongside the term/condition in the list itself. The list is alist of lists with first element of the sublist being the term and the second element being the rating.

                        These should be provided in the form of a JSON like the following with only the JSON present and nothing else in the response. If there is something that cannot be deciphered, just leave it as "undefined". DO NOT ADD ANYTHING OUTSIDE THE JSON IN ANY SITUATION POSSIBLE AS IT IS DETRIMENTAL TO THE WHOLE SYSTEM AND CAN BREAK IT:
                        {
                                "draftedBy": "John Doe",
                                "draftedFor": "Jane Doe",
                                "description": "This agreement is for the sale of a car.",
                                "nonNegotiableClauses": ["Clause 1", "Clause 2"],
                                "deadlines": [
                                        {
                                                "date": "2023-01-01",
                                                "description": "Payment of $1000"
                                        },
                                        {
                                                "date": "2023-02-01",
                                                "description": "Delivery of the car"
                                        }
                                ],
                                "termsAndConditions": [["term 1", 2], ["term 2", <term2 rating here]],
                        }`,
    },
    { role: "user", content: agreementText },
  ]);
  
  // console.log("\x1b[32m%s\x1b[0m", "**********************************************");
  // console.log(aiResponse)
  // console.log("\x1b[32m%s\x1b[0m", "**********************************************");
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
