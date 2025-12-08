import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Team3 } from './team3';

describe('Team3', () => {
  let component: Team3;
  let fixture: ComponentFixture<Team3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Team3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Team3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
