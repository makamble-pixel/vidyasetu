import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import ParticlesBackground from '@/components/ParticlesBackground';

export default function App({ Component, pageProps }) {
	return (
		<div className="min-h-screen bg-black text-gray-200">
			<ParticlesBackground />
			<Toaster position="top-right" />
			<Component {...pageProps} />
		</div>
	);
} 