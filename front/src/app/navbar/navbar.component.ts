import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  hidden: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  toogleNavbar(): void {
    this.hidden = !this.hidden;
  }

}
