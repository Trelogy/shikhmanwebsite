import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-collection-folder',
  templateUrl: './collection-folder.component.html',
  styleUrls: ['./collection-folder.component.css']
})
export class CollectionFolderComponent implements OnInit {

  constructor(private authService: AuthService, private collectionService: CollectionService, private router: Router, private activatedRoute: ActivatedRoute) { }

  data = {
    item: {
      _id: '',
      name: '',
      description: ''
    },
    content: [],
    authors: [],
    isAuthor: false,
    collection: {
      name: '',
      id: ''
    },
    neighbors : [],
    next: '',
    prev: '',
    path: []
  }
  URL = ''

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
      next: (data) => {
        this.data = data
        this.URL = data.item.type == 'folder' ? `Collection-Folder/${data.item._id}` : `Collection-Item/${data.item._id}`
        for(let level of data.path){
          level.url = level.url.replace('folder', 'Collection-Folder').replace('item', 'Collection-Item')
        }
      },

      error: (err) => this.router.navigate([''])
    })
  }
}
