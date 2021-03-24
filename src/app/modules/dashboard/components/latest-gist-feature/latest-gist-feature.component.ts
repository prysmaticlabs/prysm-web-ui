import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map, tap } from 'rxjs/operators';
import { GitResponse } from '../../types/git-response';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-latest-gist-feature',
  templateUrl: './latest-gist-feature.component.html',
  styleUrls: ['./latest-gist-feature.component.scss'],
})
export class LatestGistFeatureComponent implements OnInit {
  constructor(private httpClient: HttpClient) {}

  loading = false;
  gitResponse$: Observable<GitResponse> | undefined;

  ngOnInit(): void {
    this.loading = true;
    this.gitResponse$ = this.httpClient.get<GitResponse>(
      'https://api.github.com/repos/prysmaticlabs/prysm/releases'
    ).pipe(
      map((val: any) => {
        return val[0];
      }),
      finalize(() => {
        this.loading = false;
      })
    );
  }
}
