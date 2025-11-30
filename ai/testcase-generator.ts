import { Ollama } from 'ollama';
import * as fs from 'fs';
import * as path from 'path';
import { GeneratedScenarios } from './types';

// Configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
const OUTPUT_DIR = path.join(process.cwd(), 'ai-output');

// Ollama client (local LLM server)
const ollama = new Ollama({ host: OLLAMA_HOST });

async function checkOllamaConnection(): Promise<boolean> {
  try {
    await ollama.list();
    return true;
  } catch (error) {
    console.error('\n❌ Cannot connect to Ollama!');
    console.error('   Make sure Ollama is running.');
    console.error('   Download from: https://ollama.ai\n');
    return false;
  }
}

async function generateScenarios(requirement: string): Promise<GeneratedScenarios> {
  const systemPrompt = `You are a senior QA engineer helping to design test scenarios.
Given a user story or requirement, create detailed test scenarios.
Each scenario should be useful for manual or automated testing.
Return ONLY valid JSON, no markdown, no explanations.`;

  const userPrompt = `You are generating test scenarios for Swag Labs e-commerce demo application.

APPLICATION STRUCTURE:
- Login page (/)
- Inventory page (/inventory.html)
- Product detail page
- Shopping cart
- Checkout: information → overview → finish
- Left menu with: logout, reset app state, about, all items

USER ROLES (SauceDemo built-ins):
- standard_user: normal behavior
- problem_user: UI issues (broken images, layout bugs)
- locked_out_user: cannot log in (receives locked-out error)
- visual_user: layout-based differences
- performance_glitch_user: slow transitions

APPLICATION BEHAVIOR (important facts):
- Login requires valid username + password
- Successful login ALWAYS redirects to /inventory.html (no dashboard)
- Error messages appear under the login button
- Inventory shows products with name, description, price, and Add to Cart button
- Cart icon updates the number of items dynamically
- Checkout Information page requires: First Name, Last Name, Zip Code
- Checkout Overview shows item summary, tax, and total price
- Completing checkout shows the "Thank you for your order!" message

TEST ENVIRONMENT:
- Web UI testing only
- Automated using Playwright
- Desktop browser environment

TEST STYLE GUIDELINES:
- Output 5–10 scenarios
- Each scenario must include:
  Title, Type (positive/negative/edge), Preconditions, Steps, Expected Result
- Use real Swag Labs behavior, URLs, and UI flow

NOW THE SPECIFIC REQUIREMENT:
"${requirement}"

Generate test scenarios following the format above. Return ONLY valid JSON in this format:
{
  "requirement": "${requirement}",
  "testScenarios": [
    {
      "id": "SC-001",
      "title": "Scenario title",
      "description": "What we test",
      "type": "positive",
      "priority": "high",
      "preconditions": ["Precondition 1", "Precondition 2"],
      "steps": ["Step 1", "Step 2"],
      "expectedResult": "Expected outcome"
    }
  ]
}`;

  console.log('🤖 Calling AI to generate test scenarios...');
  console.log(`   Model: ${MODEL}`);
  console.log('   This may take 15-30 seconds...\n');

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      options: {
        temperature: 0.3,
        num_predict: 2000,
      },
    });

    const rawText = response.message.content;

    let cleanedText = rawText.trim();
    if (cleanedText.includes('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/\n?```/g, '');
    } else if (cleanedText.includes('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '').replace(/\n?```/g, '');
    }

    let data: GeneratedScenarios;
    try {
      data = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON');
      console.error('Raw response:', rawText.substring(0, 500));
      throw new Error('Invalid JSON from AI');
    }

    data.generatedAt = new Date().toISOString();
    data.model = MODEL;

    return data;
  } catch (error) {
    console.error('❌ Error calling AI:', error);
    throw error;
  }
}

function saveScenarios(data: GeneratedScenarios): string {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `scenarios-${timestamp}.json`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');

  return filepath;
}

function printSummary(data: GeneratedScenarios) {
  console.log('✅ Successfully generated test scenarios!\n');
  console.log('📊 Summary:');
  console.log(`   Total scenarios: ${data.testScenarios.length}`);

  const positiveCount = data.testScenarios.filter(s => s.type === 'positive').length;
  const negativeCount = data.testScenarios.filter(s => s.type === 'negative').length;
  const edgeCount = data.testScenarios.filter(s => s.type === 'edge').length;

  console.log(`   Positive: ${positiveCount}`);
  console.log(`   Negative: ${negativeCount}`);
  console.log(`   Edge cases: ${edgeCount}`);

  const highPriorityCount = data.testScenarios.filter(s => s.priority === 'high').length;
  console.log(`   High priority: ${highPriorityCount}`);
  console.log();

  if (data.testScenarios.length > 0) {
    const first = data.testScenarios[0];
    console.log('📄 Preview (first scenario):');
    console.log(`   ${first.id}: ${first.title}`);
    console.log(`   Type: ${first.type} | Priority: ${first.priority}`);
    console.log(`   Steps: ${first.steps.length}`);
    console.log();
  }
}

async function main() {
  const requirement = process.argv.slice(2).join(' ').trim();

  if (!requirement) {
    console.error('❌ Error: No requirement provided!\n');
    console.error('Usage:');
    console.error('  npm run ai:generate -- "As a user, I want to filter products by price"');
    console.error('\nExamples:');
    console.error('  npm run ai:generate -- "As a user, I want to add items to my cart"');
    console.error('  npm run ai:generate -- "As a user, I want to sort products by name"');
    console.error('  npm run ai:generate -- "As a user, I want to complete checkout"');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('🤖 AI Test Scenario Generator');
  console.log('='.repeat(60));
  console.log('\n📋 Requirement:');
  console.log(`   "${requirement}"\n`);

  const isConnected = await checkOllamaConnection();
  if (!isConnected) {
    process.exit(1);
  }

  try {
    const scenarios = await generateScenarios(requirement);
    const filepath = saveScenarios(scenarios);
    printSummary(scenarios);

    console.log('📁 Generated scenarios saved to:');
    console.log(`   ${filepath}\n`);
    console.log('💡 Next steps:');
    console.log('   1. Review the generated scenarios in the JSON file');
    console.log('   2. Select which ones to implement');
    console.log('   3. Refine and improve them if needed');
    console.log('   4. Write Playwright tests based on selected scenarios');
    console.log('   5. Add @smoke or @regression tags as appropriate\n');
  } catch (error) {
    console.error('❌ Failed to generate scenarios:', error);
    process.exit(1);
  }
}

// Run main when executed directly
// @ts-ignore (for mixed ESM/CommonJS environments)
if (require.main === module) {
  main();
}
