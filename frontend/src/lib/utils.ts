import { clsx, type ClassValue } from 'clsx';
import {
	differenceInSeconds,
	format,
	formatDistanceToNow,
	isToday,
	isYesterday,
} from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatActivityTime(date: string | Date) {
	const d = new Date(date);

	const secondsAgo = differenceInSeconds(new Date(), d);

	if (secondsAgo < 60) {
		return 'Just now';
	}

	if (isToday(d)) {
		return formatDistanceToNow(d, { addSuffix: true });
	}

	if (isYesterday(d)) {
		return 'Yesterday';
	}

	return format(d, 'MMM dd, yyyy');
}

export const formatCurrency = (amount: number, withDecimal: boolean = true) => {
	if (withDecimal) {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);
	}
	return new Intl.NumberFormat('en-KE', {
		style: 'currency',
		currency: 'KES',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};
