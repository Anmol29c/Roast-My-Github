import './globals.css';

export const metadata = {
  title: 'Roast My GitHub',
  description: 'AI reviews your GitHub profile like a very honest senior dev. Roast mode or hype mode — your call.',
  openGraph: {
    title: 'Roast My GitHub',
    description: 'AI reviews your GitHub profile like a very honest senior dev.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-canvas text-paper font-mono antialiased">{children}</body>
    </html>
  );
}
