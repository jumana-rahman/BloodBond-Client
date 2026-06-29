import Contact from '@/components/home/Contact';
import Banner from '@/components/home/Banner';
import { ToastContainer } from 'react-toastify';

export default function Home() {
  return (
    <div>
      <Banner/>


      <Contact/>

      <ToastContainer />
    </div>
  );
}
