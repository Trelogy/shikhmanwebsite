import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Photo } from 'src/app/models/Photo';
import { PhotoService } from 'src/app/services/photos.service';
import { AuthService } from 'src/app/services/auth.service';
import { WorkService } from 'src/app/services/work.service';
import { YoutubeApiService } from 'src/app/services/youtube-api.service';
import { ImageCroppedEvent, base64ToFile, ImageCropperComponent } from 'ngx-image-cropper';
import heic2any from 'heic2any'
import { Canvg } from 'canvg'

@Component({
  selector: 'app-work-template',
  templateUrl: './work-template.component.html',
  styleUrls: ['./work-template.component.css']
})
export class WorkTemplateComponent implements OnInit, OnDestroy {
  route = window.location.href.split('/')[3]

  constructor(private workService: WorkService, private photoService: PhotoService, private activeRoute: ActivatedRoute, private router: Router, private authService: AuthService, private youtube: YoutubeApiService) {
    this.activeRoute.params.subscribe(params => {
      this.isOnMobile = navigator.maxTouchPoints > 0

      if (this.route == 'Work-Template') {
        this.title = 'Edit work'
        this.workService.getWork(params['id']).subscribe({
          next: (data) => {
            data.work.authors = data.work.authors.map(x => x = x._id)

            for (let item of data.work.content) {
              if (item.imagePath) {
                if (data.work.thumbnail.url == item.imagePath) {
                  item['isThumbnail'] = true
                  break;
                }
              } else {
                if (item.thumbnail.url == data.work.thumbnail.url) {
                  item['isThumbnail'] = true
                  break;
                }
              }
            }

            if (!data.info.canEdit) {
              this.router.navigate['']
              return
            }

            this.user = data.info.user

            this.authService.getUserId().subscribe(response => {
              this.members = response.family

              for (let member of this.members) {
                const index = data.work.authors.findIndex(x => x == member._id)

                member['isOwner'] = index >= 0
              }
            })
            this.work = data.work

            if(this.isOnMobile){
              this.updateScrollbarMobile()
            } else{
              this.updateScrollbar()
            }
          },

          error: () => this.router.navigate(['New-Work-Template'])
        })
      } else {
        this.title = 'Add your work'
        this.authService.getUserId().subscribe(data => {
          this.members = data.family
          this.user = data.id
          this.work.authors.push(data.id)

          const index = this.members.findIndex(x => x._id == data.id)

          this.members[index]['isOwner'] = true
        })
      }
    })
  }

  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent

  work = {
    _id: '',
    name: '',
    date: '',
    description: '',
    socialm: '',
    medium: '',
    public: false,
    content: [],
    authors: [],
    thumbnail: {}
  }

  user = ''
  title = 'Add your work'


  selectedPic = {
    _id: '',
    name: '',
    date: '',
    image: null,
    description: '',
    index: 0
  }

  videosrc = ''

  selectedVid = {}
  newVideo = false
  invalidWorkDate: Boolean
  invalidVidDate: Boolean
  invalidPicDate: Boolean

  form: FormGroup;
  photo: Photo;
  imageData = './assets/img/img-uploadphoto.svg'
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

  dateCheck(event, type) {
    if (event.code.includes('Enter')) { return true }

    if (event.code != 'Backspace') {
      if (type == 'pic') {
        if (this.selectedPic.date.length == 4 || this.selectedPic.date.length == 7) { this.selectedPic.date += '-' }
      } else if (type == 'vid') {
        if (this.selectedVid['date'].length == 4 || this.selectedVid['date'].length == 7) { this.selectedVid['date'] += '-' }
      } else {
        if (this.work.date.length == 4 || this.work.date.length == 7) { this.work.date += '-' }
      }
    }
    return /(?=^Digit|Numpad)\w+[0-9]|^Backspace$/.test(event.code)
  }

  dateFormat(event, type) {
    const regex = /^[12]\d{3}(?:(?:-(?:0[1-9]|1[0-2]))(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/

    if (type == 'pic') {
      if (event.length == 5 || event.length == 8) { this.selectedPic.date = this.selectedPic.date.slice(0, -1) }
      this.invalidPicDate = !regex.test(this.selectedPic.date)

    } else if (type == 'vid') {
      if (event.length == 5 || event.length == 8) { this.selectedVid['date'] = this.selectedVid['date'].slice(0, -1) }
      this.invalidVidDate = !regex.test(this.selectedVid['date'])

    } else {
      if (event.length == 5 || event.length == 8) { this.work.date = this.work.date.slice(0, -1) }
      this.invalidWorkDate = !regex.test(this.work.date)
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

  crop() {
    const event = this.imageCropper.crop();
    this.croppedImage = event.base64;
    const cropper = document.querySelector('.cropper') as HTMLElement
    cropper.style.display = 'none'
  }

  getVideo() {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = this.work.socialm.match(regExp);
    this.loading()

    const id = match && match[2].length === 11 ? match[2] : this.work.socialm;
    this.youtube.getVideo(id).subscribe(data => {
      this.loading()
      this.newVideo = true
      const video = data.items[0]
      if (video) {
        let duration = video.contentDetails.duration.replace("PT", "").replace("H", ":").replace("M", ":").replace("S", "")
        if (duration == 'P0D') { duration = 'LIVE' }

        const item = {
          videoID: video.id,
          name: video.snippet.title,
          description: '',
          duration: duration,
          date: video.snippet.publishedAt.split('T')[0],
          thumbnail: { duration: duration, url: video.snippet.thumbnails.high.url },
        }
        this.videosrc = `https://www.youtube.com/embed/${video.id}`
        this.selectedVid = item
        const wind = document.querySelector('.videoedit') as HTMLElement

        wind.style.display = 'flex'
      } else {
        const alert = document.querySelector('.no-video') as HTMLElement

        alert.style.visibility = 'visible'
      }
    })
  }

  popuppicoff() {
    this.form.reset();
    this.imageData = null;
    const window = document.querySelector(".container-all") as HTMLElement;
    window.style.display = "none";

    this.router.navigate(['New-Work-Template']);
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

  members = []

  selectMember(user: any, i: number) {
    if (user._id == this.work['user'] && this.work['user'] != this.user) {
      window.alert(`${user.name} is the original owner and can't be removed from the owners list`)

      return false
    }

    if (!this.members[i].isOwner) {
      this.work.authors.push(this.members[i]._id)

    } else {
      if (this.work.authors.length <= 1) {
        const alert = document.querySelector('.cant-self') as HTMLElement
        alert.style.visibility = 'visible'

        return false
      }

      if (user._id == this.user) {
        const alert = document.querySelector('.remove-self') as HTMLElement
        alert.style.visibility = 'visible'

        return false
      }


      const index = this.work.authors.findIndex(x => x == this.members[i]._id)
      this.work.authors.splice(index, 1)
    }

    this.members[i].isOwner = !this.members[i].isOwner
    return true
  }

  publicWork(check: boolean) {
    if (check) {
      if (this.work.public) { return false }

      const alert = document.querySelector('.usurepub') as HTMLElement

      alert.style.visibility = 'visible'
      return false
    }
    this.work.public = false
    return true
  }

  confirmpublic() {
    const check = document.querySelector('#public') as HTMLInputElement

    check.checked = true
    this.work.public = true
    this.close('.usurepub')
  }


  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null),
      image: new FormControl(null),
      date: new FormControl(null),
      description: new FormControl(null),
    });
  }

  setThumbnail(duration: string, path: string) {
    this.work.thumbnail = { duration: duration, url: path }
  }

  async onSubmit() {
    let URL = ''
    if (this.selectedPic._id) {
      if (this.selectedPic.date && this.invalidPicDate) {
        window.alert("Please enter a valid date")
        return
      }
      this.photoService.editPhoto(this.selectedPic._id, this.selectedPic.name, this.selectedPic.date, this.selectedPic.description).subscribe({})
      this.work.content[this.selectedPic['index']] = this.selectedPic
    } else {
      if (this.selectedPic.image) {
        if (!this.selectedPic.name) {
          this.selectedPic.name = "Untitled"
        }
        this.photoService.addPhoto(this.selectedPic.name, this.selectedPic.image, this.selectedPic.date, this.selectedPic.description).subscribe({
          next: (data) => {
            if (this.activeRoute.snapshot.params['id']) {
              this.workService.addPic({ id: this.work._id, pic: data.photo._id }).subscribe(() => {
                this.work.content.push(data.photo)
              })
            } else {
              this.workService.newWork({
                name: this.work.name,
                description: this.work.description,
                date: this.work.date,
                socialm: this.work.socialm,
                authors: this.work.authors,
                medium: this.work.medium,
                public: this.work.public,
                content: [data.photo._id],
                thumbnail: { duration: null, url: data.photo.imagePath }
              }).subscribe({
                next: (data) => {
                  this.router.navigate(['Work-Template', data._id])
                }
              })
            }
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

  saveWork() {
    if (!this.activeRoute.snapshot.params['id']) {
      return
    }

    if (this.work.date && this.invalidWorkDate) {
      window.alert("Please enter a valid date")
      return
    }

    this.workService.editWork({
      id: this.work._id,
      changes: {
        name: this.work.name ? this.work.name : 'New Work',
        description: this.work.description,
        date: this.work.date,
        medium: this.work.medium,
        public: this.work.public,
        socialm: this.work.socialm,
        thumbnail: this.work.thumbnail,
        authors: this.work.authors
      }
    }
    ).subscribe(() => {
      const done = document.querySelector('.no-access1-done') as HTMLElement

      done.style.display = 'flex'
    })
  }

  loading() {
    const loading = document.querySelector('.loading') as HTMLElement

    loading.style.display = loading.style.display == 'flex' ? 'none' : 'flex'
  }

  selectedCard(index?: number) {
    const buttons = document.querySelector(".imgbtn") as HTMLElement

    if (typeof index == 'number') {
      fetch(this.work.content[index].imagePath)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();

          reader.readAsDataURL(blob);
          reader.onload = (event: any) => {
            this.imageData = event.target.result
          }
        });

      buttons.style.visibility = 'hidden'
      this.selectedPic = this.work.content[index]
      this.selectedPic.index = index
    } else {
      buttons.style.visibility = 'visible'
    }

    const card = document.querySelector(".container-all2") as HTMLElement;
    card.style.display = "block";
  }

  confirm(name) {
    const banWindow = document.querySelector(name) as HTMLElement
    const vidwindow = document.querySelector('.videoedit') as HTMLElement
    vidwindow.style.display = 'none'
    banWindow.style.visibility = "visible"
  }

  closeWindow(name) {
    const alert = document.querySelector(name) as HTMLElement
    alert.style.display = 'none'

    this.selectedVid = {}
    this.videosrc = ''
    this.invalidVidDate = false
  }

  removeSelf() {
    const index = this.work.authors.findIndex(x => x == this.user)

    this.work.authors.splice(index, 1)
    this.workService.editWork({
      id: this.work._id, changes: {
        authors: this.work.authors
      }
    }).subscribe({
      next: () => this.router.navigate(['Profile'])
    })
  }

  deletePhoto() {
    this.photoService.deletePhoto(this.selectedPic._id).subscribe(() => {

      this.workService.delPic({ id: this.work._id, index: this.selectedPic.index }).subscribe({
        next: (data) => {
          this.work.content.splice(this.selectedPic.index, 1)

        },

        error: (err) => console.log(err),

        complete: () => {
          if (this.work.thumbnail == this.imageData && this.work.content.length > 0) {
            this.work.thumbnail = this.work.content[0].thumbnail
          }

          this.reloadWindow()
          this.popuppicoff2()

          if (this.work.content.length < 1) {
            this.workService.deleteWork(this.work._id).subscribe(done => {
              this.router.navigate(['New-Work-Template'])
              return
            })
          }

          const alert = document.querySelector(".delPhoto") as HTMLElement
          alert.style.visibility = 'hidden'
          this.saveWork()
        }
      })
    })
  }

  hide(name: string) {
    const confirmWindow = document.querySelector(name) as HTMLElement

    confirmWindow.style.display = 'none'
  }

  deleteWork() {
    this.workService.deleteWork(this.work._id).subscribe({
      next: () => this.router.navigate(['Profile']),
      error: () => window.alert("This work can only be deleted by the original owner")
    })
  }

  updatePhoto(name: HTMLInputElement, date: HTMLInputElement, description: HTMLTextAreaElement): boolean {
    this.photoService.editPhoto(this.photo._id, name.value, date.value, description.value)
      .subscribe(res => { });
    return false;
  }

  close(name: string) {
    const alert = document.querySelector(name) as HTMLElement
    alert.style.visibility = "hidden"
  }

  editVideo(index) {
    this.selectedVid = this.work.content[index]
    this.newVideo = false
    this.videosrc = `https://www.youtube.com/embed/${this.work.content[index].videoID}`

    const alert = document.querySelector('.videoedit') as HTMLElement
    alert.style.display = 'flex'
  }

  addVideo() {
    const done = document.querySelector('.no-access1-done') as HTMLElement
    if (this.selectedVid['date'] && this.invalidVidDate) {
      window.alert("Please enter a valid date")
      return
    }
    if (this.newVideo) {
      if (this.activeRoute.snapshot.params['id']) {
        this.workService.addVideo(this.work._id, this.selectedVid).subscribe(data => {
          this.work.content.push(data)

          this.closeWindow('.videoedit')
          done.style.display = 'flex'
        })
      } else {
        this.workService.newWork({
          name: this.work.name,
          description: this.work.description,
          date: this.work.date,
          socialm: this.work.socialm,
          authors: this.work.authors,
          medium: this.work.medium,
          public: this.work.public,
          content: [],
          thumbnail: this.selectedVid['thumbnail'],
          video: this.selectedVid
        }).subscribe(data => {
          this.router.navigateByUrl(`Work-Template/${data._id}`).then(() => done.style.display = 'flex')
        })
      }
    } else {
      this.workService.updateVideo(this.selectedVid['_id'], this.selectedVid).subscribe(data => {
        this.closeWindow('.videoedit')
        done.style.display = 'flex'
      })
    }
  }

  deleteVideo() {
    const done = document.querySelector('.no-access1-done') as HTMLElement
    const index = this.work.content.findIndex(x => x._id == this.selectedVid['_id'])
    this.workService.deleteVideo(this.work._id, this.selectedVid['_id']).subscribe(data => {
      this.close('.delVideo')

      this.work.content.splice(index, 1)
      done.style.display = 'flex'
    })
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

  ngOnDestroy() {
  }
}