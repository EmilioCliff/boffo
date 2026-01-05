import api from '@/api/api';
import type { ResellerSaleDetailResponse, SaleForm } from '@/lib/types';
import { isAxiosError } from 'axios';

const AddSale = async (data: SaleForm) => {
	try {
		const response = await api
			.post<ResellerSaleDetailResponse>('/resellers', data)
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

export default AddSale;
