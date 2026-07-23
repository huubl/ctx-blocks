export type ConditionalAttributes = {
	fromDate?: string;
	toDate?: string;
	usersOnly?: boolean;
	hideWithinDateRange?: boolean;
	hideOnMobile?: boolean;
	hideOnDesktop?: boolean;
};

export type ConditionalProps = {
	attributes: ConditionalAttributes;
	clientId?: string;
	setAttributes: (attributes: Partial<ConditionalAttributes>) => void;
};
