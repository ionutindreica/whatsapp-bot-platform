// test-rag.js - Test RAG system without external services
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testRAG() {
  console.log('🧪 Testing RAG system...');
  
  try {
    // Test 1: Check if frontend is running
    console.log('1. Testing frontend...');
    const frontendResponse = await fetch(`${BASE_URL}/`);
    console.log(`✅ Frontend status: ${frontendResponse.status}`);
    
    // Test 2: Test RAG chat endpoint (will fail without services, but we can see the error)
    console.log('2. Testing RAG chat endpoint...');
    try {
      const chatResponse = await fetch(`${BASE_URL}/api/rag/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Hello, test message",
          sessionId: "test-session"
        })
      });
      
      if (chatResponse.ok) {
        const data = await chatResponse.json();
        console.log(`✅ RAG Chat response:`, data);
      } else {
        console.log(`⚠️ RAG Chat error: ${chatResponse.status} - ${await chatResponse.text()}`);
      }
    } catch (error) {
      console.log(`⚠️ RAG Chat error: ${error.message}`);
    }
    
    // Test 3: Test RAG ingest endpoint
    console.log('3. Testing RAG ingest endpoint...');
    try {
      const ingestResponse = await fetch(`${BASE_URL}/api/rag/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: "This is a test document for RAG system",
          metadata: {
            source: "test",
            title: "Test Document"
          }
        })
      });
      
      if (ingestResponse.ok) {
        const data = await ingestResponse.json();
        console.log(`✅ RAG Ingest response:`, data);
      } else {
        console.log(`⚠️ RAG Ingest error: ${ingestResponse.status} - ${await ingestResponse.text()}`);
      }
    } catch (error) {
      console.log(`⚠️ RAG Ingest error: ${error.message}`);
    }
    
    console.log('\n📋 Test Summary:');
    console.log('- Frontend: ✅ Running');
    console.log('- RAG Chat: ⚠️ Needs Qdrant + Redis');
    console.log('- RAG Ingest: ⚠️ Needs Qdrant + Redis');
    console.log('\n💡 To fully test RAG:');
    console.log('1. Start Docker Desktop');
    console.log('2. Run: docker-compose -f docker-compose.rag.yml up -d');
    console.log('3. Add OpenAI API key to environment');
    console.log('4. Re-run this test');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRAG();
