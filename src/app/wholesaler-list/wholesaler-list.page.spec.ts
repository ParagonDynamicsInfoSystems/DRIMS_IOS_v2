import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WholesalerListPage } from './wholesaler-list.page';

describe('WholesalerListPage', () => {
  let component: WholesalerListPage;
  let fixture: ComponentFixture<WholesalerListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WholesalerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
