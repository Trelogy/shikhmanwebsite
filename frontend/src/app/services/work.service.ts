import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  private URL = 'http://localhost:4000/works';

  constructor(private http: HttpClient) { }

  newWork(work) {
    return this.http.post<any>(`${this.URL}/addWork`, work);
  }

  deleteWork(work: string) {
    return this.http.get<any>(`${this.URL}/delete/${work}`)
  }

  works(filters: Object) {
    return this.http.post<any>(`${this.URL}/getWorks`, filters)
  }

  getWork(id: string) {
    return this.http.get<any>(`${this.URL}/${id}`)
  }
  
  addPic(info: Object) {
    return this.http.post<any>(`${this.URL}/addPic`, info)
  }

  delPic(info: Object) {
    return this.http.post<any>(`${this.URL}/delPic`, info)
  }

  editWork(info: Object) {
    return this.http.post<any>(`${this.URL}/editWork`, info)
  }
  
  addVideo(work: string, info: Object) {
    return this.http.post<any>(`${this.URL}/addVideo`, {work: work, info: info})
  }

  updateVideo(id: string, video: Object){
    return this.http.post<any>(`${this.URL}/editVideo`, {id: id, video: video})
  }

  deleteVideo(workId: string, id: string){
    return this.http.post<any>(`${this.URL}/deleteVideo`, {parent: workId, id: id})
  }
}
