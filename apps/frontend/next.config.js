/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_LLM_URL: process.env.NEXT_PUBLIC_LLM_URL || 'http://localhost:8080',
  },
}

module.exports = nextConfig
