#!/usr/bin/env node

/**
 * AI Integration Test Script
 * Tests the complete AI architecture
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api/ai';

async function testAIChat() {
  console.log('🧪 Testing AI Chat API...');
  
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, can you help me with pricing information?',
        userId: 'test-user-123',
        sessionId: 'test-session-456'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Chat API working');
      console.log('Response:', data.response.substring(0, 100) + '...');
      console.log('Confidence:', data.confidence);
      console.log('Model:', data.model);
    } else {
      console.error('❌ AI Chat API failed:', response.status);
    }
  } catch (error) {
    console.error('❌ AI Chat API error:', error);
  }
}

async function testVectorDB() {
  console.log('🧪 Testing Vector DB connection...');
  
  try {
    const response = await fetch('http://localhost:6333/collections');
    if (response.ok) {
      console.log('✅ Vector DB (Qdrant) is running');
    } else {
      console.error('❌ Vector DB connection failed');
    }
  } catch (error) {
    console.error('❌ Vector DB error:', error);
  }
}

async function testRedis() {
  console.log('🧪 Testing Redis connection...');
  
  try {
    const response = await fetch('http://localhost:6379');
    console.log('✅ Redis is accessible');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Running AI Architecture Tests...');
  console.log('');
  
  await testVectorDB();
  await testRedis();
  await testAIChat();
  
  console.log('');
  console.log('🎉 AI Architecture tests completed!');
}

if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testAIChat, testVectorDB, testRedis };
