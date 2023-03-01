import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeApiService {

  apiKey: string = 'AIzaSyB1cjk2L81tvLVQF5biGgioxgLL-yllRPg'

  constructor(private http: HttpClient) { }

  getVideo(id: string) {
    let url =`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${this.apiKey}&fields=items(id,snippet(title,thumbnails,publishedAt),contentDetails)&part=snippet,contentDetails`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return res;
      }
      ))
  }
}
