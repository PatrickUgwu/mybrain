import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemOverviewComponent } from './item-overview.component';

describe('ItemOverviewComponent', () => {
  let component: ItemOverviewComponent;
  let fixture: ComponentFixture<ItemOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
