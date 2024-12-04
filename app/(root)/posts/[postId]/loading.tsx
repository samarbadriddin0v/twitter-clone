import Header from '@/components/shared/header'
import { Loader2 } from 'lucide-react'

const Loading = () => {
	return (
		<>
			<Header label='Posts' isBack />

			<div className='flex justify-center items-center h-24'>
				<Loader2 className='animate-spin text-sky-500' />
			</div>
		</>
	)
}

export default Loading
