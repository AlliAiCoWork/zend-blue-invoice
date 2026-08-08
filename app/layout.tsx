import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zend Blue - Invoice & Payment Solutions',
  description: 'Modern invoice system with dynamic payment method selection powered by Helcim',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-white via-purple-50 to-purple-100">{children}</body>
    </html>
  );
}
