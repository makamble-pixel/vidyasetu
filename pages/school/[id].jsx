import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Spinner from '@/components/Spinner';

export default function SchoolDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/schools/${id}`);
                const json = await res.json();
                if (res.ok) setSchool(json.data);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="container-responsive flex-1 py-10">
                {loading ? (
                    <div className="py-20 flex justify-center"><Spinner /></div>
                ) : !school ? (
                    <p className="text-gray-300">School not found.</p>
                ) : (
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                        <div className="relative w-full aspect-[16/9] bg-black/30">
                            <Image src={school.image} alt={school.name} fill className="object-cover" priority />
                        </div>
                        <div className="p-6 md:p-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">{school.name}</h1>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                                <div>
                                    <p className="text-sm text-gray-400">Address</p>
                                    <p>{school.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">City</p>
                                    <p>{school.city}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">State</p>
                                    <p>{school.state}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Contact</p>
                                    <p>{school.contact}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <p className="break-all">{school.email_id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}


