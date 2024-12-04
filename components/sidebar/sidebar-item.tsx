'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'
import { BsDot } from 'react-icons/bs'

interface Props {
	label: string
	icon: LucideIcon
	notification?: boolean
	path: string
}

const SidebarItem = ({ icon: Icon, label, notification, path }: Props) => {
	const pathname = usePathname()

	return (
		<div className='flex flex-row items-center'>
			{/* MOBILE SIDEBAR ITEM */}
			<div className='relative rounded-full h-14 w-14 flex items-center justify-center p-4 hover:bg-slate-300 hover:bg-opacity-10 lg:hidden'>
				<Icon size={28} color='white' />
			</div>

			{/* DESKTOP SIDEBAR ITEM */}
			<div
				className={cn(
					'relative hidden lg:flex gap-4 p-4 rounded-full hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer items-center',
					pathname === path && 'bg-opacity-10 bg-slate-300'
				)}
			>
				<Icon size={24} color='white' />
				<p className='hidden lg:block text-xl text-white'>{label}</p>
				{notification ? <BsDot className={'text-sky-500 absolute -top-4 left-0'} size={70} /> : null}
			</div>
		</div>
	)
}

export default SidebarItem
