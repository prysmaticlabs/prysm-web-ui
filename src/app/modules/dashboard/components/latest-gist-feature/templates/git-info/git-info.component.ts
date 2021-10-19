import { Component, Input} from '@angular/core';
import { GitResponse } from '../../../../types/git-response';

@Component({
  selector: 'app-git-info',
  templateUrl: './git-info.component.html',
  styleUrls: ['./git-info.component.scss'],
})
export class GitInfoComponent {
  descriptionLength = 300;
  displayReadMore = false;

  private gitInfo: GitResponse | undefined;
  @Input()
  get GitInfo(): GitResponse | undefined {
    return this.gitInfo;
  }

  set GitInfo(val: GitResponse | undefined) {
    this.gitInfo = val;
    if (val) {
      this.displayReadMore = val.body.length > this.descriptionLength;
    }
  }
  constructor() {}

}
