import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Team5 } from './team5';

describe('Team5', () => {
  let component: Team5;
  let fixture: ComponentFixture<Team5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Team5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Team5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
