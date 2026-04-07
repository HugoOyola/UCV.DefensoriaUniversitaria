export interface MenuSidebar {
	name: string;
	icon: string;
	path?: string;
	action?: () => void;
	childrem?: MenuSidebarchildrem[];
	view?: boolean;
}
export interface MenuSidebarchildrem {
	name: string;
	path?: string;
	action?: () => void;
	childrem?: MenuSidebarchildremCapa3[];
	view?: boolean;
}
export interface MenuSidebarchildremCapa3 {
	name: string;
	path?: string;
	action?: () => void;
}

export interface MenuSidebarFooter {
	name: string;
	icon: string;
	path?: string;
	action?: () => void;
}
