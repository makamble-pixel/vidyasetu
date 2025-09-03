import dynamic from 'next/dynamic';

const Particles = dynamic(() => import('@/components/Particles'), { ssr: false });

export default function ParticlesBackground() {
	return (
		<div className="fixed inset-0 z-0 pointer-events-none">
			<Particles
				className="absolute inset-0 w-screen h-screen"
				particleColors={["#ffffff", "#ffffff"]}
				particleCount={400}
				particleSpread={10}
				speed={0.1}
				particleBaseSize={100}
				moveParticlesOnHover={true}
				alphaParticles={false}
				disableRotation={false}
			/>
		</div>
	);
} 