import Image from "next/image";
import { loadDocsAndCreateVectorStore } from "./lib/actions";
import Chatbot from "@/components/Chatbot";

export default async function Home() {
  await loadDocsAndCreateVectorStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:flex-row md:pl-16">
      <Image
        src="/Architecture.png"
        alt="Image description"
        width={680}
        height={400}
      />
      <Chatbot />
    </main>
  );
}
