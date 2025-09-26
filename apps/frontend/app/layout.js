import './globals.css'

export const metadata = {
  title: 'AI SaaS Platform',
  description: 'Minimal AI SaaS with Llama 3 and RAG',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
