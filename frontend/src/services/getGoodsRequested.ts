import api from '@/api/api';
import type { GoodsRequestResponse, ListCommonProps } from '@/lib/types';
import { isAxiosError } from 'axios';

const GetGoodsRequested = async (data: ListCommonProps) => {
	try {
		let baseUrl = `/good-requests?limit=${data.pageSize}&page=${data.pageNumber}`;

		if (data.Status && data.Status !== 'all') {
			baseUrl = baseUrl + `&status=${encodeURIComponent(data.Status)}`;
		}

		if (data.ResellerID) {
			baseUrl =
				baseUrl + `&reseller_id=${encodeURIComponent(data.ResellerID)}`;
		}

		const response = await api
			.get<GoodsRequestResponse>(baseUrl)
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

export default GetGoodsRequested;
