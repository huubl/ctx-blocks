export type icon = {
	name: string;
	label: string;
	content: string;
};

export type IconCollection = {
	slug: string;
	label: string;
	icons?: icon[];
};

export type CustomInserterProps = {
	icons?: IconCollection[];
	setInserterOpen: (open: boolean) => void;
	attributes: { icon?: string };
	setAttributes: (attributes: { icon?: string }) => void;
	isLoading?: boolean;
};

export type IconGridProps = {
	icons?: icon[];
	onChange: (name: string) => void;
	attributes: { icon?: string };
};
