import { TestBed } from '@angular/core/testing';

import { OperatingSystemService } from './operating-system.service';

describe('OperatingSystemService', () => {
  let service: OperatingSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatingSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('getOS()', () => {
    it('shoud be "Mac OS"', () => {
      spyOnProperty(window.navigator, 'platform').and.returnValue('Macintosh');
      expect(service.getOS()).toBe('Mac OS');
    });
    it('shoud be "iOS"', () => {
      spyOnProperty(window.navigator, 'platform').and.returnValue('iPad');
      expect(service.getOS()).toBe('iOS');
    });
    it('shoud be "Windows"', () => {
      spyOnProperty(window.navigator, 'platform').and.returnValue('Win64');
      expect(service.getOS()).toBe('Windows');
    });
    it('shoud be "Android"', () => {
      spyOnProperty<any>(window.navigator, 'platform').and.returnValue(null);
      spyOnProperty(window.navigator, 'userAgent').and.returnValue('Android');
      expect(service.getOS()).toBe('Android');
    });
    it('shoud be "Linux"', () => {
      spyOnProperty(window.navigator, 'platform').and.returnValue('Linux');
      expect(service.getOS()).toBe('Linux');
    });
  });
  describe('isMac()', () => {
    it('should return true', () => {
      spyOnProperty(window.navigator, 'platform').and.returnValue('Macintosh');
      expect(service.isMac()).toBe(true);
    });
    it('should return false', () => {
      spyOnProperty(window.navigator, 'platform').and.returnValue('Win32');
      expect(service.isMac()).toBe(false);
    });
  });
  describe('isPC()', () => {
    it('should return true', () => {
      spyOnProperty(window.navigator, 'platform').and.returnValue('Win32');
      expect(service.isPC()).toBe(true);
    });
    it('should return false', () => {
      spyOnProperty(window.navigator, 'platform').and.returnValue('Macintosh');
      expect(service.isPC()).toBe(false);
    });
  });
});
