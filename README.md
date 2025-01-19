# Agright.ai

Agright.ai is a workflow management service designed to simplify agreement processes and help stakeholders avoid potential pitfalls in contractual agreements. With Agright.ai, users can generate, manage, and collaboratively edit agreements while ensuring important deadlines and non-negotiable terms are tracked and highlighted effectively.

## Key Features

- **Clause Comparison and Similarity Search**: Identify similar clauses across agreements with embedded vector search and similarity scoring.
- **Agreement Generation**: Automatically generate agreements with clear separation of negotiable and non-negotiable clauses, including highlighting favorable and non-favorable terms.
- **Collaborative Editing and Document Locking**: Allow multiple stakeholders to edit agreements collaboratively with document locking to ensure version control.
- **Automated Reminders**: Create and send reminders based on deadlines or milestones specified within agreements.
- **Detailed Reports**: Generate reports with clause highlights and agreement summaries to simplify decision-making.
- **Secure and Scalable Processing**: Utilize distributed processing and advanced APIs for rapid document handling.

## System Architecture

![piwot drawio](https://github.com/user-attachments/assets/da841a69-c580-4677-befc-6db7d91a6dfd)

Our architecture is designed to handle large-scale agreement management with speed, accuracy, and collaborative capabilities.

### Components

1. **Gemini API**
   - Facilitates search and chat functionality.
   - Integrates with the agreement generator for streamlined query-based suggestions.

2. **Chroma VectorDB**
   - Stores agreement clauses in an embedding format.
   - Enables similarity search and clause comparison for better insights.

3. **Document Chunking and Groq Processing**
   - Splits large documents into manageable chunks for distributed processing.
   - Utilizes round-robin techniques to evade rate limiters and enhance performance.

4. **MongoDB**
   - Serves as the primary database for storing agreements and associated metadata.
   - Manages reminders and tracks deadlines for automated notifications.

5. **SMTP API**
   - Sends email notifications and reminders to stakeholders.

6. **Agright.ai Core**
   - Combines all features, including agreement generation, collaborative editing, clause comparison, and notification management, into one seamless platform.

7. **Witness creation**
   - `witness.co` is used to provide immutable document witnessing on the blockchain so that the agreement cannot be tampered with and can be trusted by all parties.
## Workflow Overview

1. **Search and Compare**  
   Users input a search query, which the system filters through the Gemini API and Chroma VectorDB to identify relevant clauses and agreements.

2. **Agreement Generation**  
   Documents are processed via Groq hardware, chunked for efficiency, and stored in MongoDB. Non-negotiable clauses are separated and highlighted, generating a report for stakeholders.

3. **Collaborative Editing**  
   Agreements are opened in the collaborative editor, enabling multiple stakeholders to contribute while locking documents to prevent conflicts.

4. **Reminders and Notifications**  
   Deadlines and milestones in agreements trigger reminders sent to stakeholders via the SMTP API.

### Required software

- Docker
- Node.js (v21 or above)
- MongoDB
- ChromaDB Docker image
- API access for:
  - Google Cloud
  - 4 different Groq API keys
  - 1 Gemini API key
  - 2 Rebase API keys


