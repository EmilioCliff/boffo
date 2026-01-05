import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	children?: ReactNode;
}

export default function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	children,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4">
			{Icon && (
				<div className="mb-4 rounded-lg bg-muted p-3">
					<Icon className="h-8 w-8 text-muted-foreground" />
				</div>
			)}
			<h3 className="mb-2 text-lg font-semibold text-foreground">
				{title}
			</h3>
			{description && (
				<p className="mb-6 text-center text-sm text-muted-foreground max-w-sm">
					{description}
				</p>
			)}
			{action && (
				<Button onClick={action.onClick} variant="outline" size="sm">
					{action.label}
				</Button>
			)}
			{children}
		</div>
	);
}
