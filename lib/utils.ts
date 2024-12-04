import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import qs from 'query-string'
import { QueryProps } from '@/types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function sliceText(text: string, length: number) {
	if (text.length < length) return text
	return text.slice(0, length) + '...'
}

export function formUrlQuery({ key, params, value }: QueryProps) {
	const currentUrl = qs.parse(params)
	currentUrl[key] = value!
	return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl }, { skipNull: true })
}

export function removeUrlQuery({ params, key }: QueryProps) {
	const currentUrl = qs.parse(params)
	delete currentUrl[key]
	return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl }, { skipNull: true })
}
