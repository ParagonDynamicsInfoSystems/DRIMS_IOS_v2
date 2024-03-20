import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ManufacturerAddPage } from './manufacturer-add.page';

describe('ManufacturerAddPage', () => {
  let component: ManufacturerAddPage;
  let fixture: ComponentFixture<ManufacturerAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManufacturerAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
