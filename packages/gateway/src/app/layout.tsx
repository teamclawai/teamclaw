import type { Metadata } from 'next';
import './globals.css';
import { TRPCProvider } from '@/components/providers';

export const metadata: Metadata = {
  title: 'TeamClaw',
  description: 'Multi-Agent Collaboration Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
