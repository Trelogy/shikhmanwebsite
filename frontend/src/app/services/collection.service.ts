import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  private URL = 'http://localhost:4000/collections';

  constructor(private http: HttpClient) { }

  newCollection(item: Object) {
    return this.http.post<any>(`${this.URL}/newCollection`, item)
  }

  getCollection(id: string) {
    return this.http.post<any>(`${this.URL}/getCollection`, { id: id })
  }

  updateCollection(info: Object) {
    return this.http.post<any>(`${this.URL}/updateCollection`, info)
  }
  
  newItem(info: Object) {
    return this.http.post<any>(`${this.URL}/newItem`, info)
  }

  getItem(id: string){
    return this.http.post<any>(`${this.URL}/getItem`, {id: id})
  }

  updateItem(info: Object){
    return this.http.post<any>(`${this.URL}/updateItem`, info)
  }

  addItemPic(collection: string, picture: string){
    return this.http.post<any>(`${this.URL}/addItemPic`, {colId: collection, picId: picture})
  }

  delItemPic(info: Object): void{
    this.http.post<any>(`${this.URL}/delItemPic`, info).subscribe({})
  }

  deleteItem(id: string, deletingCollection?: boolean){
    return this.http.post<any>(`${this.URL}/deleteItem`, {id: id, deletingCollection: deletingCollection})
  }

  deleteCollection(id: string){
    return this.http.post<any>(`${this.URL}/deleteCollection`, {id: id})
  }

  collections(data: Object){
    return this.http.post<any>(`${this.URL}/collections`, data)
  }

  demoCollections(){
    return this.http.get<any>(`${this.URL}/demoCollections`)
  }

  demoWorks(){
    return this.http.get<any>(`${this.URL}/demoWorks`)
  }
}