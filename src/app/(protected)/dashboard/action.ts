"use server"

import { createStreamableValue } from '@ai-sdk/rsc'
import { generateEmbedding } from '@/lib/llm'
import { db } from '@/server/db'
import Cerebras from '@cerebras/cerebras_cloud_sdk'

interface ChatCompletionChunk {
  choices: {
    delta?: {
      content?: string
      role?: string
    }
    index: number
    finish_reason?: string | null
  }[]
}

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY
})

export async function askQuestion(question: string, projectId?: string) {
  const stream = createStreamableValue()

  const embeddings = await generateEmbedding(question)
  if (!embeddings || embeddings.length === 0) {
    throw new Error("Failed to get embeddings")
  }
  const queryVector = embeddings[0]?.values
  const vectorQuery = `[${queryVector?.join(',')}]`

  const result = await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 5
  ` as { fileName: string; sourceCode: string; summary: string }[]

  let context = ''
  for (const doc of result) {
    context += `source: ${doc.fileName} \n code content: ${doc.sourceCode} \n summary of file: ${doc.summary}\n\n`
  }

  ; (async () => {
    const cerebrasStream = await cerebras.chat.completions.create({
      model: 'llama-3.3-70b',
      stream: true,
      // max_completion_tokens: 20000,
      temperature: 0.7,
      top_p: 0.8,
      messages: [
        {
          role: 'system',
          content:`You are a ai code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to   understand the codebase
         AI assistant is a brand new, powerful, human-like artificial intelligence.
         The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
         AI is a well-behaved and well-mannered individual.
         AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
         AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in
         If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instr
         START CONTEXT BLOCK
         ${context}
         END OF CONTEXT BLOCK

         START QUESTION
         ${question}
         END OF QUESTION
         AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
         If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answ
         AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
         AI assistant will not invent anything that is not drawn directly from the context.
         Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, make sure there is`
        }
      ]
    })

    for await (const chunk of cerebrasStream as AsyncIterable<ChatCompletionChunk>) {
      const delta = chunk.choices?.[0]?.delta?.content ?? ''
      if (delta) {
        stream.update(delta)
      }
    }
    stream.done()
  })()

  return {
    output: stream.value,
    fileReferences: result
  }
}
