import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

import {RoleService} from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.scss'
  ]
})
export class NavBarComponent {
  @Input() isLoggedIn = true;

  private navForFounder = false;

  constructor(
    private router: Router,
    private roleService: RoleService
  ) { }

  goHome() {
    const role = this.roleService.getCurrentRole();
    this.router.navigate([({
      [Roles.Creator]: '/founder',
      [Roles.Backer]: '/backer',
      [Roles.Employee]: '/employee',
    })[role]]);
  }
  
}
