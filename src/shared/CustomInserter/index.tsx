/**
 * WordPress dependencies
 */

import { Modal, SearchControl, Spinner } from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { store as coreDataStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useCallback, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Stack, Tabs } from '@wordpress/ui';
import IconGrid from './IconGrid';
import type { CustomInserterProps } from './types';

function normalizeSearchInput(input = '') {
	return input
		.trim()
		.toLowerCase()
		.normalize('NFD')
		replace(/[\u0300-\u036f]/g, '');
}

const CustomInserterModal = ({
	icons = [],
	setInserterOpen,
	attributes,
	setAttributes,
	isLoading = false,
}: CustomInserterProps) => {
	const [searchInput, setSearchInput] = useState('');
	const [currentCollection, setCurrentCollection] = useState<string | null>(null);

	const debouncedSetSearchInput = useDebounce(setSearchInput, 300);

	const collections = icons ?? [];
	const selectedCollection = attributes.icon?.split('/')[0];
	const collectionSlug =
		currentCollection ??
		(collections.some(({ slug }) => slug === selectedCollection)
			? selectedCollection
			: collections[0]?.slug) ??
		null;

	const setIcon = useCallback(
		(name: string) => {
			setAttributes({
				icon: name,
			});
			setInserterOpen(false);
		},
		[setAttributes, setInserterOpen],
	);

	const { icons: collectionIcons, hasResolvedIcons } = useSelect(
		(select) => {
			if (collectionSlug === null) {
				return { icons: null, hasResolvedIcons: false };
			}

			const query = collectionSlug === '' ? {} : { collection: collectionSlug };
			const { getEntityRecords, hasFinishedResolution } = select(coreDataStore);

			return {
				icons: getEntityRecords('root', 'icon', query),
				hasResolvedIcons: hasFinishedResolution('getEntityRecords', [
					'root',
					'icon',
					query,
				]),
			};
		},
		[collectionSlug],
	);

	const filteredIcons = useMemo(() => {
		if (!collectionIcons) {
			return [];
		}

		if (searchInput) {
			const input = normalizeSearchInput(searchInput);
			return collectionIcons.filter((icon) => {
				const iconName = normalizeSearchInput(icon.name);
				const iconLabel = normalizeSearchInput(icon.label);

				return iconName.includes(input) || iconLabel.includes(input);
			});
		}

		return collectionIcons;
	}, [searchInput, collectionIcons]);

	const tabs = useMemo(
		() => [{ slug: '', label: __('All') }, ...collections],
		[collections],
	);

	return (
		<Modal
			className="wp-block-icon__inserter-modal"
			title={__('Icon library')}
			onRequestClose={() => setInserterOpen(false)}
			isFullScreen
		>
			<Tabs.Root
				className="wp-block-icon__inserter"
				orientation="vertical"
				value={collectionSlug}
				onValueChange={setCurrentCollection}
			>
				<Stack
					direction="column"
					gap="lg"
					className="wp-block-icon__inserter-sidebar"
				>
					<div className="wp-block-icon__inserter-header">
						<SearchControl
							value={searchInput}
							onChange={debouncedSetSearchInput}
						/>
					</div>
					<Tabs.List>
						{tabs.map((collection) => (
							<Tabs.Tab key={collection.slug} value={collection.slug}>
								{collection.label}
							</Tabs.Tab>
						))}
					</Tabs.List>
				</Stack>
				{tabs.map((collection) => (
					<Tabs.Panel
						tabIndex={-1}
						key={collection.slug}
						value={collection.slug}
						className="wp-block-icon__inserter-panel"
					>
						{isLoading || !hasResolvedIcons ? (
							<div
								className="wp-block-icon__inserter-loading"
								role="status"
								aria-label={__('Loading…')}
							>
								<Spinner />
							</div>
						) : (
							<IconGrid
								icons={filteredIcons}
								onChange={setIcon}
								attributes={attributes}
							/>
						)}
					</Tabs.Panel>
				))}
			</Tabs.Root>
		</Modal>
	);
};

export default CustomInserterModal;
