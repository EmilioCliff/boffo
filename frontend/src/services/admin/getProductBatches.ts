import api from '@/api/api';
import type { ListCommonProps, ProductBatchResponse } from '@/lib/types';
import { isAxiosError } from 'axios';

const GetProductsBatches = async (data: ListCommonProps) => {
	try {
		let baseUrl = `/company/stock-purchase?limit=${data.pageSize}&page=${data.pageNumber}`;

		if (data.Search) {
			baseUrl = baseUrl + `&search=${encodeURIComponent(data.Search)}`;
		}

		if (data.Status && data.Status !== 'all') {
			baseUrl = baseUrl + `&in_stock=${encodeURIComponent(data.Status)}`;
		}

		if (data.ProductID) {
			baseUrl =
				baseUrl + `&product_id=${encodeURIComponent(data.ProductID)}`;
		}

		const response = await api
			.get<ProductBatchResponse>(baseUrl)
			.then((resp) => resp.data);

		if (response.message) {
			throw new Error(response.message);
		}

		return response;
	} catch (error: unknown) {
		console.log(error);
		if (isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data['message']);
			} else {
				throw new Error(error.message);
			}
		} else {
			throw new Error('Error while processing request try again later');
		}
	}
};

export default GetProductsBatches;
