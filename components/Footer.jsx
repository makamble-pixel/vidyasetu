export default function Footer() {
	return (
		<footer className="mt-10">
			<div className="w-full">
				<div className="rounded-none bg-white/10 backdrop-blur-md border-t border-white/20 shadow-inner py-6">
					<div className="container-responsive">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
							<div>
								<h3 className="text-white font-semibold mb-2">Address</h3>
								<p className="text-gray-300 text-sm">13, Learning Lane<br />Mumbai, Maharashtra</p>
							</div>
							<div>
								<h3 className="text-white font-semibold mb-2">Contact</h3>
								<p className="text-gray-300 text-sm">+91 7822859508</p>
							</div>
							<div>
								<h3 className="text-white font-semibold mb-2">Email</h3>
								<p className="text-gray-300 text-sm">dummy@vidyasetu.com</p>
							</div>
						</div>
						<div className="text-center text-sm text-gray-400 mt-6 pt-4 border-t border-white/10">
							© 2025 VidyaSetu School Directory
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
} 