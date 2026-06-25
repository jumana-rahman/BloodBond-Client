import Contact from '@/components/home/Contact';
import Banner from '@/components/home/Banner';
import { ToastContainer } from 'react-toastify';
import FeaturedSection from '@/components/home/FeaturedSection';

export default function Home() {
  return (
    <div>
      <Banner/>

      <FeaturedSection/>

      <Contact/>

      <ToastContainer />
    </div>
  );
}
