import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CompanyListPage } from './company-list.page';

describe('CompanyListPage', () => {
  let component: CompanyListPage;
  let fixture: ComponentFixture<CompanyListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
