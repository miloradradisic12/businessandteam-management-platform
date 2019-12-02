import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {RoleService} from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';


/**
 * Application's header bar.
 *
 * @input isLoggedIn - should be false if the page intended for not authenticated users
 * @input backNavOptions - options for back navigation link, it contains 'caption', 'route' and 'url' params
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() isLoggedIn = true;
  @Input() backNavOptions: {caption: string, route?: any[], url?: string};

  private navForFounder = false;

  constructor(
    private router: Router,
    private roleService: RoleService,
    private location: Location
  ) { }

  goHome() {
    const role = this.roleService.getCurrentRole();
    this.router.navigate([({
      [Roles.Creator]: '/founder',
      [Roles.Backer]: '/backer',
      [Roles.Employee]: '/employee',
    })[role]]);
  }

  goBack() {
    const options = this.backNavOptions;
    if (options.url) {
      this.router.navigateByUrl(options.url);
    } else if (options.route) {
      this.router.navigate(options.route);
    } else {
      this.location.back();
    }
  }
  
}
