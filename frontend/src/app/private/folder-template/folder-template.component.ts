import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-folder-template',
  templateUrl: './folder-template.component.html',
  styleUrls: ['./folder-template.component.css']
})
export class FolderTemplateComponent implements OnInit {

  folder = {
    _id: '',
    name: '',
    description: '',
    parent: '',
    thumbnail: {}
  }

  back = ''
  filter = ''
  path = []
  collection = ''
  content = []
  isOnMobile: Boolean;

  constructor(private authService: AuthService, private router: Router, private collectionService: CollectionService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      const route = window.location.href.split('/')[3]
      this.isOnMobile = navigator.maxTouchPoints > 0

      if (route == 'Folder-Template') {
        this.collectionService.getItem(params['id']).subscribe({
          next: (data) => {
            this.folder = data.item
            this.content = data.content
            this.collection = data.item.coll
            this.path = data.path

            for (let level of this.path) {
              level.url = level.url.replace('Collection/', 'Collection-Template/')
              level.url = level.url.replace('folder', 'Folder-Template').replace('Collection-Folder', 'Folder-Template')
            }

            const parentPos = this.path.find(x => x.url.includes(this.folder.parent))
            this.back = parentPos.url

            if(this.isOnMobile){
              this.updateScrollbarMobile()
            } else{
              this.updateScrollbar()
            }
          },

          error: (err) => this.router.navigate(['Collections'])
        })
      } else if (!params['id']) {
        this.collectionService.newCollection({ type: 'folder' }).subscribe({
          next: (data) => {
            this.router.navigate([data.URL])
          },

          error: (err) => this.router.navigate(['Collections'])
        })
      } else {
        this.collectionService.newItem({ id: params['id'], type: 'folder' }).subscribe({
          next: (data) => {
            this.router.navigate([data.URL])
          },

          error: (err) => this.router.navigate(['Collections'])
        })
      }
    })
  }

  hide() {
    const confirmWindow = document.querySelector('.no-access1-done') as HTMLElement

    confirmWindow.style.display = 'none'
  }

  gotoFolder(id) {
    this.router.navigate([`Folder-Template/${id}`])
    window.location.reload()
  }

  gotoItem(id) {
    this.router.navigate([`Collection-Item-Template/${id}`])
  }

  addItem(type: string) {
    if (type == 'folder' && this.path.length > 4) {
      const alert = document.querySelector(".folder-limit") as HTMLElement

      alert.style.visibility = 'visible'
      return
    }

    this.collectionService.newItem({ id: this.folder._id, type: type }).subscribe(item => {
      this.router.navigate([item.URL])
    })
  }

  updateFolder() {
    this.collectionService.updateItem({ id: this.folder._id, changes: { name: this.folder.name, description: this.folder.description, thumbnail: this.folder.thumbnail } }).subscribe(complete => {
      this.router.navigateByUrl(this.back).then(data => {
        const confirmWindow = document.querySelector('.no-access1-done') as HTMLElement

        confirmWindow.style.display = 'flex'
      }
      )
    })
  }

  deleteFolder() {
    this.collectionService.deleteItem(this.folder._id).subscribe(data => {
      this.closeWindow('.banWindow')
      this.router.navigateByUrl(this.back).then(data => {
        const confirmWindow = document.querySelector('.no-access1-done') as HTMLElement

        confirmWindow.style.display = 'flex'
      }
      )
    })
  }

  setThumbnail(image: string) {
    this.folder.thumbnail = image
  }

  confirm() {
    const banWindow = document.querySelector(".banWindow") as HTMLElement
    banWindow.style.visibility = "visible"
  }

  closeWindow(name: string) {
    const alert = document.querySelector(name) as HTMLElement
    alert.style.visibility = "hidden"
  }


  ngOnInit(): void {
    this.updateScrollbar()
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

