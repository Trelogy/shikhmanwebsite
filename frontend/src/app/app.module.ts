import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

// Components
import { HomeComponent } from './pages/home/home.component';
import { FamilyMemberComponent } from './private/family-member/family-member.component';
import { WorkComponent } from './private/work/work.component';
import { CollectionsComponent } from './private/collections/collections.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { WorksComponent } from './private/works/works.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { SocialLibraryComponent } from './pages/social-library/social-library.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { CollectionComponent } from './private/collection/collection.component';
import { CollectionItemComponent } from './private/collection-item/collection-item.component';
import { AdminComponent } from './admin/admin/admin.component';
import { ProfileComponent } from './private/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { PersonalSettingsComponent } from './private/personal-settings/personal-settings.component';
import { CollectionFolderComponent } from './private/collection-folder/collection-folder.component';
import { WorkTemplateComponent } from './private/work-template/work-template.component';
import { CollectionItemTemplateComponent } from './private/collection-item-template/collection-item-template.component';
import { CollectionTemplateComponent } from './private/collection-template/collection-template.component';
import { FolderTemplateComponent } from './private/folder-template/folder-template.component';
import { SelectpictureComponent } from './private/selectpicture/selectpicture.component';
import { GoogleLoginComponent } from './pages/login/google-login/google-login.component';
import { AnimationlogoComponent } from './pages/animationlogo/animationlogo.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

// Providers
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { SearchfilterPipe } from './pipes/searchfilter.pipe';
import { RadiofilterPipe } from './pipes/radiofilter.pipe';
import { NumberfilterPipe } from './pipes/numberfilter.pipe';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { SafePipe } from './pipes/safe.pipe';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    SelectpictureComponent,
    HomeComponent,
    FamilyMemberComponent,
    WorkComponent,
    CollectionsComponent,
    WorksComponent,
    AboutUsComponent,
    SocialLibraryComponent,
    ContactUsComponent,
    CollectionComponent,
    CollectionItemComponent,
    AdminComponent,
    ProfileComponent,
    SignUpComponent,
    LoginComponent,
    PersonalSettingsComponent,
    CollectionFolderComponent,
    WorkTemplateComponent,
    CollectionItemTemplateComponent,
    CollectionTemplateComponent,
    FolderTemplateComponent,
    SearchfilterPipe,
    RadiofilterPipe,
    NumberfilterPipe,
    GoogleLoginComponent,
    ForgotPasswordComponent,
    AnimationlogoComponent,
    SafePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    ImageCropperModule
  ],
  providers: [AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  },
  OAuthService
  ],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule { }
