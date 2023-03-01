import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  constructor(private authService: AuthService, private collectionService: CollectionService, private activatedRoute: ActivatedRoute, private router: Router) { }

  currentPage = 1
  totalPages = 1
  data = {
    collection: {
      name: '',
      description: '',
      started: Date,
      finished: Date,
      _id: '',
    },
    content: [],
    authors: [],
    isAuthor: false
  }

  isLoaded = false
  private userRole: string;
  canEdit$ = this.checkRole()

  move(id: string){
    this.router.navigate(['Collection', id])
  }

  async checkRole() {
    const Role = this.authService.getRole();


    await Role.then(data => {
      this.userRole = data['role']
    })


    return (['Admin', 'Family Member'].includes(this.userRole))
  }

  ngOnInit(): void {
    const animation = document.querySelector(".animationhome") as HTMLElement;


    animation.style.visibility = "hidden";
    this.collectionService.getCollection(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (data) => {
        this.data = data
        this.data.collection.started = data.collection.started ? data.collection.started : "Unknown date"
        this.data.collection.finished = data.collection.finished ? data.collection.finished : "Present"
        this.isLoaded = true
      },

      error: () => this.router.navigate(['Collections'])
    })

  }


}
