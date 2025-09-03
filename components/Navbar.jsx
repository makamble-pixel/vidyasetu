import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function NavLink({ href, children, onClick, className = '' }) {
	const router = useRouter();
	const isActive = router.pathname === href;
	return (
		<Link
			onClick={onClick}
			href={href}
			className={`${className} ${isActive ? 'text-white' : 'text-gray-300 hover:text-gray-100'} transition-colors`}
		>
			{children}
		</Link>
	);
}

export default function Navbar() {
	const [open, setOpen] = useState(false);
	return (
		<header className="sticky top-4 z-40">
			<div className="container-responsive">
				<nav className="relative mx-auto rounded-full px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
					<div className="flex items-center justify-between">
						<Link href="/showSchools" className="text-lg font-semibold text-white flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
								<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
							</svg>
							<span>VidyaSetu</span>
						</Link>
						<button
							onClick={() => setOpen((o) => !o)}
							className="md:hidden text-gray-200 hover:text-white focus:outline-none"
							aria-label="Toggle menu"
							aria-expanded={open}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
								<path fillRule="evenodd" d="M3.75 6.75A.75.75 0 014.5 6h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
							</svg>
						</button>
						<div className="hidden md:flex gap-6">
							<NavLink href="/addSchool">Add School</NavLink>
							<NavLink href="/showSchools">Show Schools</NavLink>
						</div>
					</div>

					<AnimatePresence>
						{open && (
							<motion.div
								initial={{ opacity: 0, y: -8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								transition={{ duration: 0.18, ease: 'easeOut' }}
								className="absolute left-0 right-0 top-full mt-2 px-2 md:hidden"
							>
								<div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-2">
									<NavLink
										href="/addSchool"
										onClick={() => setOpen(false)}
										className="block px-4 py-2 text-gray-200 hover:text-white hover:bg-white/20 rounded-lg"
									>
										Add School
									</NavLink>
									<NavLink
										href="/showSchools"
										onClick={() => setOpen(false)}
										className="block px-4 py-2 text-gray-200 hover:text-white hover:bg-white/20 rounded-lg"
									>
										Show Schools
									</NavLink>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</nav>
			</div>
		</header>
	);
} 