import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SchoolCard from '@/components/SchoolCard';
import { motion } from 'framer-motion';
import Spinner from '@/components/Spinner';

export default function ShowSchoolsPage() {
	const [schools, setSchools] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [offset, setOffset] = useState(0);
	const [total, setTotal] = useState(0);
	const limit = 12;

	const canLoadMore = useMemo(() => schools.length < total, [schools.length, total]);

	async function fetchSchools({ append = false, nextOffset = 0 } = {}) {
		setLoading(true);
		try {
			const params = new URLSearchParams({ limit: String(limit), offset: String(nextOffset) });
			if (search) params.set('search', search);
			const res = await fetch(`/api/schools?${params.toString()}`);
			const json = await res.json();
			if (res.ok) {
				setTotal(json.total || 0);
				setSchools((prev) => (append ? [...prev, ...(json.data || [])] : (json.data || [])));
			}
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		setOffset(0);
		fetchSchools({ append: false, nextOffset: 0 });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	useEffect(() => {
		fetchSchools({ append: false, nextOffset: 0 });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="container-responsive flex-1 py-10">
				<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
					<h1 className="text-2xl font-bold text-gray-100">Schools</h1>
					<div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
						<div className="relative flex-1 min-w-0">
							<input 
								value={search} 
								onChange={(e) => setSearch(e.target.value)} 
								placeholder="Search by name, address, city, state" 
								className="w-full appearance-none border border-white/20 bg-black/60 text-white placeholder-gray-400 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
							/>
							{search && (
								<button
									onClick={() => setSearch('')}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer px-2"
									aria-label="Clear search"
								>
									×
								</button>
							)}
						</div>
					</div>
				</div>
				{loading && schools.length === 0 ? (
					<div className="py-10 flex justify-center"><Spinner /></div>
				) : (
					<>
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{schools.map((s) => (
								<SchoolCard key={s.id} school={s} />
							))}
						</motion.div>
						<div className="flex justify-center mt-8">
							{canLoadMore && (
								<button
									onClick={async () => {
									const next = offset + limit;
									setOffset(next);
									await fetchSchools({ append: true, nextOffset: next });
								}}
									className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-60"
									disabled={loading}
								>
									{loading ? 'Loading...' : 'Load more'}
								</button>
							)}
						</div>
					</>
				)}
			</main>
			<Footer />
		</div>
	);
} 