import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDebitMemoListPage } from './company-debit-memo-list.page';

describe('CompanyDebitMemoListPage', () => {
  let component: CompanyDebitMemoListPage;
  let fixture: ComponentFixture<CompanyDebitMemoListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyDebitMemoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
