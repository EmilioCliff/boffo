import api from '@/api/api';
import type { ProductBatchDetailResponse, ProductBatchForm } from '@/lib/types';
import { isAxiosError } from 'axios';

const AddProductBatch = async (data: ProductBatchForm) => {
	try {
		const response = await api
			.post<ProductBatchDetailResponse>('/company/stock-purchase', data)
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

export default AddProductBatch;
