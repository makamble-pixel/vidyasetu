import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FormInput from '@/components/FormInput';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Spinner from '@/components/Spinner';

export default function AddSchoolPage() {
	const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
	const [submitting, setSubmitting] = useState(false);
	const imageFile = watch('image');
	const previewUrl = typeof window !== 'undefined' && imageFile && imageFile[0] ? URL.createObjectURL(imageFile[0]) : null;

	const onSubmit = async (data) => {
		try {
			setSubmitting(true);
			const formData = new FormData();
			Object.entries(data).forEach(([k, v]) => {
				if (k === 'image') {
					if (v?.[0]) formData.append('image', v[0]);
				} else {
					formData.append(k, v);
				}
			});
			const res = await fetch('/api/schools', { method: 'POST', body: formData });
			const json = await res.json();
			if (!res.ok) throw new Error(json.message || 'Failed');
			toast.success('School added successfully 🎉');
			reset();
		} catch (err) {
			toast.error((err.message || 'Something went wrong') + ' ❌');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="container-responsive flex-1 py-10">
				<h1 className="text-2xl font-bold text-gray-100 mb-6">Add School</h1>
				<div className="max-w-5xl xl:max-w-6xl mx-auto">
					<motion.form
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						onSubmit={handleSubmit(onSubmit)}
						className="relative grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/20 shadow-lg min-h-[520px]"
					>
						<FormInput label="Name" name="name" register={register} rules={{ required: 'Name is required' }} errors={errors} placeholder="School name" />
						<FormInput label="Address" name="address" register={register} rules={{ required: 'Address is required' }} errors={errors} placeholder="Street, Area" />
						<FormInput label="City" name="city" register={register} rules={{ required: 'City is required' }} errors={errors} placeholder="City" />
						<FormInput label="State" name="state" register={register} rules={{ required: 'State is required' }} errors={errors} placeholder="State" />
						<FormInput label="Contact" name="contact" register={register} rules={{ required: 'Contact is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit Indian mobile' } }} errors={errors} placeholder="Phone number" />
						<FormInput label="Email" name="email_id" register={register} rules={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } }} errors={errors} placeholder="email@example.com" />
						<div className="flex flex-col gap-2 md:col-span-2">
							<label className="text-sm font-medium text-gray-200">Image</label>
							<input
								type="file"
								accept="image/*"
								className="appearance-none border border-white/20 bg-black text-white placeholder-gray-400 rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-white/30 file:bg-transparent file:text-gray-200 file:border-0 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:hover:bg-white/10"
								{...register('image', { required: 'Image is required' })}
							/>
							{previewUrl && (
								<div className="mt-2">
									<img src={previewUrl} alt="preview" className="h-36 w-64 object-cover rounded-lg border border-white/20" />
								</div>
							)}
							{errors?.image && <span className="text-xs text-red-400">{errors.image.message}</span>}
						</div>
						<div className="md:col-span-2 flex justify-end">
							<button disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition disabled:opacity-60">
								{submitting && <Spinner />}
								{submitting ? 'Submitting...' : 'Submit'}
							</button>
						</div>
					</motion.form>
				</div>
			</main>
			<Footer />
		</div>
	);
} 