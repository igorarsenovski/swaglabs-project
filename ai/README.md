# AI Test Scenario Generator

This tool demonstrates how AI can **support** test scenario generation in QA automation. It uses Ollama (a free, local LLM) to generate initial test scenarios based on user stories or requirements, which QA engineers can then review, refine, and implement.

The generator script is located in [ai/testcase-generator.ts]

## How It Works

1. **Provide** a user story or requirement
2. **AI generates** initial test scenarios (positive, negative, edge cases)
3. **Review** and refine the generated scenarios
4. **Select** which scenarios to implement
5. **Write** Playwright tests based on selected scenarios

## Prerequisites

### 1. Install Ollama

Download and install Ollama from: https://ollama.ai

### 2. Pull an AI Model

Download a model (this takes a few minutes, ~2-4GB):

```bash
ollama pull llama3.2
```

Other good options:
- `ollama pull phi3` (smaller, faster)
- `ollama pull qwen2.5` (good quality)

### 3. Start Ollama Server

In a separate terminal, start Ollama:

```bash
ollama serve
```
Note: On Windows, Ollama runs automatically as a background service after installation.
You do not need to run ollama serve.
Simply run ollama list to confirm it’s running.

**Keep this terminal open** while using the generator.

## Usage

```bash
npm run ai:generate -- "As a user, I want to filter products by price"
```

### Examples

```bash
# Generate scenarios for login feature
npm run ai:generate -- "As a user, I want to log in so that I can access my account"

# Generate scenarios for cart feature
npm run ai:generate -- "As a user, I want to add items to my shopping cart"

# Generate scenarios for checkout
npm run ai:generate -- "As a user, I want to complete checkout with my items"
```

## Output

Generated scenarios are saved to `ai-output/scenarios-YYYY-MM-DDTHH-MM-SS.json`

### Example Output Structure

```json
{
  "requirement": "As a user, I want to filter products by price",
  "testScenarios": [
    {
      "id": "SC-001",
      "title": "Filter products by price low to high",
      "description": "Verify that products can be sorted by price in ascending order",
      "type": "positive",
      "priority": "high",
      "preconditions": [
        "User is logged in as Standard User",
        "User is on the inventory page"
      ],
      "steps": [
        "Navigate to inventory page",
        "Click on sort dropdown",
        "Select 'Price (low to high)'",
        "Verify products are displayed in ascending price order"
      ],
      "expectedResult": "Products are sorted from lowest to highest price"
    }
  ],
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "model": "llama3.2"
}
```

## Configuration

The tool can be customized with environment variables:

```bash
# Use a different Ollama host (default: http://localhost:11434)
export OLLAMA_HOST=http://localhost:11434

# Use a different model (default: llama3.2)
export OLLAMA_MODEL=phi3
```

Or create a `.env` file:

```
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## Application Context

The AI generator is configured with comprehensive context about Swag Labs:

- **Application Structure**: Login page, inventory page, product detail page, shopping cart, checkout process, menu/sidebar
- **User Roles**: Standard User, Problem User, Locked Out User
- **Application Behavior**: Login requirements, inventory display, cart updates, checkout flow
- **Test Environment**: Web UI testing with Playwright on desktop browsers

This context helps the AI generate more relevant and realistic test scenarios specific to Swag Labs.

## Workflow

1. **Generate scenarios** for a new feature or requirement
2. **Review** the AI-generated scenarios in the JSON file
3. **Select** which scenarios are relevant and should be implemented
4. **Refine** scenarios if needed to match actual application behavior
5. **Implement** selected scenarios as Playwright tests
6. **Document** the process and results

## Troubleshooting

### "Cannot connect to Ollama"

- Make sure Ollama is running: `ollama serve`
- Check if Ollama is installed: `ollama list`
- Verify the host is correct (default: `http://localhost:11434`)

### "Model not found"

- Pull the model: `ollama pull llama3.2`
- Or use a different model: `export OLLAMA_MODEL=phi3`
- List available models: `ollama list`

### "Invalid JSON from AI"

- The AI sometimes returns markdown-wrapped JSON
- The script automatically cleans it, but if it fails, try running again
- Different models may have different response formats
- Check the raw response in the error message

### Slow generation

- Smaller models (like `phi3`) are faster but may have lower quality
- Larger models (like `llama3.2`) are slower but generate better scenarios
- Generation typically takes 15-30 seconds

## Benefits and Limitations

### Benefits

- ✅ **AI supports test generation** (doesn't replace QA engineer)
- ✅ **Practical tool** that generates usable test scenarios
- ✅ **Free and open-source** (Ollama, no API costs)
- ✅ **Clear workflow** from requirement to implementation
- ✅ **Beginner-friendly** implementation
- ✅ **Application-specific** scenarios with provided context

### Limitations

- Generated scenarios require review and refinement
- AI may not know all application-specific details
- Some scenarios may need adaptation to match actual implementation
- Quality depends on the AI model used
- Requires local installation of Ollama

## Integration with Thesis

This implementation demonstrates:

- How AI tools can support test scenario generation
- The workflow from requirement to test implementation
- The role of QA engineers in reviewing and refining AI output
- Benefits and limitations of AI-assisted testing
- Practical application of AI in QA automation

The generated scenarios serve as a starting point that QA engineers review, refine, and implement, showing how AI **supports** rather than **replaces** human expertise.
