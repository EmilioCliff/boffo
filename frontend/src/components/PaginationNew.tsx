import { Button } from './ui/button';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

export interface PaginationProps {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrevious: boolean;
	nextPage: number;
	previousPage: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export default function PaginationNew({
	page,
	totalPages,
	hasNext,
	hasPrevious,
	nextPage,
	previousPage,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: PaginationProps) {
	return (
		<div className="flex items-center justify-between mt-4">
			<p className="hidden sm:flex text-sm text-muted-foreground">
				Page {page} of {totalPages}
			</p>
			<div className="flex gap-2">
				<Select
					value={String(pageSize)}
					defaultValue={String(pageSize)}
					onValueChange={(val) => {
						onPageChange(1);
						onPageSizeChange(Number(val));
					}}
				>
					<SelectTrigger className="w-32">
						<SelectValue placeholder={pageSize} />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="30">30</SelectItem>
							<SelectItem value="40">40</SelectItem>
							<SelectItem value="50">50</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(previousPage)}
					disabled={!hasPrevious}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(nextPage)}
					disabled={!hasNext}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
