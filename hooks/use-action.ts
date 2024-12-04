import { toast } from '@/components/ui/use-toast'
import { useState } from 'react'

const useAction = () => {
	const [isLoading, setIsLoading] = useState(false)

	function onError(message: string) {
		setIsLoading(false)
		toast({ description: message, variant: 'destructive' })
	}

	return { isLoading, setIsLoading, onError }
}

export default useAction
