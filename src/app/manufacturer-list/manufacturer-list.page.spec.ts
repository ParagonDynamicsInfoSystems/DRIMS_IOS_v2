import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManufacturerListPage } from './manufacturer-list.page';

describe('ManufacturerListPage', () => {
  let component: ManufacturerListPage;
  let fixture: ComponentFixture<ManufacturerListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManufacturerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
