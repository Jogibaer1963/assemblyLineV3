import { Routes } from '@angular/router';
import { Team1 } from './team1/team1';
import { Team2 } from './team2/team2';
import { Team3 } from './team3/team3';
import { Team4 } from './team4/team4';
import { Team5 } from './team5/team5';

export const routes: Routes = [
  { path: 'team1', component: Team1 },
  { path: 'team2', component: Team2 },
  { path: 'team3', component: Team3 },
  { path: 'team4', component: Team4 },
  { path: 'team5', component: Team5 }
];
