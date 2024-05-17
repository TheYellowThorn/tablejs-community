import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class OperatingSystemService {
    constructor() { }
    getOS() {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
        const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
        const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
        let os = null;
        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        }
        else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        }
        else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        }
        else if (/Android/.test(userAgent)) {
            os = 'Android';
        }
        else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }
        return os;
    }
    isMac() {
        return this.getOS() === 'Mac OS' || this.getOS() === 'iOS';
    }
    isPC() {
        return this.getOS() === 'Windows';
    }
}
OperatingSystemService.ɵprov = i0.ɵɵdefineInjectable({ factory: function OperatingSystemService_Factory() { return new OperatingSystemService(); }, token: OperatingSystemService, providedIn: "root" });
OperatingSystemService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
OperatingSystemService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0aW5nLXN5c3RlbS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL3NlcnZpY2VzL29wZXJhdGluZy1zeXN0ZW0vb3BlcmF0aW5nLXN5c3RlbS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSzNDLE1BQU0sT0FBTyxzQkFBc0I7SUFFakMsZ0JBQWdCLENBQUM7SUFFakIsS0FBSztRQUNILE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQzdDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQzNDLE1BQU0sY0FBYyxHQUFVLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUUsTUFBTSxnQkFBZ0IsR0FBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sWUFBWSxHQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RCxJQUFJLEVBQUUsR0FBa0IsSUFBSSxDQUFDO1FBRTdCLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUMzQyxFQUFFLEdBQUcsUUFBUSxDQUFDO1NBQ2Y7YUFBTSxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDaEQsRUFBRSxHQUFHLEtBQUssQ0FBQztTQUNaO2FBQU0sSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDcEQsRUFBRSxHQUFHLFNBQVMsQ0FBQztTQUNoQjthQUFNLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNwQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1NBQ2hCO2FBQU0sSUFBSSxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3hDLEVBQUUsR0FBRyxPQUFPLENBQUM7U0FDZDtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELEtBQUs7UUFDSCxPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEtBQUssQ0FBQztJQUM3RCxDQUFDO0lBQ0QsSUFBSTtRQUNGLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLFNBQVMsQ0FBQztJQUNwQyxDQUFDOzs7O1lBbkNGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgT3BlcmF0aW5nU3lzdGVtU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBnZXRPUygpIHtcbiAgICBjb25zdCB1c2VyQWdlbnQgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICBjb25zdCBwbGF0Zm9ybSA9IHdpbmRvdy5uYXZpZ2F0b3IucGxhdGZvcm07XG4gICAgY29uc3QgbWFjb3NQbGF0Zm9ybXM6IGFueVtdID0gWydNYWNpbnRvc2gnLCAnTWFjSW50ZWwnLCAnTWFjUFBDJywgJ01hYzY4SyddO1xuICAgIGNvbnN0IHdpbmRvd3NQbGF0Zm9ybXM6IGFueVtdID0gWydXaW4zMicsICdXaW42NCcsICdXaW5kb3dzJywgJ1dpbkNFJ107XG4gICAgY29uc3QgaW9zUGxhdGZvcm1zOiBhbnlbXSA9IFsnaVBob25lJywgJ2lQYWQnLCAnaVBvZCddO1xuICAgIGxldCBvczogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgICBpZiAobWFjb3NQbGF0Zm9ybXMuaW5kZXhPZihwbGF0Zm9ybSkgIT09IC0xKSB7XG4gICAgICBvcyA9ICdNYWMgT1MnO1xuICAgIH0gZWxzZSBpZiAoaW9zUGxhdGZvcm1zLmluZGV4T2YocGxhdGZvcm0pICE9PSAtMSkge1xuICAgICAgb3MgPSAnaU9TJztcbiAgICB9IGVsc2UgaWYgKHdpbmRvd3NQbGF0Zm9ybXMuaW5kZXhPZihwbGF0Zm9ybSkgIT09IC0xKSB7XG4gICAgICBvcyA9ICdXaW5kb3dzJztcbiAgICB9IGVsc2UgaWYgKC9BbmRyb2lkLy50ZXN0KHVzZXJBZ2VudCkpIHtcbiAgICAgIG9zID0gJ0FuZHJvaWQnO1xuICAgIH0gZWxzZSBpZiAoIW9zICYmIC9MaW51eC8udGVzdChwbGF0Zm9ybSkpIHtcbiAgICAgIG9zID0gJ0xpbnV4JztcbiAgICB9XG5cbiAgICByZXR1cm4gb3M7XG4gIH1cblxuICBpc01hYygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPUygpID09PSAnTWFjIE9TJyB8fCB0aGlzLmdldE9TKCkgPT09ICdpT1MnO1xuICB9XG4gIGlzUEMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0T1MoKSA9PT0gJ1dpbmRvd3MnO1xuICB9XG59XG4iXX0=