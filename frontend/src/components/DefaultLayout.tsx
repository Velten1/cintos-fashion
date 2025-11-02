import type { ReactNode } from 'react';
import Navbar from './Navbar.tsx';
import Footer from './Footer.tsx';

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-light via-blue/20 to-light">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

