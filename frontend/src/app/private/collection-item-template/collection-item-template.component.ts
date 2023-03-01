import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/photos.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from 'src/app/models/Photo';
import { CollectionService } from 'src/app/services/collection.service';
import { ImageCroppedEvent, base64ToFile, ImageCropperComponent } from 'ngx-image-cropper';
import heic2any from 'heic2any';
import { Canvg } from 'canvg';


@Component({
  selector: 'app-collection-item-template',
  templateUrl: './collection-item-template.component.html',
  styleUrls: ['./collection-item-template.component.css']
})
export class CollectionItemTemplateComponent implements OnInit {
  route = window.location.href.split('/')[3]

  constructor(private collectionService: CollectionService, private authService: AuthService, private photoService: PhotoService, private activeRoute: ActivatedRoute, private router: Router) {
    this.activeRoute.params.subscribe(params => {
      this.isOnMobile = navigator.maxTouchPoints > 0

      if (this.route == 'Collection-Item-Template') {
        this.collectionService.getItem(params['id']).subscribe({
          next: (data) => {
            if (!data.item.date) { data.item.date = '' }
            this.item = data.item
            this.item.pictures = data.content
            this.path = data.path

            for(let level of data.path){
              level.url = level.url.replace('folder', 'Folder-Template').replace('item', 'Collection-Item-Template').replace('Collection', 'Collection-Template')
            }

            const parentPos = this.path.find(x => x.url.includes(this.item.parent))
            this.back = parentPos.url

            if(this.isOnMobile){
              this.updateScrollbarMobile()
            } else{
              this.updateScrollbar()
            }
          },

          error: (err) => this.router.navigate([''])
        })
      }
    })
  }

  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent

  path = []
  back = ''

  item = {
    _id: '',
    parent: '',
    name: '',
    date: '',
    description: '',
    thumbnail: '',
    medium: '',
    coll: '',
    pictures: []
  }

  selectedPic = {
    _id: '',
    name: '',
    date: '',
    image: null,
    description: '',
    index: 0
  }

  selectedIndex = null

  form: FormGroup;
  photo: Photo;
  imageData = './assets/img/img-uploadphoto.svg';
  id: string;
  private photoSubscription: Subscription;
  filter = ''

  imageChangedEvent: any = '';
  croppedImage: any = '';
  originalFile: Blob;

  isOnMobile: Boolean;

  async fileChangeEvent(event: any) {
    let file: Blob
    var reader = new FileReader();

    if (event.target.files[0].type == 'image/heif' || event.target.files[0].type == 'image/heic') {
      heic2any({ blob: event.target.files[0], toType: "image/jpg", quality: 1 }).then(
        newImage => {
          file = this.convertBlob(newImage, event.target.files[0].name)
          this.originalFile = file

          reader.readAsDataURL(file);
          reader.onload = (event: any) => {
            this.imageData = event.target.result
            this.selectedPic.image = file
          }
        }
      )
    } else {

      file = event.target.files[0]

      this.originalFile = event.target.files[0]
      this.imageChangedEvent = event;

      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.imageData = event.target.result
        this.selectedPic.image = file
      }
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.imageData = event.base64
    const type = this.originalFile.type == 'image/svg+xml' ? 'image/png' : this.originalFile.type
    this.selectedPic.image = new File([base64ToFile(event.base64)], this.originalFile['name'], { type: type })
  }

  imageLoaded() {

  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  cropImage() {
    if (this.imageData == './assets/img/img-uploadphoto.svg') {
      const alert = document.querySelector('.no-crop-image') as HTMLElement

      alert.style.visibility = 'visible'
      return
    }
    const cropper = document.querySelector('.cropper') as HTMLElement
    const cropzone = document.querySelector('.cropper-container') as HTMLElement

    if (this.selectedPic.image.type == 'image/svg+xml') {
      this.renderSvg().then(() => {
        cropper.style.display = 'flex'
        cropzone.style.height = '30rem'
      })
    } else {
      cropper.style.display = 'flex'
      cropzone.style.height = 'auto'
    }
  }

  async renderSvg(): Promise<void> {
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d');
    const test = await Canvg.from(context, this.imageData)
    test.resize(1500, 1500, true)
    test.render()

    const img = canvas.toDataURL('image/png')
    this.imageData = img
  }

  convertBlob(blob, filename: string): File {
    const image = blob

    image['name'] = filename
    image['lastModified'] = new Date()
    return <File>image
  }


  crop() {
    const event = this.imageCropper.crop();
    this.croppedImage = event.base64;
    const cropper = document.querySelector('.cropper') as HTMLElement
    cropper.style.display = 'none'
  }

  async onSubmit() {
    let URL = ''
    if (this.selectedPic.date && this.invalidPicDate) {
      window.alert("Please enter a valid date")
      return
    }
    if (this.selectedPic._id) {
      this.photoService.editPhoto(this.selectedPic._id, this.selectedPic.name, this.selectedPic.date, this.selectedPic.description).subscribe({})
      this.item.pictures[this.selectedPic['index']] = this.selectedPic
    } else {
      if (this.selectedPic.image) {
        if (!this.selectedPic.name) {
          this.selectedPic.name = "Untitled"
        }
        this.photoService.addPhoto(this.selectedPic.name, this.selectedPic.image, this.selectedPic.date, this.selectedPic.description).subscribe({

          next: (data) => {
            if (this.route == 'New-Item-Template') {
              if (this.activeRoute.snapshot.params['id']) {
                this.collectionService.newItem({ id: this.activeRoute.snapshot.params['id'], type: 'item' }).subscribe({
                  next: (item) => {
                    this.collectionService.addItemPic(item.id, data.photo._id).subscribe(done => {
                      this.item._id = item.id
                      this.item.name = this.item.name ? this.item.name : "New Item"
                      this.item.thumbnail = data.photo.imagePath
                      this.saveItem()
                      this.router.navigate([item.URL])
                    })
                  }
                })
              } else {
                this.collectionService.newCollection({ type: 'item', thumbnail: data.photo.imagePath }).subscribe({
                  next: (item) => {
                    this.saveItem()
                    this.collectionService.addItemPic(item.id, data.photo._id).subscribe(data => {
                      this.router.navigate([item.URL])
                    })
                  }
                })
              }
            } else {
              this.collectionService.addItemPic(this.item._id, data.photo._id).subscribe({})
            }
            this.item.pictures.push(data.photo)
          }
        })
        this.selectedPic['imagePath'] = this.imageData
      } else {
        window.alert("You have to select a valid image in order to save")
        return
      }
    }

    this.popuppicoff2();
    this.reloadWindow();
  }


  saveItem(returning?: Boolean) {
    if (this.item.pictures.length < 1) {
      window.alert("Upload at least one image before saving the item.")
      return
    }

    if ((this.item.date && this.invalidItemDate)) {
      window.alert("Item date is invalid")
      this.item.date = ''
    }

    this.collectionService.updateItem({
      id: this.item._id,
      changes: {
        name: this.item.name,
        description: this.item.description,
        date: this.item.date,
        medium: this.item.medium,
        thumbnail: this.item.thumbnail
      }
    }).subscribe(data => {

      if (returning) {
        this.router.navigateByUrl(this.back).then(done => {
          const confirmWindow = document.querySelector('.no-access1-done') as HTMLElement

          confirmWindow.style.display = 'flex'
          return
        })
      }
    })
  }

  hide(name: string) {
    const confirmWindow = document.querySelector(name) as HTMLElement

    confirmWindow.style.display = 'none'
  }

  reloadWindow() {
    this.selectedPic = {
      _id: '',
      name: '',
      date: '',
      image: '',
      description: '',
      index: null
    }
    this.imageData = './assets/img/img-uploadphoto.svg';
    this.invalidPicDate = false
  }

  popuppicoff2() {
    this.reloadWindow()
    const window2 = document.querySelector(".container-all2") as HTMLElement;

    window2.style.display = "none";
  }

  popuppic() {
    const window2 = document.querySelector(".container-all2") as HTMLElement;

    window2.style.display = "block";
  }

  updatePhoto(name: HTMLInputElement, date: HTMLInputElement, description: HTMLTextAreaElement): boolean {
    this.photoService.editPhoto(this.photo._id, name.value, date.value, description.value)
      .subscribe(res => {
        this.router.navigate(['Collection-Item-Template']);
      });
    return false;
  }

  setThumbnail(path: string) {
    this.item.thumbnail = path
  }

  confirmDelete() {

  }

  deletePhoto() {
    if (this.imageData == this.item.thumbnail) {
      this.item.thumbnail = './assets/img/no-image.png'
    }

    this.photoService.deletePhoto(this.selectedPic._id).subscribe({

      next: (res) => {
        this.collectionService.delItemPic({ id: this.item._id, index: this.selectedPic.index })
        this.item.pictures.splice(this.selectedPic.index, 1)
        this.reloadWindow()
        this.popuppicoff2()
        if (this.item.pictures.length < 1) {
          this.collectionService.deleteItem(this.item._id).subscribe(data => {
            this.router.navigate(['New-Item-Template'])
            return
          })
        }

        const alert = document.querySelector('.deletePwindow') as HTMLElement
        alert.style.visibility = 'hidden'
        this.saveItem()
      },

      error: (err) => {
        console.log(err)
      }
    })
  }

  confirm(name) {
    const banWindow = document.querySelector(name) as HTMLElement
    banWindow.style.visibility = "visible"
  }

  closeWindow(name) {
    const banWindow = document.querySelector(name) as HTMLElement
    banWindow.style.visibility = "hidden"
  }

  deleteItem() {
    this.collectionService.deleteItem(this.item._id).subscribe(data => {
      this.router.navigate([data.URL])
    })
  }

  selectedCard(index?: number) {
    const buttons = document.querySelector(".imgbtn") as HTMLElement

    if (typeof index == 'number') {
      fetch(this.item.pictures[index].imagePath)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();

          reader.readAsDataURL(blob);
          reader.onload = (event: any) => {
            this.imageData = event.target.result
          }
        });

      buttons.style.visibility = 'hidden'
      this.selectedPic = this.item.pictures[index]
      this.selectedPic.index = index
    } else {
      buttons.style.visibility = 'visible'
    }

    const card = document.querySelector(".container-all2") as HTMLElement;
    card.style.display = "block";
  }

  dateCheck(event, type) {
    if (event.code.includes('Enter')) { return true }
    
    if (event.code != 'Backspace') {
      if (type == 'pic') {
        if (this.selectedPic.date.length == 4 || this.selectedPic.date.length == 7) { this.selectedPic.date += '-' }
      } else {
        if (this.item.date.length == 4 || this.item.date.length == 7) { this.item.date += '-' }
      }
    }
    return /(?=^Digit|Numpad)\w+[0-9]|^Backspace$/.test(event.code)
  }

  invalidItemDate: Boolean
  invalidPicDate: Boolean

  dateFormat(event, type) {
    const regex = /^[12]\d{3}(?:(?:-(?:0[1-9]|1[0-2]))(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/

    if (type == 'pic') {
      if (event.length == 5 || event.length == 8) { this.selectedPic.date = this.selectedPic.date.slice(0, -1) }
      this.invalidPicDate = !regex.test(this.selectedPic.date)

    } else {
      if (event.length == 5 || event.length == 8) { this.item.date = this.item.date.slice(0, -1) }
      this.invalidItemDate = !regex.test(this.item.date)
    }
  }


  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl(null),
      image: new FormControl(null),
      date: new FormControl(null),
      description: new FormControl(null),
    });
  }

  updateScrollbar() {
    const scroll = document.querySelector(".slider") as HTMLInputElement;
    const depth = document.querySelector(".templates") as HTMLElement;
    const view = document.querySelector(".template-view") as HTMLElement;

    let observer = new ResizeObserver(() => {
      const viewDepth: unknown = depth.clientHeight - 900
      const viewHeight: unknown = view.offsetHeight
      scroll.max = (viewDepth as string)
      scroll.style.width = `${viewHeight}px`
    })

    observer.observe(depth)
    let scrollPos: unknown;

    view.addEventListener('scroll', () => {
      scrollPos = view.scrollTop
      scroll.value = (scrollPos as string)
    })
  }

  updateScrollbarMobile(){
    const scroll = document.querySelector(".slider") as HTMLInputElement;
    const depth = document.querySelector(".templates") as HTMLElement;

    let observer = new ResizeObserver(() => {
      const viewDepth: unknown = depth.scrollWidth - 342
      scroll.max = (viewDepth as string)
    })

    observer.observe(depth)
  }

  scrollView() {
    const view = this.isOnMobile ? 
                  document.querySelector(".templates") as HTMLElement :
                  document.querySelector(".template-view") as HTMLElement;

    const scroll = document.querySelector(".slider") as HTMLInputElement;
    let x: unknown = scroll.value

    if(this.isOnMobile){
      view.scrollTo((x as number), 0)
    } else {
      view.scrollTo(0, (x as number))
    }
  }
}