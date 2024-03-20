import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CompanyAddPage } from './company-add.page';

describe('CompanyAddPage', () => {
  let component: CompanyAddPage;
  let fixture: ComponentFixture<CompanyAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
