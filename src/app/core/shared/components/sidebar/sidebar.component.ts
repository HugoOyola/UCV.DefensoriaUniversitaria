import {NgClass} from '@angular/common';
import {Component, effect, input, output, signal, untracked} from '@angular/core';
import {MenuSidebar, MenuSidebarchildrem, MenuSidebarFooter} from './menuSidebar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {animations} from './animation';

@Component({
	selector: 'app-sidebar',
	imports: [NgClass, RouterLink, RouterLinkActive],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	animations: [animations],
})
export class SidebarComponent {
	public menuSidebar = input<MenuSidebar[]>([]);
	public menuSidebarFooter = input<MenuSidebarFooter[]>([]);
	public showSidebarOut = output<boolean>();
	public showSidebar = signal(true);
	public menuSidebarShow = signal<MenuSidebar[]>([]);
	constructor() {
		effect(() => {
			const menu = this.menuSidebar();
			untracked(() => {
				const menuShow = menu.map((menu) => {
					return {...menu, view: false};
				});
				this.menuSidebarShow.set(menuShow);
			});
		});
	}
	toogleSidebar(): void {
		this.showSidebar.update((prev) => {
			return !prev;
		});
		this.showSidebarOut.emit(this.showSidebar());
	}
	abrirMenu(MenuSidebar: MenuSidebar): void {
		if (MenuSidebar.view) {
			console.log(' =>');
			const menu = this.menuSidebarShow().find((menu) => menu.name === MenuSidebar.name);
			if (menu) {
				menu.view = false;
			}
		} else {
			this.menuSidebarShow.update((prev) => {
				return prev.map((menu) => {
					return {...menu, view: false};
				});
			});
			const menu = this.menuSidebarShow().find((menu) => menu.name === MenuSidebar.name);
			if (menu) {
				menu.view = true;
			}
		}
	}
	abrirMenu2(MenuSidebar: MenuSidebar, MenuSidebarchildrem: MenuSidebarchildrem): void {
		if (MenuSidebarchildrem.childrem !== undefined) {
			if (MenuSidebarchildrem.view) {
				console.log(' =>');
				const menu = this.menuSidebarShow().find((menu) => menu.name === MenuSidebar.name);
				const menuchildrem = menu?.childrem?.find((menuchildrem) => menuchildrem.name === MenuSidebarchildrem.name);

				if (menuchildrem) {
					menuchildrem.view = false;
				}
			} else {
				this.menuSidebarShow.update((prev) => {
					return prev.map((menu) => {
						return {
							...menu,
							childrem: menu.childrem?.map((menuchildrem) => {
								return {...menuchildrem, view: false};
							}),
						};
					});
				});
				const menu = this.menuSidebarShow().find((menu) => menu.name === MenuSidebar.name);
				const menuchildrem = menu?.childrem?.find((menuchildrem) => menuchildrem.name === MenuSidebarchildrem.name);
				if (menuchildrem) {
					menuchildrem.view = true;
				}
			}
		}
	}
}
