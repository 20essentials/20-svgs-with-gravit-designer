import { type Metadata } from 'next';
import '@/styles/globalReset.css';
import '@/styles/global.css';
import { inter } from '@/lib/fonts';
import { ContainerHyperspeed } from '@/components/background/ContainerHyperspeed';

export const metadata: Metadata = {
  title: `20 Svg's with Gravit Designer`,
  description: `Page: 20 Svg's with Gravit Designer`,
  icons: {
    icon: '/assets/favicon.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={inter.className}>
      <body>
        <ContainerHyperspeed />
        {children}
      </body>
    </html>
  );
}
