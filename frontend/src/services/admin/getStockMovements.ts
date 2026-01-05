import api from '@/api/api';
import type { ListCommonProps, StockMovementResponse } from '@/lib/types';
import { isAxiosError } from 'axios';

const GetStockMovements = async (data: ListCommonProps) => {
	try {
		let baseUrl = `/stock-movements?limit=${data.pageSize}&page=${data.pageNumber}`;

		if (data.Search) {
			baseUrl = baseUrl + `&search=${encodeURIComponent(data.Search)}`;
		}

		if (data.ProductID) {
			baseUrl =
				baseUrl + `&product_id=${encodeURIComponent(data.ProductID)}`;
		}

		if (data.OwnerType && data.OwnerType !== 'all') {
			baseUrl =
				baseUrl + `&owner_type=${encodeURIComponent(data.OwnerType)}`;
		}

		if (data.ResellerID) {
			baseUrl =
				baseUrl + `&owner_id=${encodeURIComponent(data.ResellerID)}`;
		}

		if (data.Type && data.Type !== 'all') {
			baseUrl =
				baseUrl + `&movement_type=${encodeURIComponent(data.Type)}`;
		}

		if (data.Source && data.Source !== 'all') {
			baseUrl = baseUrl + `&source=${encodeURIComponent(data.Source)}`;
		}

		const response = await api
			.get<StockMovementResponse>(baseUrl)
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

export default GetStockMovements;
