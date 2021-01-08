import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "../user/user.service";
import { take, exhaustMap } from "rxjs/operators"

@Injectable()
export class InterceptorService implements HttpInterceptor {

    constructor(private user: UserService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return this.user.authSubject.pipe(
            take(1),
            exhaustMap((user) => {
                if (!user) {
                    return next.handle(request);
                }

                const modifiedRequest = request.clone({ params: new HttpParams().set('auth', user.token as string) })
                return next.handle(modifiedRequest);
            })
        )
    }
}