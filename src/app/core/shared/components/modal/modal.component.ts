import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  DOCUMENT,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  private readonly document = inject(DOCUMENT);

  public readonly visible = input<boolean>(false);
  public readonly title = input<string>('');
  public readonly subtitle = input<string>('');
  public readonly icon = input<string>('pi pi-window-maximize');
  public readonly badge = input<string>('');
  public readonly dialogWidth = input<string>('56rem');
  public readonly showHeader = input<boolean>(true);
  public readonly maximizable = input<boolean>(true);
  public readonly dismissableMask = input<boolean>(true);
  public readonly closable = input<boolean>(true);
  public readonly blockScroll = input<boolean>(true);
  public readonly breakpoints = input<Record<string, string>>({
    '1400px': '60rem',
    '1200px': '70vw',
    '960px': '85vw',
    '640px': '95vw',
  });

  public readonly visibleChange = output<boolean>();
  public readonly closed = output<void>();

  public readonly internalVisible = signal(false);

  public readonly hasHeaderInfo = computed(
    () => !!this.title() || !!this.subtitle() || !!this.badge()
  );

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      this.internalVisible.set(isVisible);

      if (this.blockScroll()) {
        this.document.body.classList.toggle('app-modal-open', isVisible);
      }
    });
  }

  onVisibleChange(value: boolean): void {
    this.internalVisible.set(value);
    this.visibleChange.emit(value);

    if (!value) {
      this.closed.emit();
    }
  }

  close(): void {
    this.onVisibleChange(false);
  }
}