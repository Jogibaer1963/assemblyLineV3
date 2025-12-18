// Team 1 Bay 2 to 4
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';

interface LineSchedule {
  _id: string;
  machine: string;
  bay_2: string;
  activeList?: string;
  activeInLine?: string;
  sequenz: number;
}

@Component({
  selector: 'app-team1',
  standalone: true,
    imports: [
        RouterOutlet,
        CommonModule,
    ],
  templateUrl: './team1.html',
  styleUrls: ['./team1.css'],
})
export class Team1 implements OnInit, OnDestroy {
  title = 'Team 1';
  schedules: LineSchedule[] = [];
  // FCB 1 status
  fcb1Busy = false;
  fcbStation1Status = '-- free --';
  // Common label used across the template to avoid duplication
  freeLabel = '— free —';

  // Digital clock state
  hours = '';
  minutes = '';
  seconds = '';
  ampm = '';
  dateDisplay = '';

  // Socket.IO client instance (optional, if the backend supports it)
  private socket?: Socket;
  // Polling fallback handle
  private pollHandle?: ReturnType<typeof setInterval>;
  // Clock interval handle
  private clockHandle?: ReturnType<typeof setInterval>;

  constructor(private http: HttpClient, private zone: NgZone) {}

  ngOnInit(): void {
    // Initial load as a fallback and for first paint
    this.loadSchedule();
    this.refreshFcb1Status();
    this.updateClock();
    // Live digital clock tick every second
    this.clockHandle = setInterval(() => {
      // ensure change detection picks updates when running outside Angular timers
      this.zone.run(() => this.updateClock());
    }, 1000);
    // Start a light polling fallback every 15s
    this.pollHandle = setInterval(() => {
      this.loadSchedule();
      this.refreshFcb1Status();
    }, 15000);
    // Set up real-time updates via Socket.IO (if backend emits events)
    this.initSocket();
  }

  ngOnDestroy(): void {
    try {
      this.socket?.removeAllListeners();
      this.socket?.disconnect();
    } catch {
      // noop
    }
    if (this.pollHandle) {
      clearInterval(this.pollHandle);
      this.pollHandle = undefined;
    }
    if (this.clockHandle) {
      clearInterval(this.clockHandle);
      this.clockHandle = undefined;
    }
  }

  private initSocket(): void {
    // Use the same logic as app.ts to discover backend URL
    const url = this.getSocketBase();
    this.socket = io(url, this.getSocketOptions());

    // Initial payload
    this.socket.on('schedule:init', (docs: LineSchedule[]) => {
      this.zone.run(() => {
        this.applySchedules(docs);
      });
    });

    // Live updates on change stream events
    this.socket.on('schedule:update', (payload: { reason: string; data: LineSchedule[] }) => {
      this.zone.run(() => {
        const docs = Array.isArray(payload?.data) ? payload.data : [];
        this.applySchedules(docs);
      });
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Team1 Socket connect_error:', err);
    });
  }

  // Apply schedules consistently and trigger dependent updates
  private applySchedules(docs: LineSchedule[] | undefined): void {
    this.schedules = (docs ?? []).slice(0, 7);
    this.refreshFcb1Status();
  }

  // Centralized Socket.IO options to avoid duplication (e.g., with other components)
  private getSocketOptions(): Partial<ManagerOptions & SocketOptions> {
    return {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
    };
  }

  private loadSchedule(): void {
    const apiBase = this.getApiBase();
    this.http
      .get<LineSchedule[]>(`${apiBase}/lineSchedule`, { params: { sort: 'asc' } })
      .subscribe({
        next: (data) => {
          // Limit the number of documents displayed in the table to 7
          this.schedules = (data ?? []).slice(0, 7);
        },
        error: (err) => {
          console.error('Team1: Failed to load line schedule', err);
          this.schedules = [];
        },
      });
  }

  private refreshFcb1Status(): void {
    const apiBase = this.getApiBase();
    this.http
      .get<{ active: boolean; _id?: string; machine?: string; start?: string | null }>(`${apiBase}/fcb/1/status`)
      .subscribe({
        next: (res) => {
          this.fcb1Busy = !!res?.active;
          if (this.fcb1Busy && res?.machine) {
            this.fcbStation1Status = res.machine;
          } else {
            this.fcbStation1Status = '-- free --';
          }
        },
        error: () => {
          // On error assume free but keep the previous display
          this.fcb1Busy = false;
          if (!this.fcbStation1Status) this.fcbStation1Status = '-- free --';
        },
      });
  }

  // Centralized URL helpers to avoid duplication
  private getApiBase(): string {
    const isDev = typeof window !== 'undefined' && window.location?.port === '4200';
    return isDev ? 'http://localhost:5000/api' : '/api';
  }

  private getSocketBase(): string {
    const isDev = typeof window !== 'undefined' && window.location?.port === '4200';
    return isDev ? 'http://localhost:5000' : window.location.origin;
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
