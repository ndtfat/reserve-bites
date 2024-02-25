import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'logo',
  template: `
    <a routerLink="/">
      <img
        alt="logo"
        [src]="logos[color][text ? 'text' : 'noText']"
        class="logo"
        [style]="logoStyle"
      />
    </a>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class LogoComponent implements OnChanges {
  @Input() width?: number | string | null;
  @Input({ transform: booleanAttribute }) text: boolean = false;
  @Input() color: 'white' | 'black' = 'black';

  logos = {
    white: {
      text: '../../assets/logos/book-a-bite--white.png',
      noText: '../../assets/logos/book-a-bite--white.png',
    },
    black: {
      text: '../../assets/logos/book-a-bite--black.png',
      noText: '../../assets/logos/book-a-bite--black.png',
    },
  };

  logoStyle = {};
  constructor() {
    if (this.width) {
      this.logoStyle = {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        height: 'auto',
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.width) {
      this.logoStyle = {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        height: 'auto',
      };
    }
  }
}
