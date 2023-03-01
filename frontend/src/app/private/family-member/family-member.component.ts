import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-family-member',
  templateUrl: './family-member.component.html',
  styleUrls: ['./family-member.component.css']
})
export class FamilyMemberComponent implements OnInit {

  constructor(private authService: AuthService) { }
  
  familyMembers = []

  ngOnInit(): void {
    this.authService.familyMembers().subscribe( data => {
      this.familyMembers = data.family
    })
  }

}
