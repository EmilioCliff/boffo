import api from '@/api/api';
import type { UserDetailsResponse, UserForm } from '@/lib/types';
import { isAxiosError } from 'axios';

const UpdateUser = async (data: UserForm) => {
	try {
		const response = await api
			.put<UserDetailsResponse>(`/users/${data.id}`, data)
			.then((resp) => resp.data);

		if (response.message) {
			throw new Error(response.message);
		}

		return response;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data['message']);
			} else {
				throw new Error(
					'Error while processing request try again later',
				);
			}
		} else {
			throw new Error('Error while processing request try again later');
		}
	}
};

export default UpdateUser;
