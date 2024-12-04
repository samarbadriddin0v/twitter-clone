'use client'

import useEditModal from '@/hooks/useEditModal'
import { IUser } from '@/types'
import { useEffect, useState } from 'react'
import ProfileImageUpload from '../shared/profile-image-upload'
import CoverImageUpload from '../shared/cover-image-upload'
import Modal from '../ui/modal'
import { Loader2 } from 'lucide-react'
import EditForm from '../shared/edit-form'
import useAction from '@/hooks/use-action'
import { updateUser } from '@/actions/user.action'

interface Props {
	user: IUser
}

const EditModal = ({ user }: Props) => {
	const { isLoading, onError, setIsLoading } = useAction()
	const [coverImage, setCoverImage] = useState('')
	const [profileImage, setProfileImage] = useState('')

	const editModal = useEditModal()

	useEffect(() => {
		setCoverImage(user.coverImage)
		setProfileImage(user.profileImage)
	}, [user])

	const handleImageUpload = async (image: string, isProfileImage: boolean) => {
		setIsLoading(true)
		const res = await updateUser({ id: user._id, type: 'updateImage', [isProfileImage ? 'profileImage' : 'coverImage']: image })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			setIsLoading(false)
		}
	}

	const bodyContent = (
		<>
			{isLoading && (
				<div className='absolute z-10 h-[300px] bg-black opacity-50 left-0 top-12 right-0 flex justify-center items-center'>
					<Loader2 className='animate-spin text-sky-500' />
				</div>
			)}
			<CoverImageUpload coverImage={coverImage} onChange={image => handleImageUpload(image, false)} />
			<ProfileImageUpload profileImage={profileImage} onChange={image => handleImageUpload(image, true)} />

			<EditForm user={user} />
		</>
	)

	return <Modal body={bodyContent} isOpen={editModal.isOpen} onClose={editModal.onClose} isEditing />
}

export default EditModal
