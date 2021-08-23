import { Component } from "@angular/core";
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse,
  HttpHeaders,
  HttpEvent
} from "@angular/common/http";
import { map, catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  progress$ = new BehaviorSubject(0);

  constructor(private http: HttpClient) {}

  upload(file: any) {
    this.progress$.next(0);
    const formData = new FormData();
    formData.append("file", file);

    const formDataHeader = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      })
    };

    this.http
      .post('http://localhost:3000/', formData, {
        reportProgress: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        observe: "events"
      })
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.ResponseHeader:
              break;
            case HttpEventType.UploadProgress:
              const progress = event.loaded / event.total;
              this.progress$.next(progress);
              break;
            case HttpEventType.Response:
              setTimeout(() => {
                this.progress$.complete();
              }, 500);

          }
        }),
        catchError((err: any) => {
          this.progress$.next(0);
          alert(err.message);
          return throwError(err.message);
        })
      ).toPromise();
  }
}
