import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Team1 } from './team1';

describe('Team1', () => {
  let component: Team1;
  let fixture: ComponentFixture<Team1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Team1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Team1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
