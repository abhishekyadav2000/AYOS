# Phase 3: AI Integration with Ollama

## Overview

This phase integrates **Ollama** (local LLM runtime) with the Notepad AI application, enabling real-time AI suggestions and chat within the Windows 11 OS environment.

## What is Ollama?

Ollama is an open-source project that lets you run large language models locally on your machine without internet connectivity. Think of it as a local AI backend.

- **Free and Open Source**
- **Runs locally** - No data leaves your computer
- **Multiple Models** - Choose from Llama 2, Mistral, Neural Chat, and more
- **Fast** - Instant responses compared to cloud APIs

## Installation

### Step 1: Download Ollama

Visit **https://ollama.ai** and download for your OS:
- macOS (Intel/Apple Silicon)
- Linux
- Windows

### Step 2: Install Downloaded Models

After installation, open terminal and pull models:

```bash
# Fast model - Recommended for first-time setup
ollama pull neural-chat

# Balanced model - Good all-rounder
ollama pull mistral

# Powerful model - Best quality, slower
ollama pull llama2

# Additional fast model
ollama pull orca-mini
```

Each model will download (1-7GB depending on size).

### Step 3: Start Ollama Server

The default installation runs Ollama in background automatically. To manually start:

```bash
ollama serve
```

This starts the Ollama API server on `http://localhost:11434`

## Using Ollama with AYOS

### In Notepad AI:

1. **Start your dev server** → `npm run dev`
2. **Ollama automatically detected** → Green indicator appears ("Ollama Ready")
3. **Select AI Model** → Dropdown shows available models
4. **Chat & Get Suggestions** → All powered by local AI

### Features:

- **AI Suggestions** → Get writing improvement suggestions
- **Interactive Chat** → Ask questions and get responses
- **Streaming Responses** → See AI thinking in real-time
- **Model Selection** → Switch between models as needed
- **No Internet Required** → Everything runs locally

## Available Models

| Model | Speed | Size | Best For |
|-------|-------|------|----------|
| **neural-chat** | Fast ⚡ | 4B | Quick responses, low resource |
| **orca-mini** | Fast ⚡ | 3B | Minimal hardware, still capable |
| **mistral** | Balanced ⚖️ | 7B | Good quality & speed balance |
| **openchat** | Balanced ⚖️ | 7B | Conversational, friendly |
| **llama2** | Powerful 🔥 | 7B | Best quality, highest resource use |

### Which Model to Choose?

- **Slow Computer?** → Use `neural-chat` or `orca-mini`
- **Balanced?** → Use `mistral` or `openchat`
- **Powerful Machine?** → Use `llama2`

## Troubleshooting

### "Ollama Not Available" Error

**Problem:** Green "Ollama Ready" indicator isn't showing

**Solutions:**
1. **Start Ollama Server**
   ```bash
   ollama serve
   ```

2. **Check if running** (macOS):
   ```bash
   ps aux | grep ollama
   ```

3. **Restart Ollama** → Quit from menu bar and reopen

4. **Check port** - Ollama uses `http://localhost:11434`
   ```bash
   lsof -i :11434
   ```

### Model Download Issues

**Problem:** Models taking very long to download

**Solutions:**
1. Check internet connection
2. Download is working in background - be patient (can take 5-30 minutes depending on model and internet)
3. Use smaller model first: `ollama pull neural-chat`

### Slow Responses

**Problem:** AI responses are very slow

**Solutions:**
1. **Use faster model** → Switch to `neural-chat` in dropdown
2. **Close other apps** → Free up RAM
3. **Check CPU usage** → Ollama may need more system resources
4. **Restart Ollama** → Fresh start sometimes helps

### "Model not found" Error

**Problem:** Selected model shows error

**Solutions:**
1. Pull the model:
   ```bash
   ollama pull mistral
   ```
2. List available models:
   ```bash
   ollama list
   ```
3. Refresh the app (reload page or restart dev server)

## API Architecture

### Client-Side Flow

```
User Input (Notepad AI)
    ↓
Ollama Service (lib/ollama.ts)
    ↓
Fetch to localhost:11434
    ↓
Stream Response
    ↓
Update UI in Real-time
```

### Key Files

- **[src/lib/ollama.ts](../src/lib/ollama.ts)** - Ollama API client
  - `checkOllamaAvailability()` - Check if Ollama is running
  - `getAvailableModels()` - Fetch installed models
  - `streamOllamaResponse()` - Stream AI responses (async generator)
  - `getOllamaResponse()` - Get complete response

- **[src/features/os/components/NotepadAIWindow.tsx](../src/features/os/components/NotepadAIWindow.tsx)** - Notepad AI UI
  - Ollama integration
  - Model selector dropdown
  - Streaming response handling
  - AI suggestions

## Advanced: Custom Models

Want to use other models? Run:

```bash
ollama pull [model-name]
```

Add to `AVAILABLE_MODELS` in `src/lib/ollama.ts`:

```typescript
"custom-model": {
  name: "custom-model",
  display: "My Custom Model",
  context: 4096,
  speed: "balanced",
  size: "7B",
},
```

## Performance Tips

1. **Increase context window** for longer conversations:
   - Edit requests in `ollama.ts` to adjust `temperature` and context

2. **Optimize response speed**:
   - Use smaller models like `neural-chat`
   - Reduce number of generation tokens

3. **Memory optimization**:
   - Close unused apps before long AI sessions
   - Monitor system resources

## Production Deployment

For deployment (Vercel, etc.):

1. **Ollama is local-only** → Won't work in cloud without backend
2. **Solution Options**:
   - Use cloud AI API (OpenAI, Anthropic)
   - Run private Ollama server
   - Implement backend proxy

See `docs/deployment.md` for cloud AI integration guide.

## Next Steps

1. ✅ Install Ollama from https://ollama.ai
2. ✅ Pull models you want to use
3. ✅ Start Ollama server
4. ✅ Run `npm run dev` for AYOS
5. ✅ Open Notepad AI and start chatting!

## Resources

- **Ollama Official** → https://ollama.ai
- **Available Models** → https://ollama.ai/library
- **Documentation** → https://github.com/jmorganca/ollama

---

**Phase Status**: 🚀 Ready for Integration

Next Phase: Personal AI Agents
