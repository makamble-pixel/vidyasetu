export default function FormInput({ label, name, register, rules, type = 'text', errors, placeholder }) {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={name} className="text-sm font-medium text-gray-200">{label}</label>
			<input
				id={name}
				className="border border-white/20 rounded-lg px-4 py-2 bg-black text-white placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-white/30"
				type={type}
				placeholder={placeholder}
				{...register(name, rules)}
			/>
			{errors?.[name] && <span className="text-xs text-red-400">{errors[name].message}</span>}
		</div>
	);
} 