import { NgIterable, Pipe, PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(value: Array<any>, arg: String) {
    if (!arg) {
      return value
    } else {
      arg = arg.toLowerCase()
      return value.filter(
        item => {
          let match = false

          if(item.lastName){
            match = item.lastName.toLowerCase().includes(arg)
          }

          if(item.name.toLowerCase().includes(arg)){ match = true }

          return match
        }
      )
    }
  }

}
