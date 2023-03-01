import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-collection-template',
  templateUrl: './collection-template.component.html',
  styleUrls: ['./collection-template.component.css']
})
export class CollectionTemplateComponent implements OnInit {



  collection = {
    _id: '',
    name: '',
    started: '',
    finished: '',
    description: '',
    public: false,
    authors: [],
    thumbnails: []
  }
  items = []
  isLoaded = false
  updatedItems = []
  selectedMembers = []
  pathName = ''
  filter = ''
  user = ''
  members = []
  title = 'Create collection'
  invalidStartDate: Boolean
  invalidFinishDate: Boolean
  isOnMobile: Boolean

  constructor(private authService: AuthService, private router: Router, private collectionService: CollectionService, private activatedRoute: ActivatedRoute) { }

  selectMember(user) {
    if (this.collection.authors.includes(user._id)) {
      if (user._id == this.user) {
        if (this.collection.authors.length <= 1) {
          const alert = document.querySelector('.cant-self') as HTMLElement

          alert.style.visibility = 'visible'
          return false
        }

        const alert = document.querySelector('.remove-self') as HTMLElement

        alert.style.visibility = 'visible'
        return false
      }

      this.collection.authors.splice(this.collection.authors.indexOf(user._id), 1)
      this.selectedMembers.splice(this.selectedMembers.indexOf(user), 1)

    } else {
      this.selectedMembers.push(user)
      this.collection.authors.push(user._id)
    }

    return true
  }

  publicItem(check: boolean) {
    if (check) {
      if (this.collection.public) { return false }
      const alert = document.querySelector('.usurepub') as HTMLElement

      alert.style.visibility = 'visible'
      return false
    }
    this.collection.public = false
    return true
  }

  confirmpublic() {
    const check = document.querySelector('#public') as HTMLInputElement

    check.checked = true
    this.collection.public = true
    this.close('.usurepub')
  }

  gotoFolder(id: string) {
    this.router.navigate([`Folder-Template/${id}`])
  }

  gotoItem(id: string) {
    this.router.navigate([`Collection-Item-Template/${id}`])
  }

  async createCollection(type: string) {
    this.collectionService.newCollection(type).subscribe({
      next: (data) => {
        this.router.navigate([data.URL])
      },

      error: (err) => console.log(err),
    })
  }

  confirm() {
    const banWindow = document.querySelector(".banWindow") as HTMLElement
    banWindow.style.visibility = "visible"
  }

  closeWindow() {
    const banWindow = document.querySelector(".banWindow") as HTMLElement
    banWindow.style.visibility = "hidden"
  }

  close(name: string) {
    const alert = document.querySelector(name) as HTMLElement
    alert.style.visibility = "hidden"
  }

  removeSelf() {
    const index = this.collection.authors.findIndex(x => x == this.user)

    this.collection.authors.splice(index, 1)
    this.collectionService.updateCollection(this.collection).subscribe({
      next: () => {
        this.router.navigate(['Profile'])
      }
    })
  }

  addItem(type: string) {
    const id = this.activatedRoute.snapshot.params['id']
    const route = id ? `New-${type}-Template/${id}` : `New-${type}-Template`

    this.router.navigate([route])

  }

  setThumbnail(index: number, item) {
    if(!item.path){ item.path = ''}
    const flag = document.querySelector(`#check${index}`) as HTMLInputElement
    const pic = this.items.find(x => x._id == item._id)

    if (pic.isThumbnail) {
      if (this.collection.thumbnails.length <= 1) {
        window.alert("The collection needs to have at least one active thumbnail")
        flag.checked = true
        return
      }
      pic.isThumbnail = false
      const picIndex = this.collection.thumbnails.findIndex(x => x._id == pic._id)
      this.collection.thumbnails.splice(picIndex, 1)

    } else {
      if (this.collection.thumbnails.length >= 4) {
        window.alert("You can only set up to 4 items as thumbnails")
        flag.checked = false
        return
      }
      pic.isThumbnail = true
      this.collection.thumbnails.push(item)

    }

    const changed = this.updatedItems.find(x => x.id == pic._id)

    if (changed) {
      this.updatedItems.splice(this.updatedItems.indexOf(changed), 1)
      return
    }

    this.updatedItems.push({ id: item._id, changes: { isThumbnail: pic.isThumbnail } })
  }

  dateCheck(event, type) {
    if (event.code.includes('Enter')) { 
      this.updateCollection() 
      return false
    }

    if (event.code != 'Backspace') {
      if (type == 'started') {
        if (this.collection.started.length == 4 || this.collection.started.length == 7) { this.collection.started += '-' }
      } else {
        if (this.collection.finished.length == 4 || this.collection.finished.length == 7) { this.collection.finished += '-' }
      }
    }
    return /(?=^Digit|Numpad)\w+[0-9]|^Backspace$/.test(event.code)
  }

  dateFormat(event, type) {
    const regex = /^[12]\d{3}(?:(?:-(?:0[1-9]|1[0-2]))(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/

    if (type == 'started') {
      if (event.length == 5 || event.length == 8) { this.collection.started = this.collection.started.slice(0, -1) }
      this.invalidStartDate = !regex.test(this.collection.started)

    } else {
      if (event.length == 5 || event.length == 8) { this.collection.finished = this.collection.finished.slice(0, -1) }
      this.invalidFinishDate = !regex.test(this.collection.finished)
    }
  }

  updateCollection() {
    if (this.items.length < 1) {
      const alert = document.querySelector('.cant-empty') as HTMLElement

      alert.style.visibility = 'visible'
      return
    }

    if ((this.collection.started && this.invalidStartDate) || (this.collection.finished && this.invalidFinishDate)) {
      window.alert("Please enter a valid date")
      return
    }

    delete this.collection['._id']
    delete this.collection['items']
    this.pathName = this.collection.name
    this.collectionService.updateCollection(this.collection).subscribe(data => { })
    for (let changes of this.updatedItems) {
      this.collectionService.updateItem(changes).subscribe(() => { })
    }
    const done = document.querySelector('.no-access1-done') as HTMLElement

    done.style.display = 'flex'
  }

  async deleteCollection() {
    for (let item of this.items) {
      this.collectionService.deleteItem(item._id, true).subscribe(data => { })
    }

    this.collectionService.deleteCollection(this.collection._id).subscribe(done => {
      this.router.navigate(['Profile'])
    })
  }

  

  ngOnInit(): void {
    const collectionId = this.activatedRoute.snapshot.params['id']
    this.isOnMobile = navigator.maxTouchPoints > 0

    this.authService.getUserId().subscribe(data => {
      this.members = data.family
      if (!collectionId) {
        this.user = data.id
        const index = this.members.findIndex(x => x._id == this.user)
        this.members[index].checked = true

        this.selectedMembers.push(this.members[index])
      }

    })

    if (collectionId) {
      this.collectionService.getCollection(collectionId).subscribe({
        next: (data) => {
          if (!data.isAuthor) {
            this.router.navigate(['Collections'])
          }
          this.collection = data.collection
          this.items = data.content
          this.pathName = data.name
          this.user = data.user
          this.isLoaded = true
          this.title = "Edit collection"

          for (let user of this.members) {
            if (data.collection.authors.includes(user._id)) {
              user.checked = true
              this.selectedMembers.push(user)
            }
          }
        },
        error: (err) => this.router.navigate(['New-Collection-Template']),

        complete: () => {

          if(this.isOnMobile){
            this.updateScrollbarMobile()
          } else{
            this.updateScrollbar()
          }
        }
      })
    }
  }

  hide() {
    const confirmWindow = document.querySelector('.no-access1-done') as HTMLElement

    confirmWindow.style.display = 'none'
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
