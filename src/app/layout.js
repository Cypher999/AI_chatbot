
import "./globals.css";

export const metadata = {
  title: "AI Chatbot",
  description: "AI Chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
