'use client'

import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { debounce } from 'lodash'
import { formUrlQuery, removeUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

const SearchInput = () => {
	const searchParams = useSearchParams()
	const router = useRouter()

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		const newUrl = formUrlQuery({ params: searchParams.toString(), key: 'q', value: val })
		router.push(newUrl, { scroll: false })
		router.refresh()

		if (val == '') {
			const newUrl = removeUrlQuery({ params: searchParams.toString(), key: 'q' })
			router.push(newUrl, { scroll: false })
		}
	}

	const debouncedSearch = debounce(handleSearch, 500)

	return (
		<div className='relative'>
			<Input
				placeholder='Search for users'
				className='mt-2 w-[98%] mx-auto block border-none bg-neutral-900 text-white'
				onChange={debouncedSearch}
			/>

			<div className='absolute rounded-md h-14 w-14 flex items-center justify-center p-4 hover:bg-slate-300 hover:bg-opacity-10 right-2 top-1/2 -translate-y-1/2 cursor-pointer'>
				<Search className='text-white' size={28} />
			</div>
		</div>
	)
}

export default SearchInput
