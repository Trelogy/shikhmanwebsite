import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

// Components
import { HomeComponent } from './pages/home/home.component';
import { FamilyMemberComponent } from './private/family-member/family-member.component';
import { WorkComponent } from './private/work/work.component';
import { CollectionsComponent } from './private/collections/collections.component';
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
import { CollectionTemplateComponent } from './private/collection-template/collection-template.component';
import { CollectionItemTemplateComponent } from './private/collection-item-template/collection-item-template.component';
import { FolderTemplateComponent } from './private/folder-template/folder-template.component';
import { BanGuard } from './ban.guard';
import { GoogleLoginComponent } from './pages/login/google-login/google-login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [

  { path: 'Contact-Us', component: ContactUsComponent },
  { path: 'Google-Login', component: GoogleLoginComponent },
  {
    path: '', canActivateChild: [BanGuard], children: [
      { path: '', redirectTo: 'Shikhman', pathMatch: 'full' },
      { path: 'Shikhman', component: HomeComponent },
      { path: 'Family-Member', component: FamilyMemberComponent },
      { path: 'Work/:id', component: WorkComponent, canActivate: [AuthGuard]},
      { path: 'Collections', component: CollectionsComponent, canActivate: [AuthGuard] },
      { path: 'Works', component: WorksComponent, canActivate: [AuthGuard] },
      { path: 'About-Us', component: AboutUsComponent, },
      { path: 'Social-Library', component: SocialLibraryComponent },
      { path: 'Collection/:id', component: CollectionComponent, canActivate: [AuthGuard] },
      { path: 'Collection-Item/:id', component: CollectionItemComponent, canActivate: [AuthGuard] },
      { path: 'Admin-Panel', component: AdminComponent, canActivate: [AuthGuard, RoleGuard], data: { requiredRoles: ['Admin'] } },
      { path: 'Profile', canActivate: [AuthGuard], component: ProfileComponent },
      { path: 'User/:id', canActivate: [AuthGuard], component: ProfileComponent },
      { path: 'Forgot-Password', component: ForgotPasswordComponent },
      { path: 'Recover-Password/:id', component: ForgotPasswordComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'Personal-Settings', component: PersonalSettingsComponent, canActivate: [AuthGuard] },
      { path: 'Collection-Folder/:id', component: CollectionFolderComponent, canActivate: [AuthGuard] },
      { path: 'New-Work-Template', component: WorkTemplateComponent, canActivate: [AuthGuard, RoleGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: 'Work-Template/:id', component: WorkTemplateComponent, canActivate: [AuthGuard, RoleGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: 'New-Collection-Template', component: CollectionTemplateComponent, canActivate: [AuthGuard, RoleGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: 'Collection-Template/:id', component: CollectionTemplateComponent, canActivate: [AuthGuard, RoleGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: 'Folder-Template/:id', component: FolderTemplateComponent, canActivate: [AuthGuard, RoleGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: 'New-Folder-Template', component: FolderTemplateComponent, canActivate: [AuthGuard, RoleGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: 'New-Folder-Template/:id', component: FolderTemplateComponent, canActivate: [AuthGuard, RoleGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: 'New-Item-Template', component: CollectionItemTemplateComponent, canActivate: [AuthGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: 'New-Item-Template/:id', component: CollectionItemTemplateComponent, canActivate: [AuthGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: 'Collection-Item-Template/:id', component: CollectionItemTemplateComponent, canActivate: [AuthGuard], data: { requiredRoles: ['Admin', 'Family member'] } },
      { path: '**', redirectTo: 'Shikhman', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {

    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
