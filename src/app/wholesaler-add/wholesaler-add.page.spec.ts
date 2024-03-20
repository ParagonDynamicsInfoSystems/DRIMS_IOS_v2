import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WholesalerAddPage } from './wholesaler-add.page';

describe('WholesalerAddPage', () => {
  let component: WholesalerAddPage;
  let fixture: ComponentFixture<WholesalerAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WholesalerAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
