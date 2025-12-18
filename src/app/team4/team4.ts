// Test Bay TB_1 to TB_4
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-team4',
  imports: [
    RouterOutlet
  ],
  templateUrl: './team4.html',
  styleUrl: './team4.css',
})
export class Team4 implements OnInit, OnDestroy {
  title = 'Team 4';

  // Digital clock state
  hours = '';
  minutes = '';
  seconds = '';
  ampm = '';
  dateDisplay = '';

  // Clock interval handle
  private clockHandle?: ReturnType<typeof setInterval>;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.updateClock();
    // Live digital clock tick every second
    this.clockHandle = setInterval(() => {
      // ensure change detection picks updates when running outside Angular timers
      this.zone.run(() => this.updateClock());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockHandle) {
      clearInterval(this.clockHandle);
      this.clockHandle = undefined;
    }
  }

  private updateClock(): void {
    const now = new Date();
    let hrs = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    this.ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12;
    if (hrs === 0) hrs = 12;
    this.hours = String(hrs).padStart(2, '0');
    this.minutes = String(mins).padStart(2, '0');
    this.seconds = String(secs).padStart(2, '0');

    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const d = now.getDate();
    const day = days[now.getDay()];
    const mon = months[now.getMonth()];
    const yr = now.getFullYear();
    this.dateDisplay = `${day} | ${mon} ${d}, ${yr}`;
  }
}
