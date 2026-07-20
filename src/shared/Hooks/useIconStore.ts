import { store as coreDataStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export type IconRecord = {
	name: string;
	label: string;
	content: string;
};

export type IconCollection = {
	slug: string;
	label: string;
	icons: IconRecord[];
};

export type IconStoreResult = {
	selectedIcon?: IconRecord;
	allIcons?: IconCollection;
	isLoading: boolean;
};

const ICON_QUERY = { per_page: 100 };

export default function useIconStore(
	icon?: string,
	isInserterOpen = false,
): IconStoreResult {
	return useSelect(
		(select): IconStoreResult => {
			const coreDataSelect = select(coreDataStore);

			return {
				allIcons: isInserterOpen
					? (coreDataSelect.getEntityRecords(
							'root',
							'iconCollection',
							ICON_QUERY,
						) as IconCollection | undefined)
					: undefined,
				selectedIcon: icon
					? (coreDataSelect.getEntityRecord(
							'root',
							'icon',
							icon,
						) as IconRecord | undefined)
					: undefined,
				isLoading:
					(isInserterOpen &&
						!coreDataSelect.hasFinishedResolution('getEntityRecords', [
							'root',
							'iconCollection',
							ICON_QUERY,
						])) ||
					(!!icon &&
						!coreDataSelect.hasFinishedResolution('getEntityRecord', [
							'root',
							'icon',
							icon,
						])),
			};
		},
		[icon, isInserterOpen],
	);
}
