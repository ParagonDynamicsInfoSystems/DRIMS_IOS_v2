import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DruginfoReturnPolicyPage } from './druginfo-return-policy.page';

describe('DruginfoReturnPolicyPage', () => {
  let component: DruginfoReturnPolicyPage;
  let fixture: ComponentFixture<DruginfoReturnPolicyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DruginfoReturnPolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
