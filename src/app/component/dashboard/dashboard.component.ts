import { Component, OnInit, NgZone } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { GoogleSpreadsheetsApiService } from 'src/app/service/google-spreadsheets-api.service';
import { Note } from '../../vo/note';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @BlockUI()
  blockUI: NgBlockUI;

  spreadsheetId: string;

  range: string = 'A:C';

  isShowAddForm: Boolean;

  notes: Note[] = [];

  photo: string = 'assets/images/J.png';

  constructor(
    private googleSpreadsheetsApi: GoogleSpreadsheetsApiService,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.blockUI.start('Processing...');

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['id']) {
        this.spreadsheetId = params['id'];
        this.cookieService.set('id', this.spreadsheetId);
      } else if (this.cookieService.check('id')) {
        this.spreadsheetId = this.cookieService.get('id');
      }
      this.googleSpreadsheetsApi.login(environment.url, photo => {
        this.photo = photo;
        this.spreadsheetId = !this.spreadsheetId ? this.cookieService.get('id') : this.spreadsheetId;
        if (this.spreadsheetId) {
          this.list();
        } else {
          this.generator();
        }
      });
    });
  }

  private generator(): void {
    this.googleSpreadsheetsApi.create('Notes').then(response => {
      this.spreadsheetId = response.result.spreadsheetId;
      this.cookieService.set('id', this.spreadsheetId);
      this.list();
    });
  }

  list(): void {
    if (this.spreadsheetId) {
      this.googleSpreadsheetsApi.get(this.spreadsheetId, this.range).then(response => {
        this.notes = [];
        if (response.result.values) {
          response.result.values.forEach(element => {
            var note = new Note();
            note.id = this.notes.length + 1;
            note.title =  element[0];
            note.message = element[1];
            note.views = element[2];
            this.notes.push(note);
          });
        }
        this.ngZone.run(() => {});
        this.blockUI.stop();
      }, () => {
        this.generator();
      });
    }
  }

  remove(note: Note): void {
    this.blockUI.start('Processing...');
    this.googleSpreadsheetsApi.clear(this.spreadsheetId, 'A' + note.id + ':C').then(response => {
      var values: Array<Array<any>> = [];
      this.notes.filter(element => {
        return element.id > note.id;
      }).forEach(element => {
        values.push(element.toArray());
      });
      this.googleSpreadsheetsApi.append(this.spreadsheetId, this.range, values).then(response => {
        this.list();
      });
    });
  }

  onAdd(data: any): void {
    this.blockUI.start('Processing...');
    this.googleSpreadsheetsApi.append(this.spreadsheetId, this.range, [[data.title, data.message, 0]]).then(response => {
      this.isShowAddForm = !this.isShowAddForm;
      this.list();
    });
  }

  onView(status: boolean, note: Note): void {
    if (status) {
      this.googleSpreadsheetsApi.update(this.spreadsheetId, 'C' + note.id, ++note.views).then(response => {
      });
    }
  }

}