import Footer from 'components/footer';
import Header from 'components/header';
import { ReactNode } from 'react';
import "styles/tailwind.css"


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
