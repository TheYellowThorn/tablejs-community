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
OperatingSystemService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: OperatingSystemService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
OperatingSystemService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: OperatingSystemService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: OperatingSystemService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0aW5nLXN5c3RlbS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL3NlcnZpY2VzL29wZXJhdGluZy1zeXN0ZW0vb3BlcmF0aW5nLXN5c3RlbS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSzNDLE1BQU0sT0FBTyxzQkFBc0I7SUFFakMsZ0JBQWdCLENBQUM7SUFFakIsS0FBSztRQUNILE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQzdDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQzNDLE1BQU0sY0FBYyxHQUFVLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUUsTUFBTSxnQkFBZ0IsR0FBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sWUFBWSxHQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RCxJQUFJLEVBQUUsR0FBa0IsSUFBSSxDQUFDO1FBRTdCLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUMzQyxFQUFFLEdBQUcsUUFBUSxDQUFDO1NBQ2Y7YUFBTSxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDaEQsRUFBRSxHQUFHLEtBQUssQ0FBQztTQUNaO2FBQU0sSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDcEQsRUFBRSxHQUFHLFNBQVMsQ0FBQztTQUNoQjthQUFNLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNwQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1NBQ2hCO2FBQU0sSUFBSSxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3hDLEVBQUUsR0FBRyxPQUFPLENBQUM7U0FDZDtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELEtBQUs7UUFDSCxPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEtBQUssQ0FBQztJQUM3RCxDQUFDO0lBQ0QsSUFBSTtRQUNGLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLFNBQVMsQ0FBQztJQUNwQyxDQUFDOzttSEFoQ1Usc0JBQXNCO3VIQUF0QixzQkFBc0IsY0FGckIsTUFBTTsyRkFFUCxzQkFBc0I7a0JBSGxDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBPcGVyYXRpbmdTeXN0ZW1TZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIGdldE9TKCkge1xuICAgIGNvbnN0IHVzZXJBZ2VudCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIGNvbnN0IHBsYXRmb3JtID0gd2luZG93Lm5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICBjb25zdCBtYWNvc1BsYXRmb3JtczogYW55W10gPSBbJ01hY2ludG9zaCcsICdNYWNJbnRlbCcsICdNYWNQUEMnLCAnTWFjNjhLJ107XG4gICAgY29uc3Qgd2luZG93c1BsYXRmb3JtczogYW55W10gPSBbJ1dpbjMyJywgJ1dpbjY0JywgJ1dpbmRvd3MnLCAnV2luQ0UnXTtcbiAgICBjb25zdCBpb3NQbGF0Zm9ybXM6IGFueVtdID0gWydpUGhvbmUnLCAnaVBhZCcsICdpUG9kJ107XG4gICAgbGV0IG9zOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAgIGlmIChtYWNvc1BsYXRmb3Jtcy5pbmRleE9mKHBsYXRmb3JtKSAhPT0gLTEpIHtcbiAgICAgIG9zID0gJ01hYyBPUyc7XG4gICAgfSBlbHNlIGlmIChpb3NQbGF0Zm9ybXMuaW5kZXhPZihwbGF0Zm9ybSkgIT09IC0xKSB7XG4gICAgICBvcyA9ICdpT1MnO1xuICAgIH0gZWxzZSBpZiAod2luZG93c1BsYXRmb3Jtcy5pbmRleE9mKHBsYXRmb3JtKSAhPT0gLTEpIHtcbiAgICAgIG9zID0gJ1dpbmRvd3MnO1xuICAgIH0gZWxzZSBpZiAoL0FuZHJvaWQvLnRlc3QodXNlckFnZW50KSkge1xuICAgICAgb3MgPSAnQW5kcm9pZCc7XG4gICAgfSBlbHNlIGlmICghb3MgJiYgL0xpbnV4Ly50ZXN0KHBsYXRmb3JtKSkge1xuICAgICAgb3MgPSAnTGludXgnO1xuICAgIH1cblxuICAgIHJldHVybiBvcztcbiAgfVxuXG4gIGlzTWFjKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldE9TKCkgPT09ICdNYWMgT1MnIHx8IHRoaXMuZ2V0T1MoKSA9PT0gJ2lPUyc7XG4gIH1cbiAgaXNQQygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPUygpID09PSAnV2luZG93cyc7XG4gIH1cbn1cbiJdfQ==