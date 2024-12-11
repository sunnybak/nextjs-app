import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import { HoneyHiveTracer } from "honeyhive";

const tracer = await HoneyHiveTracer.init({
  apiKey: "Z29keTJ2OGduMGxqNTRpNWdpeW8waA==",
  project: "agi",
  sessionName: "nextjs",
});


async function getOpenAIResponse() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "What is a server component in NextJS? Respond in 100 words or less." }],
      model: "gpt-4o-mini",
      max_tokens: 100
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return "Failed to load OpenAI response";
  }
}

export default async function ServerComponent() {

  const tracedGetOpenAIResponse = tracer.traceFunction()(getOpenAIResponse);

  // Since we're making an API call, the component needs to be async
  const aiResponse = await tracedGetOpenAIResponse();

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-2xl">
      <h2 className="text-lg font-bold mb-2">Server Component</h2>
      <p className="text-sm mb-4">
        This component is rendered on the server. Current timestamp: {new Date().toISOString()}
      </p>
      <div className="prose dark:prose-invert">
        <h3 className="text-md font-semibold mb-2">OpenAI's explanation of Server Components:</h3>
        <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
      </div>
    </div>
  );
} 