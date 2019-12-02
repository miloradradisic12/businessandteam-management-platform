import { Component, OnInit, Input } from '@angular/core';
import { ForumService } from 'app/projects/forum.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preview-people',
  templateUrl: './preview-people.component.html',
  styleUrls: ['./preview-people.component.scss']
})
export class PreviewPeopleComponent implements OnInit {

  @Input() userThreadInfoList;

  constructor(private forumService: ForumService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  selectedThreadId(id) {
    this.forumService.setThreadViewCount(id).subscribe((obj) => {
      this.router.navigate([`../topics/${id}`], {relativeTo: this.route})
    });
  }

}
