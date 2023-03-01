import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-collection-item',
  templateUrl: './collection-item.component.html',
  styleUrls: ['./collection-item.component.css']
})
export class CollectionItemComponent implements OnInit {

  constructor(private authService: AuthService, private collectionService: CollectionService, private router: Router, private activatedRoute: ActivatedRoute) { }

  data = {
    item: {
      _id: '',
      name: '',
      description: '',
      date: '',
      medium: ''
    },
    content: [],
    authors: [],
    isAuthor: false,
    collection: {
      name: '',
      id: '',
      content: []
    },
    next: '',
    prev: '',
    path: []
  }

  isLoaded = false
  private userRole: string;
  canEdit$ = this.checkRole()

  async checkRole() {
    const Role = this.authService.getRole();


    await Role.then(data => {
      this.userRole = data['role']
    })


    return (['Admin', 'Family Member'].includes(this.userRole))
  }

  ngOnInit(): void {
    this.collectionService.getItem(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (data) =>  {
        this.data = data
        this.isLoaded = true        
      },
      error: (err) => console.log(err)
    })
  }

}
