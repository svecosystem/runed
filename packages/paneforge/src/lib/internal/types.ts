export type Direction = "horizontal" | "vertical";

export type PaneOnCollapse = () => void;
export type PaneOnExpand = () => void;
export type PaneOnResize = (size: number, prevSize: number | undefined) => void;

export type PaneCallbacks = {
	onCollapse?: PaneOnCollapse;
	onExpand?: PaneOnExpand;
	onResize?: PaneOnResize;
};

export type PaneConstraints = {
	collapsedSize?: number | undefined;
	collapsible?: boolean | undefined;
	defaultSize?: number | undefined;
	maxSize?: number | undefined;
	minSize?: number | undefined;
};

export type PaneData = {
	callbacks: PaneCallbacks;
	constraints: PaneConstraints;
	id: string;
	idIsFromProps: boolean;
	order: number | undefined;
};

export type DragState = {
	dragHandleId: string;
	dragHandleRect: DOMRect;
	initialCursorPosition: number;
	initialLayout: number[];
};

export type ResizeEvent = KeyboardEvent | MouseEvent | TouchEvent;
export type ResizeHandler = (event: ResizeEvent) => void;

export type PaneResizeHandleOnDragging = (isDragging: boolean) => void;
