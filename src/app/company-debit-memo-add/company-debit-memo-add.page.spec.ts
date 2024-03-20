import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CompanyDebitMemoAddPage } from './company-debit-memo-add.page';

describe('CompanyDebitMemoAddPage', () => {
  let component: CompanyDebitMemoAddPage;
  let fixture: ComponentFixture<CompanyDebitMemoAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyDebitMemoAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
