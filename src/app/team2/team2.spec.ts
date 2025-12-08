import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Team2 } from './team2';

describe('Team2', () => {
  let component: Team2;
  let fixture: ComponentFixture<Team2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Team2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Team2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
