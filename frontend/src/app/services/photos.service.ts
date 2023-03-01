import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';
import { Photo } from '../models/Photo';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photo: Photo;
  private photo$ = new Subject<Photo>();
  private photos: Photo[] = [];
  private photos$ = new Subject<Photo[]>();

  private URL = "http://localhost:4000/photos";

  constructor(private http: HttpClient) { }

  getPhotos() {
    this.http
      .get<{ photos: Photo[] }>(this.URL)
      .pipe(
        map((photoData) => {
          return photoData.photos;
        })
      )
      .subscribe((photos) => {
        this.photos = photos;
        this.photos$.next(this.photos);
      });
  }

  getPhoto(id: string) {
    this.http
      .get<{ photo: Photo }>(`${this.URL}/${id}`)
      .pipe(
        map((photoData) => {
          return photoData.photo;
        })
      )
      .subscribe(photo => {
        this.photo = photo;
        this.photo$.next(this.photo);
      });
  }

  getPhotosStream() {
    return this.photos$.asObservable();
  }

  getPhotoStream() {
    return this.photo$.asObservable();
  }

  addPhoto(name: string, image: File, date: string, description: string) {
    const photoData = new FormData();
    photoData.append("name", name);
    photoData.append("file", image, name);
    photoData.append("date", date);
    photoData.append("description", description);
    return this.http.post<{ photo: Photo }>(this.URL, photoData)
  }

  deletePhoto(id: string) {
    return this.http.delete(`${this.URL}/${id}`);
  }

  editPhoto(id: string, name: string, date: string, description: string) {
    return this.http.put(`${this.URL}/${id}`, { name, date, description });
  }

}
