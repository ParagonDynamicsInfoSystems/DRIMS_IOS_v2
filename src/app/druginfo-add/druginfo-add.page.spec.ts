import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DruginfoAddPage } from './druginfo-add.page';

describe('DruginfoAddPage', () => {
  let component: DruginfoAddPage;
  let fixture: ComponentFixture<DruginfoAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DruginfoAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
