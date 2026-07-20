import { safeHTML } from '@wordpress/dom';
import clsx from 'clsx';
import parse, {
	attributesToProps,
	type DOMNode,
	domToReact,
	Element,
	type HTMLReactParserOptions,
} from 'html-react-parser';
import type { CSSProperties, HTMLAttributes } from 'react';

type HtmlRendererProps = {
	wrapperProps?: { style?: React.CSSProperties; className?: string };
	html?: string;
};

type ParsedHtmlProps = HTMLAttributes<HTMLElement> & {
	style?: CSSProperties;
};

const HtmlRenderer = ({ wrapperProps = {}, html = '' }: HtmlRendererProps) => {
	const options: HTMLReactParserOptions = {
		replace: (domNode) => {
			if (!(domNode instanceof Element) || domNode.parent) {
				return;
			}

			const parsedProps = attributesToProps(
				domNode.attribs || {},
			) as ParsedHtmlProps;
			const TagName = domNode.name;
			const mergedProps = {
				...parsedProps,
				...wrapperProps,
				className: clsx(parsedProps.className, wrapperProps.className),
				style: {
					...(parsedProps.style || {}),
					...(wrapperProps.style || {}),
				},
			};

			return (
				<TagName {...mergedProps}>
					{domToReact(domNode.children as DOMNode[], options)}
				</TagName>
			);
		},
	};

	const sanitizedContent = safeHTML(html);
	const parsedContent = parse(sanitizedContent, options);

	return parsedContent;
};

export default HtmlRenderer;
