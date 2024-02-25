import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
})
export class PricePipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    return value.toLocaleString('en-US');
  }
}
