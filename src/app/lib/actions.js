"use server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
//import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { RetrievalQAChain } from "langchain/chains";
import * as dotenv from "dotenv";

dotenv.config();
let chain;
// Load Doc and create VectorStore
export async function loadDocsAndCreateVectorStore() {
  console.log("Init started..");
  const loader = new PDFLoader("src/documents/Constitution_India_subset.pdf");
  const docs = await loader.load();

  // splitter function
  const splitter = new RecursiveCharacterTextSplitter({
    //separators: "\n",
    chunkSize: 1000,
    chunkOverlap: 150,
    //lengthFunction:length
  });

  // created chunks from pdf
  const splittedDocs = await splitter.splitDocuments(docs);

  //generating embedding
  const embeddings = new OpenAIEmbeddings();

  //creating vector store
  const vectorStore = await FaissStore.fromTexts(splittedDocs, "", embeddings);
  //const vectorStore = await HNSWLib.fromDocuments(splittedDocs, embeddings);

  //get user question
  //const question = "Who can be president of India?";
  //What is the age for right to education?
  //Can you summarize the process of election of the president of India?

  //do similarity search
  const vectorStoreRetriever = vectorStore.asRetriever();
  //define the LLM
  const model = new OpenAI({
    //openAIApiKey: OPENAI_API_KEY,
    //temperature: 0,
    //maxTokens: 1000,
    modelName: "gpt-3.5-turbo",
  });
  //chain -> take the question, get relevant document, pass it to the LLM, generate the output
  chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
  console.log("Doc loaded and VectorStore Create!!");
  /*
  const answer = await chain.invoke({
    query: question,
  });
  //output results
  console.log({
    question,
    answer,
  });
  */
}

export async function getAnswer(question) {
  if (!question || !question.trim()) return;
  const answer = await chain.invoke({
    query: question,
  });
  return {
    question,
    answer,
  };
}
