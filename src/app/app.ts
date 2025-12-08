import { Component, signal, OnDestroy, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { io, Socket } from 'socket.io-client';

interface LineSchedule {
  _id: string;
  machine: string;
  bay_2: string;
  activeList?: string;
  activeInLine?: string;
  sequenz: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  title = 'Assembly Line';
  fcb1Busy = false;
  fcbStation1Status = '-- free --';
  schedules: LineSchedule[] = [];
  fcb2Busy = false;

  // Socket.IO client instance
  private socket?: Socket;
  // Polling fallback handle
  private pollHandle?: ReturnType<typeof setInterval>;

  constructor(private http: HttpClient, private zone: NgZone) {}


  ngOnInit(): void {
    // Initial load as a fallback and for first paint
    this.loadSchedule();
    this.refreshFcb1Status();
    // Start a light polling fallback every 15s
    this.pollHandle = setInterval(() => {
      this.loadSchedule();
      this.refreshFcb1Status();
    }, 15000);
    // Setup real-time updates via Socket.IO
    this.initSocket();
  }

  ngOnDestroy(): void {
    try {
      this.socket?.removeAllListeners();
      this.socket?.disconnect();
    } catch (e) {
      // noop
    }
    if (this.pollHandle) {
      clearInterval(this.pollHandle);
      this.pollHandle = undefined;
    }
  }

  private initSocket(): void {
    // Decide backend URL: during ng serve (4200) connect to 5000, else same origin
    const isDev = typeof window !== 'undefined' && window.location?.port === '4200';
    const url = isDev ? 'http://localhost:5000' : window.location.origin;

    // Connect
    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
    });

    // Initial payload
    this.socket.on('schedule:init', (docs: LineSchedule[]) => {
      this.zone.run(() => {
        this.schedules = (docs ?? []).slice(0, 7);
        this.refreshFcb1Status();
      });
    });

    // Live updates on change stream events
    this.socket.on('schedule:update', (payload: { reason: string; data: LineSchedule[] }) => {
      this.zone.run(() => {
        const docs = Array.isArray(payload?.data) ? payload.data : [];
        this.schedules = docs.slice(0, 7);
        this.refreshFcb1Status();
      });
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Socket connect_error:', err);
    });
  }

  private loadSchedule(): void {
    const isDev = typeof window !== 'undefined' && window.location?.port === '4200';
    const apiBase = isDev ? 'http://localhost:5000/api' : '/api';
    this.http
      .get<LineSchedule[]>(`${apiBase}/lineSchedule`, { params: { sort: 'asc' } })
      .subscribe({
        next: (data) => {
          // Limit the number of documents displayed in the table to 7
          this.schedules = (data ?? []).slice(0, 7);
        },
        error: (err) => {
          console.error('Failed to load line schedule', err);
          this.schedules = [];
        },
      });
  }

  onRowClick(rowId: string, tag: string): void {
    if (this.fcb1Busy) {
      return; // prevent clicking when FCB 1 is occupied
    }
    // Set activeList to "false" for this row in the backend
    const isDev = typeof window !== 'undefined' && window.location?.port === '4200';
    const apiBase = isDev ? 'http://localhost:5000/api' : '/api';
    this.http
      .patch(`${apiBase}/lineSchedule/activeList`, { rowId, tag })
      .subscribe({
        next: () => {
          // Update FCB1 status immediately
          this.refreshFcb1Status();
        },
        error: (err) => {
          console.error('Failed to update activeList for', rowId, err);
        },
      });
  }

  private refreshFcb1Status(): void {
    const isDev = typeof window !== 'undefined' && window.location?.port === '4200';
    const apiBase = isDev ? 'http://localhost:5000/api' : '/api';
    this.http.get<{ active: boolean; _id?: string; machine?: string; start?: string | null }>(`${apiBase}/fcb/1/status`)
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
        }
      });
  }

  moveToFCB2(): void {

  }

  moveToBay2(): void {

  }

  moveToBay3(): void {

  }


  moveToBay4(): void {

  }

  moveToBay5(): void {

  }

  moveToBay6(): void {
  }

  moveToBay7(): void {
  }

  moveToBay8(): void {
  }

  moveToBay9(): void {
  }

  moveToBay10(): void {
  }



}
