import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: "simple chatbot",
  description: "simple chatbot using opensource model that you can customize",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
