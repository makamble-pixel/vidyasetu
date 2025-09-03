import Link from 'next/link';
import Image from 'next/image';

export default function SchoolCard({ school }) {
	return (
		<Link href={`/school/${school.id}`} className="block [transform-style:preserve-3d] [perspective:1000px]">
			<div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow transition hover:shadow-xl overflow-hidden transform-gpu will-change-transform hover:-translate-y-1 hover:rotate-[0.5deg]">
				<div className="aspect-[16/10] bg-black/20 overflow-hidden relative">
					<Image src={school.image} alt={school.name} fill priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover" />
				</div>
				<div className="p-4">
					<h3 className="text-lg font-semibold text-gray-100">{school.name}</h3>
					<p className="mt-1 text-sm text-gray-300">{school.address}</p>
					<p className="mt-1 text-sm text-gray-400">{school.city}</p>
				</div>
			</div>
		</Link>
	);
} 