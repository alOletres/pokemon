import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { 
  Observable, 
  defer, 
  BehaviorSubject, 
  switchMap, 
  catchError, 
  throwError, 
  filter, 
  take 
} from 'rxjs';
import Method from '../utils/method';
import { AuthService } from '../components/routes/auth/auth.service';
import { IResponse, ISecret } from '../globals/interface';
import { SnackBarService } from '../shared/services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInteceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private method: Method, private authService: AuthService, private snackBar: SnackBarService,) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let authReq  = req;

    const token = this.method.getCookie("accessToken");
    if(token !== null) {
      authReq = this.addTokenHeader(req, token);
    }

     return next.handle(authReq).pipe(catchError((error: HttpErrorResponse) => {
   
      if(error.status === 403) {
        // refresh token or logout
        return this.handle401Error(authReq, next);
      } else {
        this.snackBar._showSnack(`${error.error.message} ${error.status}`, "error");
        return throwError(() => new Error(error.error));
      }

    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    
    if(!this.isRefreshing) {
      this.isRefreshing  = true;
      this.refreshTokenSubject.next(null);

      const token = this.method.getCookie("refreshToken");
      const refreshObservable = defer(() => this.authService.refresh_token())

      return refreshObservable.pipe(

        switchMap((response: IResponse<ISecret>) => {
   
          this.isRefreshing = false;
          this.method.setCookie("accessToken", response.data?.accessToken as string);
          this.refreshTokenSubject.next(response.data?.accessToken as string);
          return next.handle(this.addTokenHeader(request, response.data?.accessToken as string))
        }),
        catchError((err) => {
          this.isRefreshing = false;
          alert("Session is expired!, Unauthorized");
          this.authService.signOut();
          return throwError(() => new Error(err));
        })
      )
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );

  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    
    /* for Node.js Express back-end */
    return request.clone({ headers: request.headers.set('Authorization', 'Bearer '+token) });
  }

}
