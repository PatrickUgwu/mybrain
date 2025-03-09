import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CalenderDayComponent } from './components/calender-day/calender-day.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'day', component: CalenderDayComponent },
];
