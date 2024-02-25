import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, } from '@angular/common/http';

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const clonedRequest = req.clone({
        headers: req.headers.append('Authorization', 'Bearer ' + accessToken),
      });
      return next.handle(clonedRequest);
    } else {
      return next.handle(req);
    }
  }
}
