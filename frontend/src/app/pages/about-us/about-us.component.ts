import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(private authService: AuthService) { }

  isLoaded = false
  role = ''
  truestring1 = `            
  However, they do realize the importance of a family then. Families are really essential as they help
  in our growth and development. They establish us into a complete person with which we create our own
  individual identity. Moreover, they always provide us with a sense of security and this gives us a safe
  environment.
  <br><br>
  We learn how to socialize from our families only and this will develop our intellect. Many studies show
  that people who live and stay with their families tend to be happier than ones living alone.
  <br><br>
  Families are the only ones who always believe in us when the whole world doubts us. Similarly, when we are
  down and out of control, they are the first ones to cheer you up. Certainly, it is a true blessing to have
  a positive family by our side.
  <br><br>
  However, they do realize the importance of a family then. Families are really essential as they help
  in our growth and development. They establish us into a complete person with which we create our own
  individual identity. Moreover, they always provide us with a sense of security and this gives us a safe
  environment.
  <br><br>`

  truestring2 = `            
  <img src="./assets/img/aboutus.png">
  <br><br>
  Families are the only ones who always believe in us when the whole world doubts us. Similarly, when
  we are down and out of control, they are the first ones to cheer you up. Certainly, it is a true
  blessing to have a positive family by our side.
  `

  ngOnInit(): void {
    this.authService.getRole().then(data => {
      this.role = data.role
      const mainp = document.querySelector('p') as HTMLElement
      const secondp = document.querySelector('.about-column2')

      if (['Guest', 'Guest with access'].includes(data.role)) {
        mainp.innerHTML = 'No cheating<br>'

        for (let i = 0; i < 4; i++) {
          mainp.innerHTML = `${mainp.innerHTML}Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus id, pariatur eligendi, nisi quod, veritatis deleniti ut rerum quibusdam unde ea accusamus vitae nesciunt rem dolores ducimus cum dolore sed fugit deserunt cupiditate eum tempore doloremque. Delectus officia minus, reiciendis repellat, sit adipisci, itaque fugiat modi ea cumque voluptates quam.<br><br>`
        }
        secondp.innerHTML = '<img src="./assets/img/aboutus.png"><br><br>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus id, pariatur eligendi, nisi quod, veritatis deleniti ut rerum quibusdam unde ea accusamus vitae nesciunt rem dolores ducimus cum dolore sed fugit deserunt cupiditate eum tempore doloremque. Delectus officia minus, reiciendis repellat, sit adipisci, itaque fugiat modi ea cumque voluptates quam.'
      } else {
        mainp.innerHTML = this.truestring1
        secondp.innerHTML = this.truestring2
      }
      this.isLoaded = true
    })
  }

}
