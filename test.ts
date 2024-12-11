import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { WrapperTracer, HoneyHiveTracer } from "honeyhive";

const HH_API_KEY = process.env.HH_API_KEY || "";
const HH_API_URL = process.env.HH_API_URL;
const HH_PROJECT = process.env.HH_PROJECT || "";
const HH_PROJECT_ID = process.env.HH_PROJECT_ID || "";

async function initializeTracer(sessionName: string): Promise<HoneyHiveTracer> {
  const tracer = await HoneyHiveTracer.init({
    apiKey: HH_API_KEY,
    project: HH_PROJECT,
    sessionName: sessionName,
  });

  return tracer;
}

async function main() {
  const tracer = await initializeTracer('vercelTest');
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'Write a short story about a cat.',
    experimental_telemetry: {
      isEnabled: true,
      tracer: tracer.getTracer(),
    },
  });

  console.log(result.text);
}

main().catch(console.error);