import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { ProgressBarService } from '../shared/services/progress-bar.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingInteceptorService implements HttpInterceptor {

  constructor(private progressBarService: ProgressBarService) { }

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.progressBarService.isLoading.next(true);

    return next.handle(req).pipe(
      finalize(
        () => {
          this.progressBarService.isLoading.next(false);
        }
      )
    ) 
  }
}
