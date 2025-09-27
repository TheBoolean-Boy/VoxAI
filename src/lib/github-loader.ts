import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'
import { Document } from '@langchain/core/documents'
import { generateEmbedding, summariseCode } from './llm'
import { db } from '@/server/db'


export const loadGithubRepo = async (githubUrl: string, githubToken?: string) =>{
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || '',
    branch: 'main',
    ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.json', 'bun.lock'],
    recursive: true,
    unknown: 'warn',
    maxConcurrency: 5
  })
  const docs = await loader.load()
  return docs
}

export const indexGithubRepo = async(projectId: string, githubUrl: string, githubToken?: string) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const allEmbeddings = await generateEmbeddings(docs)

  await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
    console.log(`processing ${index} of ${allEmbeddings.length}`)
    if (!embedding) return

    const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
      data: {
        // summaryEmbedding: embedding.embedding,
        sourceCode: embedding.sourceCode,
        summary: embedding.summary ?? "",
        fileName: embedding.fileName,
        projectId
      }
    })

    // console.log("Inside gitloader.st", embedding.embedding?.values)
    // const vector = embedding.embedding?.values
    // const vector = `[${embedding.embedding?.values.join(',')}]`
    const embeddings = embedding.embedding;

    if (!embeddings || embeddings.length === 0) {
      return
    }

    const vector = embeddings[0]?.values;
    if(!vector){
      throw new Error("No Vector Embedding found to be inserted")
    }

    // const VectorEmbedding = `[${vector?.join(",")}]`;

    // console.log("THIS IS ONE OF THE VECTOR THAT WILL BE PUSHED TO THE DATABASE ->   ", vector);

    await db.$executeRaw`
    UPDATE "SourceCodeEmbedding"
    SET "summaryEmbedding" = ${vector}::vector
    WHERE "id" = ${sourceCodeEmbedding.id}
    `
  }))
}

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(docs.map( async doc => {
    const summary = await summariseCode(doc)
    const embedding = await generateEmbedding(summary!)
    return {
      summary, 
      embedding,
      sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
      fileName: doc.metadata.source
    }
  }))
}