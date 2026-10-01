import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';
import WhatsAppButton from '@/component/WhatsAppButton';

export default function WebsiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <WhatsAppButton/>
      <Footer />
    </>
  );
}