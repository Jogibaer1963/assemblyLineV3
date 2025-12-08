import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Team4 } from './team4';

describe('Team4', () => {
  let component: Team4;
  let fixture: ComponentFixture<Team4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Team4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Team4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
