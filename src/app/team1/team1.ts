// Team 1 Bay 2 to 4
import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-team1',
    imports: [
        RouterOutlet
    ],
  templateUrl: './team1.html',
  styleUrl: './team1.css',
})
export class Team1 {
  title = 'Team 1';
  schedules = [
    {_id: '1', machine: 'C8911310', bay_2: '10:00'}
  ];
}
