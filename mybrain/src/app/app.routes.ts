import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { KnowledgeComponent } from './pages/knowledge/knowledge.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'calendar', component: CalendarComponent },
    { path: 'lib', component: KnowledgeComponent },
];
