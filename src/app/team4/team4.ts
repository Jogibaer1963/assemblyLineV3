// Test Bay TB_1 to TB_4
import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-team4',
  imports: [
    RouterOutlet
  ],
  templateUrl: './team4.html',
  styleUrl: './team4.css',
})
export class Team4 {
  title = 'Team 4';
}
