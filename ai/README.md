# AI Test Scenario Generator

AI tool that generates test scenarios from user stories using Ollama (local LLM). QA engineers review, refine, and implement the generated scenarios.

## Prerequisites

1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull llama3.2` (or `phi3` for faster/smaller)
3. On Windows, Ollama runs automatically. On Linux/macOS, start with `ollama serve`

## Usage

```bash
npm run ai:generate -- "As a user, I want to filter products by price"
```

Output is saved to `ai-output/scenarios-YYYY-MM-DDTHH-MM-SS.json`

## Configuration

Environment variables (optional):
- `OLLAMA_HOST` (default: `http://localhost:11434`)
- `OLLAMA_MODEL` (default: `llama3.2`)

## Workflow

1. Generate scenarios for a requirement
2. Review and refine the JSON output
3. Select scenarios to implement
4. Write Playwright tests based on selected scenarios

## Troubleshooting

- **Cannot connect**: Ensure Ollama is running (`ollama list` to verify)
- **Model not found**: Pull the model with `ollama pull llama3.2`
- **Invalid JSON**: Try running again (script auto-cleans markdown-wrapped JSON)
- **Slow generation**: Use smaller models like `phi3` for faster results
