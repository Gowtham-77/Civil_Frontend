import { Routes } from '@angular/router';
import { Login } from './login/login';
import { WelderPerformanceQualification } from './welder-performance-qualification/welder-performance-qualification';
import { HomePage } from './home-page/home-page';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'welder-performance-qualification',
    loadComponent: () => import('./welder-performance-qualification/welder-performance-qualification')
      .then(m => m.WelderPerformanceQualification)
  },
  { path: 'home', component: HomePage }

];
