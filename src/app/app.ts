import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

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
export class App implements OnInit {

  title = 'Assembly Line';
  fcb1Busy = false;
  fcbStation1Status = '-- free --';
  schedules: LineSchedule[] = [];
  fcb2Busy = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSchedule();
    this.refreshFcb1Status();
  }

  ngOnDestroy(): void {
    // no-op (kept for future lifecycle cleanup when needed)
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

  private getApiBase(): string {
    const isDev = typeof window !== 'undefined' && window.location?.port === '4200';
    return isDev ? 'http://localhost:5000/api' : '/api';
  }

  private loadSchedule(): void {
    const apiBase = this.getApiBase();
    this.http
      .get<LineSchedule[]>(`${apiBase}/lineSchedule`, { params: { sort: 'asc' } })
      .subscribe({
        next: (data) => {
          this.schedules = (data ?? []).slice(0, 7);
        },
        error: (err) => {
          console.error('App: Failed to load line schedule', err);
          this.schedules = [];
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

        // Template click handlers (no-op placeholders); implement when backend actions are ready
  moveToBay2(): void {}
  moveToBay3(): void {}
  moveToBay4(): void {}
  moveToBay5(): void {}
  moveToBay6(): void {}
  moveToBay7(): void {}
  moveToBay8(): void {}
  moveToBay9(): void {}
  moveToBay10(): void {}



  }

