import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CompanyReturnItemAddPage } from './company-return-item-add.page';

describe('CompanyReturnItemAddPage', () => {
  let component: CompanyReturnItemAddPage;
  let fixture: ComponentFixture<CompanyReturnItemAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyReturnItemAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
