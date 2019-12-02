import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forum-overview',
  templateUrl: './forum-overview.component.html',
  styleUrls: ['./forum-overview.component.scss']
})
export class ForumOverviewComponent implements OnInit {
  
  currentStage: string = '';
  buttons: any[];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.buttons = [
      {caption: 'News', color: '#fe5f5b', icon: 'icon-newspaper-folded', link: 'news'},
      {caption: 'Forum', color: '#fe5f5b', icon: 'icon-discuss-issue', link: 'forum'},
      {caption: 'Videos', color: '#fe5f5b', icon: 'icon-video-player', link: 'videos'},
      {caption: 'Events', color: '#fe5f5b', icon: 'icon-event', link: 'events'},
      {caption: 'Messages', color: '#fe5f5b ', icon: 'icon-mail', link: 'messages'}
    ];
    this.currentStage = 'forum';    
  }

  getIcon(icon: string): string {
    return `/assets/img/project/${icon}`;
  }

  goTo(link?: string) {
    if (link) {
      this.currentStage = link;
      this.router.navigate([link], {relativeTo: this.route});
      // this.router.navigate(['dashboard',{ outlets: {document: [link]} }], {relativeTo: this.route});
    }
  }

}
