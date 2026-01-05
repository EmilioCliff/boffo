import api from '@/api/api';
import type { ListCommonProps, PaymentResponse } from '@/lib/types';
import { isAxiosError } from 'axios';

const GetPayments = async (data: ListCommonProps) => {
	try {
		let baseUrl = `/payments?limit=${data.pageSize}&page=${data.pageNumber}`;

		if (data.Search) {
			baseUrl = baseUrl + `&search=${encodeURIComponent(data.Search)}`;
		}

		if (data.Status && data.Status !== 'all') {
			baseUrl =
				baseUrl + `&recorded_by=${encodeURIComponent(data.Status)}`;
		}

		if (data.Method && data.Method !== 'all') {
			baseUrl = baseUrl + `&method=${encodeURIComponent(data.Method)}`;
		}

		if (data.ResellerID) {
			baseUrl =
				baseUrl + `&reseller_id=${encodeURIComponent(data.ResellerID)}`;
		}

		if (data.FromDate && data.ToDate) {
			baseUrl =
				baseUrl +
				`&date_from=${encodeURIComponent(
					data.FromDate,
				)}&date_to=${encodeURIComponent(data.ToDate)}`;
		}

		const response = await api
			.get<PaymentResponse>(baseUrl)
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

export default GetPayments;
