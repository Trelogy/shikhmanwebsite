import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WorkService } from 'src/app/services/work.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private workService: WorkService, private activatedRoute: ActivatedRoute) {
    this.workService.getWork(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (data) => {
        for(let item of data.work.content){
          if(item.videoID){
            item.videoID = `https://www.youtube.com/embed/${item.videoID}`
          }
        }
        this.work = data.work
        this.info = data.info
        this.isLoaded = true

        const animation = document.querySelector(".animationhome") as HTMLElement;

        animation.style.visibility = "hidden";
      },

      error: (err) => console.log(err)
    })
   }

  isLoaded = false
  private userRole: string;
  canEdit$ = this.checkRole()
  work = {}
  info = {}

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
  }

}
