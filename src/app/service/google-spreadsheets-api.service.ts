import { Injectable } from '@angular/core';

declare var gapi:any;

@Injectable({
  providedIn: 'root'
})
export class GoogleSpreadsheetsApiService {

  constructor() { }

  login(redirect: string, onLogin: FunctionStringCallback): void {
    gapi.load('client:auth2', function() {
      gapi.auth2.init({clientId: '527907299369-e46jq5ih12pufuh4d7e5qs94fd9i6la5.apps.googleusercontent.com'}).then(() => {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          gapi.client.load("https://content.googleapis.com/discovery/v1/apis/sheets/v4/rest").then(response => {
            onLogin(gapi.auth2.getAuthInstance().currentUser.Ab.w3.Paa);
          });
        } else {
          gapi.auth2.getAuthInstance().signIn({
            ux_mode: 'redirect',
            redirect_uri: redirect,
            scope: "https://www.googleapis.com/auth/drive"
          });
        }
      });
    });
  }

  create(title: string): any {
    var requestBody = {
      properties: {
        title: title
      }
    };
    return gapi.client.sheets.spreadsheets.create({}, requestBody);
  }


  get(spreadsheetId: string, range: string): any {

    var params = {
      spreadsheetId: spreadsheetId,
      range: range
    };
    return gapi.client.sheets.spreadsheets.values.get(params);
  }

  append(spreadsheetId: string, range: string, values: Array<Array<any>>): any {
    
    var params = {
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'RAW'
    };
    var valueRangeBody = {
      values: values
    }
    return gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  }

  clear(spreadsheetId: string, range: string): any {

    var params = {
      spreadsheetId: spreadsheetId,
      range: range
    };
    return gapi.client.sheets.spreadsheets.values.clear(params);
  }

  update(spreadsheetId: string, range: string, value: number): any {

    var params = {
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'RAW'
    };
    var valueRangeBody = {
      values: [[value]]
    };
    return gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
  }
}