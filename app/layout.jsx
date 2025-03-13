import './globals.css'

export const metadata = {
  title: 'Chat Web App',
  description: 'A chat web application with multiple AI models',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 