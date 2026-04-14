const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();
const fetch = require('node-fetch');

// Polyfill for older Node
if (!global.fetch) {
  global.fetch = fetch;
  global.Headers = fetch.Headers;
  global.Request = fetch.Request;
  global.Response = fetch.Response;
}

async function getEmbedding(text) {
  const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: {
        parts: [{ text }]
      }
    })
  }
);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data.embedding.values;
}

async function runTestIngestion() {
  try {
    // ✅ Initialize Pinecone
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      fetchApi: fetch
    });

    const index = pc.index('finance-knowledge');

    // ✅ Your data
    const financialKnowledge = [
      {
        id: 'tax_india_80c',
        text: "Section 80C allows deductions up to ₹1.5L for ELSS/PPF."
      },
      {
        id: 'emergency_fund',
        text: "Keep 3-6 months of expenses as an emergency fund."
      }
    ];

    // ✅ Generate embeddings using REST API
    const vectors = await Promise.all(
      financialKnowledge.map(async (item) => {
        const embedding = await getEmbedding(item.text);

        return {
          id: item.id,
          values: embedding,
          metadata: {
            text: item.text,
            type: "finance_tip"
          }
        };
      })
    );

    // ✅ Upload to Pinecone
    await index.namespace('general-tips').upsert(vectors);

    console.log("✅ Success! Data inserted into Pinecone.");
  } catch (error) {
    console.error("❌ Error during ingestion:", error);
  }
}

runTestIngestion();