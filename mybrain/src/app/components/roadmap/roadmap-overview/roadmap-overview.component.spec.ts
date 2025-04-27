import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapOverviewComponent } from './roadmap-overview.component';

describe('RoadmapOverviewComponent', () => {
  let component: RoadmapOverviewComponent;
  let fixture: ComponentFixture<RoadmapOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadmapOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoadmapOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
