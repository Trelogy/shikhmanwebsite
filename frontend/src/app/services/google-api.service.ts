import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

const oauthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId:
    '644375607632-mb9gmknbpij8dl2278vo6u0ok95u3h3l.apps.googleusercontent.com',
  scope: 'openid profile email',
};

export interface userInfo {
  info: {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    picture: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  userProfileSubject = new Subject<userInfo>();

  constructor(private readonly oauthService: OAuthService) {
    oauthService.configure(oauthConfig);
    oauthService.loadDiscoveryDocument().then(() => {
      oauthService.tryLoginImplicitFlow().then(() => {
        if (!oauthService.hasValidAccessToken()) {
          oauthService.initLoginFlow();
        } else {
          oauthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as userInfo);
          });
        }
      });
    });
  }

  isLogged() {
    return this.oauthService.hasValidAccessToken();
  }

  logOut() {
    this.oauthService.logOut();
  }
}
