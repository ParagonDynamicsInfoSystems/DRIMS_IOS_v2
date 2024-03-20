import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DruginfoListPage } from './druginfo-list.page';

describe('DruginfoListPage', () => {
  let component: DruginfoListPage;
  let fixture: ComponentFixture<DruginfoListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DruginfoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
