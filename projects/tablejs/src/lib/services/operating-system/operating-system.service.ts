import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperatingSystemService {

  constructor() { }

  getOS() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms: any[] = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms: any[] = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms: any[] = ['iPhone', 'iPad', 'iPod'];
    let os: string | null = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }

    return os;
  }

  isMac(): boolean {
    return this.getOS() === 'Mac OS' || this.getOS() === 'iOS';
  }
  isPC(): boolean {
    return this.getOS() === 'Windows';
  }
}
