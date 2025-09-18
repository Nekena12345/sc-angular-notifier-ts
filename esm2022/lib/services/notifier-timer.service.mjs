import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Notifier timer service
 *
 * This service acts as a timer, needed due to the still rather limited setTimeout JavaScript API. The timer service can start and stop a
 * timer. Furthermore, it can also pause the timer at any time, and resume later on. The timer API workd promise-based.
 */
export class NotifierTimerService {
    /**
     * Constructor
     */
    constructor() {
        this.now = 0;
        this.remaining = 0;
    }
    /**
     * Start (or resume) the timer
     *
     * @param   duration Timer duration, in ms
     * @returns          Promise, resolved once the timer finishes
     */
    start(duration) {
        return new Promise((resolve) => {
            // For the first run ...
            this.remaining = duration;
            // Setup, then start the timer
            this.finishPromiseResolver = resolve;
            this.continue();
        });
    }
    /**
     * Pause the timer
     */
    pause() {
        clearTimeout(this.timerId);
        this.remaining -= new Date().getTime() - this.now;
    }
    /**
     * Continue the timer
     */
    continue() {
        this.now = new Date().getTime();
        this.timerId = window.setTimeout(() => {
            this.finish();
        }, this.remaining);
    }
    /**
     * Stop the timer
     */
    stop() {
        clearTimeout(this.timerId);
        this.remaining = 0;
    }
    /**
     * Finish up the timeout by resolving the timer promise
     */
    finish() {
        this.finishPromiseResolver();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierTimerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierTimerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierTimerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXItdGltZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItbm90aWZpZXIvc3JjL2xpYi9zZXJ2aWNlcy9ub3RpZmllci10aW1lci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRTNDOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLG9CQUFvQjtJQXFCL0I7O09BRUc7SUFDSDtRQUNFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFFBQWdCO1FBQzNCLE9BQU8sSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFtQixFQUFFLEVBQUU7WUFDL0Msd0JBQXdCO1lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBRTFCLDhCQUE4QjtZQUM5QixJQUFJLENBQUMscUJBQXFCLEdBQUcsT0FBTyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUs7UUFDVixZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDYixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNwQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSSxJQUFJO1FBQ1QsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSyxNQUFNO1FBQ1osSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDL0IsQ0FBQzs4R0E3RVUsb0JBQW9CO2tIQUFwQixvQkFBb0I7OzJGQUFwQixvQkFBb0I7a0JBRGhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG4vKipcclxuICogTm90aWZpZXIgdGltZXIgc2VydmljZVxyXG4gKlxyXG4gKiBUaGlzIHNlcnZpY2UgYWN0cyBhcyBhIHRpbWVyLCBuZWVkZWQgZHVlIHRvIHRoZSBzdGlsbCByYXRoZXIgbGltaXRlZCBzZXRUaW1lb3V0IEphdmFTY3JpcHQgQVBJLiBUaGUgdGltZXIgc2VydmljZSBjYW4gc3RhcnQgYW5kIHN0b3AgYVxyXG4gKiB0aW1lci4gRnVydGhlcm1vcmUsIGl0IGNhbiBhbHNvIHBhdXNlIHRoZSB0aW1lciBhdCBhbnkgdGltZSwgYW5kIHJlc3VtZSBsYXRlciBvbi4gVGhlIHRpbWVyIEFQSSB3b3JrZCBwcm9taXNlLWJhc2VkLlxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTm90aWZpZXJUaW1lclNlcnZpY2Uge1xyXG4gIC8qKlxyXG4gICAqIFRpbWVzdGFtcCAoaW4gbXMpLCBjcmVhdGVkIGluIHRoZSBtb21lbnQgdGhlIHRpbWVyIHN0YXJ0c1xyXG4gICAqL1xyXG4gIHByaXZhdGUgbm93OiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbWFpbmluZyB0aW1lIChpbiBtcylcclxuICAgKi9cclxuICBwcml2YXRlIHJlbWFpbmluZzogbnVtYmVyO1xyXG5cclxuICAvKipcclxuICAgKiBUaW1lb3V0IElELCB1c2VkIGZvciBjbGVhcmluZyB0aGUgdGltZW91dCBsYXRlciBvblxyXG4gICAqL1xyXG4gIHByaXZhdGUgdGltZXJJZDogbnVtYmVyO1xyXG5cclxuICAvKipcclxuICAgKiBQcm9taXNlIHJlc29sdmUgZnVuY3Rpb24sIGV2ZW50dWFsbHkgZ2V0dGluZyBjYWxsZWQgb25jZSB0aGUgdGltZXIgZmluaXNoZXNcclxuICAgKi9cclxuICBwcml2YXRlIGZpbmlzaFByb21pc2VSZXNvbHZlcjogKCkgPT4gdm9pZDtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29uc3RydWN0b3JcclxuICAgKi9cclxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLm5vdyA9IDA7XHJcbiAgICB0aGlzLnJlbWFpbmluZyA9IDA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdGFydCAob3IgcmVzdW1lKSB0aGUgdGltZXJcclxuICAgKlxyXG4gICAqIEBwYXJhbSAgIGR1cmF0aW9uIFRpbWVyIGR1cmF0aW9uLCBpbiBtc1xyXG4gICAqIEByZXR1cm5zICAgICAgICAgIFByb21pc2UsIHJlc29sdmVkIG9uY2UgdGhlIHRpbWVyIGZpbmlzaGVzXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXJ0KGR1cmF0aW9uOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xyXG4gICAgICAvLyBGb3IgdGhlIGZpcnN0IHJ1biAuLi5cclxuICAgICAgdGhpcy5yZW1haW5pbmcgPSBkdXJhdGlvbjtcclxuXHJcbiAgICAgIC8vIFNldHVwLCB0aGVuIHN0YXJ0IHRoZSB0aW1lclxyXG4gICAgICB0aGlzLmZpbmlzaFByb21pc2VSZXNvbHZlciA9IHJlc29sdmU7XHJcbiAgICAgIHRoaXMuY29udGludWUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGF1c2UgdGhlIHRpbWVyXHJcbiAgICovXHJcbiAgcHVibGljIHBhdXNlKCk6IHZvaWQge1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXJJZCk7XHJcbiAgICB0aGlzLnJlbWFpbmluZyAtPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMubm93O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29udGludWUgdGhlIHRpbWVyXHJcbiAgICovXHJcbiAgcHVibGljIGNvbnRpbnVlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIHRoaXMudGltZXJJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5maW5pc2goKTtcclxuICAgIH0sIHRoaXMucmVtYWluaW5nKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0b3AgdGhlIHRpbWVyXHJcbiAgICovXHJcbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XHJcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcklkKTtcclxuICAgIHRoaXMucmVtYWluaW5nID0gMDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbmlzaCB1cCB0aGUgdGltZW91dCBieSByZXNvbHZpbmcgdGhlIHRpbWVyIHByb21pc2VcclxuICAgKi9cclxuICBwcml2YXRlIGZpbmlzaCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZmluaXNoUHJvbWlzZVJlc29sdmVyKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==