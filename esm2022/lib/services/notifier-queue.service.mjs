import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Notifier queue service
 *
 * In general, API calls don't get processed right away. Instead, we have to queue them up in order to prevent simultanious API calls
 * interfering with each other. This, at least in theory, is possible at any time. In particular, animations - which potentially overlap -
 * can cause changes in JS classes as well as affect the DOM. Therefore, the queue service takes all actions, puts them in a queue, and
 * processes them at the right time (which is when the previous action has been processed successfully).
 *
 * Technical sidenote:
 * An action looks pretty similar to the ones within the Flux / Redux pattern.
 */
export class NotifierQueueService {
    /**
     * Constructor
     */
    constructor() {
        this.actionStream = new Subject();
        this.actionQueue = [];
        this.isActionInProgress = false;
    }
    /**
     * Push a new action to the queue, and try to run it
     *
     * @param action Action object
     */
    push(action) {
        this.actionQueue.push(action);
        this.tryToRunNextAction();
    }
    /**
     * Continue with the next action (called when the current action is finished)
     */
    continue() {
        this.isActionInProgress = false;
        this.tryToRunNextAction();
    }
    /**
     * Try to run the next action in the queue; we skip if there already is some action in progress, or if there is no action left
     */
    tryToRunNextAction() {
        if (this.isActionInProgress || this.actionQueue.length === 0) {
            return; // Skip (the queue can now go drink a coffee as it has nothing to do anymore)
        }
        this.isActionInProgress = true;
        this.actionStream.next(this.actionQueue.shift()); // Push next action to the stream, and remove the current action from the queue
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierQueueService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierQueueService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierQueueService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXItcXVldWUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItbm90aWZpZXIvc3JjL2xpYi9zZXJ2aWNlcy9ub3RpZmllci1xdWV1ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFJL0I7Ozs7Ozs7Ozs7R0FVRztBQUVILE1BQU0sT0FBTyxvQkFBb0I7SUFnQi9COztPQUVHO0lBQ0g7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO1FBQ2xELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsTUFBc0I7UUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNiLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDaEMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVEOztPQUVHO0lBQ0ssa0JBQWtCO1FBQ3hCLElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM1RCxPQUFPLENBQUMsNkVBQTZFO1NBQ3RGO1FBQ0QsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQywrRUFBK0U7SUFDbkksQ0FBQzs4R0FwRFUsb0JBQW9CO2tIQUFwQixvQkFBb0I7OzJGQUFwQixvQkFBb0I7a0JBRGhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IE5vdGlmaWVyQWN0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL25vdGlmaWVyLWFjdGlvbi5tb2RlbCc7XHJcblxyXG4vKipcclxuICogTm90aWZpZXIgcXVldWUgc2VydmljZVxyXG4gKlxyXG4gKiBJbiBnZW5lcmFsLCBBUEkgY2FsbHMgZG9uJ3QgZ2V0IHByb2Nlc3NlZCByaWdodCBhd2F5LiBJbnN0ZWFkLCB3ZSBoYXZlIHRvIHF1ZXVlIHRoZW0gdXAgaW4gb3JkZXIgdG8gcHJldmVudCBzaW11bHRhbmlvdXMgQVBJIGNhbGxzXHJcbiAqIGludGVyZmVyaW5nIHdpdGggZWFjaCBvdGhlci4gVGhpcywgYXQgbGVhc3QgaW4gdGhlb3J5LCBpcyBwb3NzaWJsZSBhdCBhbnkgdGltZS4gSW4gcGFydGljdWxhciwgYW5pbWF0aW9ucyAtIHdoaWNoIHBvdGVudGlhbGx5IG92ZXJsYXAgLVxyXG4gKiBjYW4gY2F1c2UgY2hhbmdlcyBpbiBKUyBjbGFzc2VzIGFzIHdlbGwgYXMgYWZmZWN0IHRoZSBET00uIFRoZXJlZm9yZSwgdGhlIHF1ZXVlIHNlcnZpY2UgdGFrZXMgYWxsIGFjdGlvbnMsIHB1dHMgdGhlbSBpbiBhIHF1ZXVlLCBhbmRcclxuICogcHJvY2Vzc2VzIHRoZW0gYXQgdGhlIHJpZ2h0IHRpbWUgKHdoaWNoIGlzIHdoZW4gdGhlIHByZXZpb3VzIGFjdGlvbiBoYXMgYmVlbiBwcm9jZXNzZWQgc3VjY2Vzc2Z1bGx5KS5cclxuICpcclxuICogVGVjaG5pY2FsIHNpZGVub3RlOlxyXG4gKiBBbiBhY3Rpb24gbG9va3MgcHJldHR5IHNpbWlsYXIgdG8gdGhlIG9uZXMgd2l0aGluIHRoZSBGbHV4IC8gUmVkdXggcGF0dGVybi5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE5vdGlmaWVyUXVldWVTZXJ2aWNlIHtcclxuICAvKipcclxuICAgKiBTdHJlYW0gb2YgYWN0aW9ucywgc3Vic2NyaWJhYmxlIGZyb20gb3V0c2lkZVxyXG4gICAqL1xyXG4gIHB1YmxpYyByZWFkb25seSBhY3Rpb25TdHJlYW06IFN1YmplY3Q8Tm90aWZpZXJBY3Rpb24+O1xyXG5cclxuICAvKipcclxuICAgKiBRdWV1ZSBvZiBhY3Rpb25zXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhY3Rpb25RdWV1ZTogQXJyYXk8Tm90aWZpZXJBY3Rpb24+O1xyXG5cclxuICAvKipcclxuICAgKiBGbGFnLCB0cnVlIGlmIHNvbWUgYWN0aW9uIGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgaXNBY3Rpb25JblByb2dyZXNzOiBib29sZWFuO1xyXG5cclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuYWN0aW9uU3RyZWFtID0gbmV3IFN1YmplY3Q8Tm90aWZpZXJBY3Rpb24+KCk7XHJcbiAgICB0aGlzLmFjdGlvblF1ZXVlID0gW107XHJcbiAgICB0aGlzLmlzQWN0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUHVzaCBhIG5ldyBhY3Rpb24gdG8gdGhlIHF1ZXVlLCBhbmQgdHJ5IHRvIHJ1biBpdFxyXG4gICAqXHJcbiAgICogQHBhcmFtIGFjdGlvbiBBY3Rpb24gb2JqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHB1c2goYWN0aW9uOiBOb3RpZmllckFjdGlvbik6IHZvaWQge1xyXG4gICAgdGhpcy5hY3Rpb25RdWV1ZS5wdXNoKGFjdGlvbik7XHJcbiAgICB0aGlzLnRyeVRvUnVuTmV4dEFjdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29udGludWUgd2l0aCB0aGUgbmV4dCBhY3Rpb24gKGNhbGxlZCB3aGVuIHRoZSBjdXJyZW50IGFjdGlvbiBpcyBmaW5pc2hlZClcclxuICAgKi9cclxuICBwdWJsaWMgY29udGludWUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmlzQWN0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xyXG4gICAgdGhpcy50cnlUb1J1bk5leHRBY3Rpb24oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyeSB0byBydW4gdGhlIG5leHQgYWN0aW9uIGluIHRoZSBxdWV1ZTsgd2Ugc2tpcCBpZiB0aGVyZSBhbHJlYWR5IGlzIHNvbWUgYWN0aW9uIGluIHByb2dyZXNzLCBvciBpZiB0aGVyZSBpcyBubyBhY3Rpb24gbGVmdFxyXG4gICAqL1xyXG4gIHByaXZhdGUgdHJ5VG9SdW5OZXh0QWN0aW9uKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaXNBY3Rpb25JblByb2dyZXNzIHx8IHRoaXMuYWN0aW9uUXVldWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjsgLy8gU2tpcCAodGhlIHF1ZXVlIGNhbiBub3cgZ28gZHJpbmsgYSBjb2ZmZWUgYXMgaXQgaGFzIG5vdGhpbmcgdG8gZG8gYW55bW9yZSlcclxuICAgIH1cclxuICAgIHRoaXMuaXNBY3Rpb25JblByb2dyZXNzID0gdHJ1ZTtcclxuICAgIHRoaXMuYWN0aW9uU3RyZWFtLm5leHQodGhpcy5hY3Rpb25RdWV1ZS5zaGlmdCgpKTsgLy8gUHVzaCBuZXh0IGFjdGlvbiB0byB0aGUgc3RyZWFtLCBhbmQgcmVtb3ZlIHRoZSBjdXJyZW50IGFjdGlvbiBmcm9tIHRoZSBxdWV1ZVxyXG4gIH1cclxufVxyXG4iXX0=