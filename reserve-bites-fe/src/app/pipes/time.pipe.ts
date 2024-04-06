import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: string | Date, ...args: unknown[]): unknown {
    return format(new Date(value), 'HH:mm');
  }
}
