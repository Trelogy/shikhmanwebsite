import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '../../models/Photo';
import { PhotoService } from 'src/app/services/photos.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-selectpicture',
  templateUrl: './selectpicture.component.html',
  styleUrls: ['./selectpicture.component.css']
})
export class SelectpictureComponent implements OnInit {
  form: FormGroup;
  photo: Photo;
  imageData: string;
  id: string;
  private photoSubscription: Subscription;
  
  popuppicoff(){
    const window = document.querySelector(".container-all") as HTMLElement;

    window.style.display="none";
    this.form.reset();
    this.imageData = null;
    this.router.navigate(['New-Work-Template'])
  }

  constructor(private photoService: PhotoService, private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null),
      image: new FormControl(null),
      date: new FormControl(null),
      description: new FormControl(null),
    });

    this.activeRoute.params.subscribe(params => {
      this.id = params['id'];
      this.photoService.getPhoto(this.id)
      this.photoSubscription = this.photoService
      .getPhotoStream()
      .subscribe((photo: Photo) => {
        this.photo = photo;
      });
    });
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/heic"];
    if (file && allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  myTest(){
    window.alert("Works!")
  }

  onSubmit() {
    this.photoService.addPhoto(this.form.value.name, this.form.value.image, this.form.value.date, this.form.value.description);
    this.router.navigate(['/Work-Template']);
    
    const window = document.querySelector(".container-all") as HTMLElement;
    window.style.display="none";
    
    this.form.reset();
    this.imageData = null;
  }

  deletePhoto(id: string) {
    this.photoService.deletePhoto(id)
    .subscribe(
      res => {
        this.router.navigate(['/New-Work-Template'])
      },
      err => console.log(err)
    )
  }

  updatePhoto(name: HTMLInputElement, date: HTMLInputElement, description: HTMLTextAreaElement): boolean {
    this.photoService.editPhoto(this.photo._id, name.value, date.value, description.value)
    .subscribe( res => {
      this.router.navigate(['/New-Work-Template']);
    });
    return false;
  }
  
}
