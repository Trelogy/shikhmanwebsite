import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map} from 'rxjs';

@Pipe({
  name: 'numberfilter'
})
export class NumberfilterPipe implements PipeTransform {

  transform(value: Array<any>, arg: number) {
    return value.filter( 
      user => value.indexOf(user) <= arg)
  }

}
