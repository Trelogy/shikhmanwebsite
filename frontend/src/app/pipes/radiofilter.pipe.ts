import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'radiofilter'
})
export class RadiofilterPipe implements PipeTransform {

  transform(value: Array<any>, arg: String) {
    if(!arg){
      return value
    }else{
    return value.filter(
      user => user.role == arg
    )
  }
  }

}
