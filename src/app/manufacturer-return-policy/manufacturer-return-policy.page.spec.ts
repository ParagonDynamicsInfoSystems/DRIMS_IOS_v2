import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManufacturerReturnPolicyPage } from './manufacturer-return-policy.page';

describe('ManufacturerReturnPolicyPage', () => {
  let component: ManufacturerReturnPolicyPage;
  let fixture: ComponentFixture<ManufacturerReturnPolicyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManufacturerReturnPolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
