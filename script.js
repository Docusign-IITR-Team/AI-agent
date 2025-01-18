import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import {readdirSync} from 'fs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

var vectorStore;
function setVectorStore(vs){
    vectorStore = vs;
}
function getVectorStore(){
    return vectorStore;
}
dotenv.config();
// Function to create vector embedding for a .txt file and store in ChromaDB
export async function createAndStoreEmbedding(folderPath, apiKey, collectionName) {
    try {
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: apiKey,
            model: "embedding-001"
        });
        console.log("asd");
           const vectorStore = new Chroma(embeddings, {
                collectionName: collectionName,
                collectionMetadata: {
                    "hnsw:space": "cosine",
                }, 
            });
        // }
        // setVectorStore(vectorStore);
        // console.log("asd");
        // data.termsAndConditions.forEach(async (termGroup, groupIndex) => {
        // // console.log(termGroup);
        // // console.log(termGroup[0])
        // // termGroup.forEach((term, termIndex) => {
        // //     console.log(term);
        // // });
        // //     if (term == 'string') {
        // //         const content = readFileSync("./documents/agreementcopy2.txt", 'utf8');
                // const document = { pageContent: termGroup[0], metadata: { source: filePath } };
                // await vectorStore.addDocuments([document]);
        // //     } else if (typeof term === 'number') {
        // //         console.log(`   ${termIndex + 1}. Value: ${term}`);
        // //     } else {
        // //         console.log(`   ${termIndex + 1}. Unknown format`);
        // //     }
        // //     });
        // });
        
        // console.log(vectorStore["ids"]);


        const files = fs.readdirSync(folderPath);
        files.forEach(async (file) => {
                const filePath = path.join(folderPath, file);

                // Ensure it is a file (not a directory)
                if (fs.lstatSync(filePath).isFile()) {
                     const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
                    for (let i = 0; i < lines.length; i += 5) {
                        const batch = lines.slice(i, i + 5).join('\n');
                        // console.log('\nBatch:\n' + batch);
                        const document = { pageContent: batch, metadata: { source: filePath } };
                        await vectorStore.addDocuments([document]);
                    }
                    
        console.log(`Document from ${filePath} has been embedded and stored in ChromaDB.`);
                }
        
            });

        // vectorStore.dele
        setVectorStore(vectorStore);
        // for (const [doc, score] of retrieverSimilarity) {
        //     console.log(
        //         `* [SIM=${score.toFixed(3)}] ${doc.pageContent} [${JSON.stringify(
        //         doc.metadata
        //         )}]`
        //     );
        // }
    } catch (error) {
        console.error('Error creating and storing embedding:', error);
    }
}

export async function AddFile( filePath ) {
    vectorStore = getVectorStore();
    if (fs.lstatSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
       for (let i = 0; i < lines.length; i += 5) {
           const batch = lines.slice(i, i + 5).join('\n');
           // console.log('\nBatch:\n' + batch);
           const document = { pageContent: batch, metadata: { source: filePath } };
           await vectorStore.addDocuments([document]);
       }
       
   }
    console.log(`Document from ${filePath} has been embedded and stored in ChromaDB.`);
   setVectorStore(vectorStore);
}
export async function fetchRelatedDoc(query) {
    // const embeddings = new GoogleGenerativeAIEmbeddings({
    //         apiKey: apiKey,
    //         model: "embedding-001"
    //     });
    // // vectorStore = getVectorStore();
    // vectorStore = await Chroma.fromExistingCollection(embeddings, {collectionName});
    console.log(query)
    const vectorStore = getVectorStore(); 
    // var similarityContent
    // const similaritySearchWithScoreResults =
    //     await vectorStore.similaritySearchWithScore(query, 1);

    //     for (const [doc, score] of similaritySearchWithScoreResults) {
    //         console.log(
    //             `* [SIM=${score.toFixed(3)}] ${doc.pageContent} [${JSON.stringify(
    //             doc.metadata
    //             )}]`
    //         );
    //     }

        const retriever = vectorStore.asRetriever({
            k: 1,
        //     searchType: 'mmr',
        // searchKwargs: { alpha: 0.5 },
        });
        const retrieverSimilarity = await retriever.invoke(query)
        // console.log(retrieverSimilarity);
        const jsonresp = {
            // similaritySearchWithScoreResults: similarityS/earchWithScoreResults,
            retrieverSimilarity: retrieverSimilarity
        };
        console.log(jsonresp)
        return jsonresp
       
    }  
async function deleteVectorStore(collectionName) {
    vectorStore = await Chroma.fromExistingCollection(embeddings, collectionName);
    if (await vectorStore.ensureCollection()){
        // vectorStore.delete();
    }
} 
// Example usage
// (async () => {
//     // await deleteVectorStore("foo");
//     const filePath = './data/'; // Path to your .txt file
//     const apiKey = 'AIzaSyB4GJvBTvyuN1nTjZcZUepgK-VoZ1a6kGU'; // Replace with your Google GenAI API key
//     const collectionName = 'foo'; // Name of the ChromaDB collection
//     const query = "Notify the Client in case of legal compliance hazards"
//     await createAndStoreEmbedding(filePath, apiKey, collectionName);
//     await fetchRelatedDoc(apiKey, query, collectionName);
//     // await fetchRelatedDoc(apiKey, query, collectionName);
// })();


// docker run -p 8000:8000 chromadb/chroma
// docker pull chromadb/chroma 