'use client'

import { FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery } from '@/lib/utils'
import Button from '../ui/button'

interface Props {
	pageNumber: number
	isNext: boolean
}
const Pagination: FC<Props> = ({ isNext, pageNumber }) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const onNavigation = (direcation: 'prev' | 'next') => {
		const nextPageNumber = direcation === 'prev' ? pageNumber - 1 : pageNumber + 1

		const newUrl = formUrlQuery({
			key: 'page',
			params: searchParams.toString(),
			value: nextPageNumber.toString(),
		})
		router.push(newUrl)
	}

	if (!isNext && pageNumber === 1) return null

	return (
		<div className='flex w-full items-center justify-center gap-2 mt-4'>
			<Button onClick={() => onNavigation('prev')} disabled={pageNumber === 1} label={'prev'} />
			<p>{pageNumber}</p>
			<Button onClick={() => onNavigation('next')} disabled={!isNext} label='Next' />
		</div>
	)
}

export default Pagination
