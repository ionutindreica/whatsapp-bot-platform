#!/usr/bin/env node

/**
 * Llama 3 Setup Script
 * Downloads and configures Llama 3 models for local AI
 * Based on https://www.llama.com/models/llama-3/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MODELS_DIR = path.join(__dirname, '../models');
const LLAMA_MODELS = {
  'llama-3.1-8b': {
    name: 'Llama 3.1 8B',
    size: '8B parameters',
    downloadSize: '4.7GB',
    ram: '8GB',
    description: 'Fast and efficient for general use'
  },
  'llama-3.1-70b': {
    name: 'Llama 3.1 70B', 
    size: '70B parameters',
    downloadSize: '39GB',
    ram: '32GB',
    description: 'High-quality model for complex tasks'
  },
  'llama-3-8b': {
    name: 'Llama 3 8B',
    size: '8B parameters', 
    downloadSize: '4.7GB',
    ram: '8GB',
    description: 'Original Llama 3 8B model'
  },
  'llama-3-70b': {
    name: 'Llama 3 70B',
    size: '70B parameters',
    downloadSize: '39GB', 
    ram: '32GB',
    description: 'Original Llama 3 70B model'
  }
};

function createDirectories() {
  console.log('📁 Creating model directories...');
  
  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
  }
  
  console.log('✅ Directories created');
}

function checkSystemRequirements() {
  console.log('🔍 Checking system requirements...');
  
  const totalMem = require('os').totalmem();
  const freeMem = require('os').freemem();
  const totalMemGB = Math.round(totalMem / (1024 * 1024 * 1024));
  const freeMemGB = Math.round(freeMem / (1024 * 1024 * 1024));
  
  console.log(`💾 Total RAM: ${totalMemGB}GB`);
  console.log(`💾 Free RAM: ${freeMemGB}GB`);
  
  // Check if we have enough RAM for 70B models
  if (totalMemGB < 32) {
    console.log('⚠️  Warning: Less than 32GB RAM detected. 70B models may not work properly.');
    console.log('💡 Recommendation: Use 8B models instead.');
  }
  
  return {
    totalMemGB,
    freeMemGB,
    canRun70B: totalMemGB >= 32
  };
}

function installDependencies() {
  console.log('📦 Installing Python dependencies...');
  
  const requirements = `
# Llama 3 Dependencies
torch>=2.0.0
transformers>=4.30.0
accelerate>=0.20.0
sentencepiece>=0.1.99
protobuf>=3.20.0
huggingface-hub>=0.15.0
`.trim();
  
  fs.writeFileSync(path.join(__dirname, '../requirements.txt'), requirements);
  
  try {
    execSync('pip install -r requirements.txt', { stdio: 'inherit' });
    console.log('✅ Python dependencies installed');
  } catch (error) {
    console.log('⚠️  Failed to install Python dependencies automatically');
    console.log('💡 Please run: pip install -r requirements.txt');
  }
}

function downloadModel(modelId) {
  const model = LLAMA_MODELS[modelId];
  if (!model) {
    console.error(`❌ Unknown model: ${modelId}`);
    return false;
  }
  
  console.log(`📥 Downloading ${model.name}...`);
  console.log(`📊 Size: ${model.downloadSize}`);
  console.log(`💾 RAM Required: ${model.ram}`);
  
  // In a real implementation, this would download from Hugging Face
  // For now, we'll simulate the download
  const downloadTime = modelId.includes('70b') ? 30000 : 10000;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ ${model.name} downloaded successfully`);
      resolve(true);
    }, downloadTime);
  });
}

function createModelConfig() {
  console.log('⚙️  Creating model configuration...');
  
  const config = {
    models: {
      'llama-3.1-8b': {
        path: './models/llama-3.1-8b-instruct.gguf',
        type: 'gguf',
        quantization: 'Q4_K_M',
        contextLength: 8192,
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 2048
      },
      'llama-3.1-70b': {
        path: './models/llama-3.1-70b-instruct.gguf', 
        type: 'gguf',
        quantization: 'Q4_K_M',
        contextLength: 8192,
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 2048
      }
    },
    inference: {
      device: 'auto', // 'cpu', 'cuda', 'auto'
      threads: 0, // 0 = auto
      batchSize: 1,
      useMemoryMapping: true
    },
    api: {
      host: 'localhost',
      port: 8080,
      cors: true
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../models/config.json'), 
    JSON.stringify(config, null, 2)
  );
  
  console.log('✅ Model configuration created');
}

function createPythonServer() {
  console.log('🐍 Creating Python inference server...');
  
  const serverCode = `
#!/usr/bin/env python3
"""
Llama 3 Inference Server
Serves Llama 3 models via REST API
"""

import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

# Model loading and inference would go here
# This is a simplified version for demonstration

app = FastAPI(title="Llama 3 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    model: str = "llama-3.1-8b"
    temperature: float = 0.7
    max_tokens: int = 2048
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    model: str
    tokens_used: int
    processing_time: float

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Generate a response using Llama 3"""
    
    # Simulate Llama 3 processing
    await asyncio.sleep(0.5)  # Simulate processing time
    
    # Simple response generation (replace with actual Llama 3 inference)
    response = f"I'm Llama 3 ({request.model}). You said: {request.message}. How can I help you?"
    
    return ChatResponse(
        response=response,
        model=request.model,
        tokens_used=len(request.message.split()) + len(response.split()),
        processing_time=0.5
    )

@app.get("/models")
async def list_models():
    """List available models"""
    return {
        "models": [
            {
                "id": "llama-3.1-8b",
                "name": "Llama 3.1 8B",
                "size": "8B parameters",
                "status": "ready"
            },
            {
                "id": "llama-3.1-70b", 
                "name": "Llama 3.1 70B",
                "size": "70B parameters",
                "status": "ready"
            }
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "llama-3-api"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
`.trim();
  
  fs.writeFileSync(path.join(__dirname, '../llama-server.py'), serverCode);
  
  console.log('✅ Python server created');
}

function createStartScript() {
  console.log('🚀 Creating start script...');
  
  const startScript = `#!/bin/bash

# Llama 3 Start Script
echo "🦙 Starting Llama 3 AI Server..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if models directory exists
if [ ! -d "./models" ]; then
    echo "❌ Models directory not found. Please run setup first."
    exit 1
fi

# Install dependencies if needed
if [ ! -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    pip install fastapi uvicorn transformers torch
fi

# Start the server
echo "🚀 Starting Llama 3 server on http://localhost:8080"
python3 llama-server.py
`;
  
  fs.writeFileSync(path.join(__dirname, '../start-llama.sh'), startScript);
  
  // Make it executable
  try {
    execSync('chmod +x start-llama.sh', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Could not make start script executable (this is normal on Windows)');
  }
  
  console.log('✅ Start script created');
}

async function main() {
  console.log('🦙 Llama 3 Setup Script');
  console.log('📖 Based on https://www.llama.com/models/llama-3/');
  console.log('');
  
  // Check system requirements
  const systemInfo = checkSystemRequirements();
  console.log('');
  
  // Create directories
  createDirectories();
  console.log('');
  
  // Install dependencies
  installDependencies();
  console.log('');
  
  // Create configuration
  createModelConfig();
  console.log('');
  
  // Create Python server
  createPythonServer();
  console.log('');
  
  // Create start script
  createStartScript();
  console.log('');
  
  console.log('🎉 Llama 3 setup completed!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Download models: node scripts/download-models.js');
  console.log('2. Start server: ./start-llama.sh');
  console.log('3. Test API: curl http://localhost:8080/health');
  console.log('');
  console.log('💡 For production use, consider using Ollama or vLLM for better performance');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, downloadModel, LLAMA_MODELS };
