import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface ButtonProps {
	label: ReactNode | string
	secondary?: boolean
	fullWidth?: boolean
	large?: boolean
	disabled?: boolean
	outline?: boolean
	type?: 'button' | 'submit'
	onClick?: () => void
	classNames?: string
	isLoading?: boolean
}

export default function Button({
	label,
	disabled,
	fullWidth,
	large,
	onClick,
	outline,
	secondary,
	type,
	classNames,
	isLoading,
}: ButtonProps) {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			type={type}
			className={cn(
				'rounded-full font-semibold border transition hover:opacity-80 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center',
				fullWidth ? 'w-full' : 'w-fit',
				secondary ? 'bg-white text-black' : 'bg-sky-500 text-white',
				large ? 'text-xl px-5 py-3' : 'text-md px-4 py-3',
				outline ? 'bg-transparent border-slate-600 text-sky-500 hover:bg-slate-800/40' : '',
				classNames
			)}
		>
			<span>{label}</span>
			{isLoading && <Loader2 className='w-4 h-4 ml-2 animate-spin' />}
		</button>
	)
}
