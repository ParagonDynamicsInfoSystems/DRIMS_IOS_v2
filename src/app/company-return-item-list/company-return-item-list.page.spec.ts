import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyReturnItemListPage } from './company-return-item-list.page';

describe('CompanyReturnItemListPage', () => {
  let component: CompanyReturnItemListPage;
  let fixture: ComponentFixture<CompanyReturnItemListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyReturnItemListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
