import { Injectable } from '@angular/core';
import { fade } from '../animation-presets/fade.animation-preset';
import { slide } from '../animation-presets/slide.animation-preset';
import * as i0 from "@angular/core";
/**
 * Notifier animation service
 */
export class NotifierAnimationService {
    /**
     * Constructor
     */
    constructor() {
        this.animationPresets = {
            fade,
            slide,
        };
    }
    /**
     * Get animation data
     *
     * This method generates all data the Web Animations API needs to animate our notification. The result depends on both the animation
     * direction (either in or out) as well as the notifications (and its attributes) itself.
     *
     * @param   direction    Animation direction, either in or out
     * @param   notification Notification the animation data should be generated for
     * @returns Animation information
     */
    getAnimationData(direction, notification) {
        // Get all necessary animation data
        let keyframes;
        let duration;
        let easing;
        if (direction === 'show') {
            keyframes = this.animationPresets[notification.component.getConfig().animations.show.preset].show(notification);
            duration = notification.component.getConfig().animations.show.speed;
            easing = notification.component.getConfig().animations.show.easing;
        }
        else {
            keyframes = this.animationPresets[notification.component.getConfig().animations.hide.preset].hide(notification);
            duration = notification.component.getConfig().animations.hide.speed;
            easing = notification.component.getConfig().animations.hide.easing;
        }
        // Build and return animation data
        return {
            keyframes: [keyframes.from, keyframes.to],
            options: {
                duration,
                easing,
                fill: 'forwards', // Keep the newly painted state after the animation finished
            },
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierAnimationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierAnimationService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierAnimationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXItYW5pbWF0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLW5vdGlmaWVyL3NyYy9saWIvc2VydmljZXMvbm90aWZpZXItYW5pbWF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbEUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLDZDQUE2QyxDQUFDOztBQUlwRTs7R0FFRztBQUVILE1BQU0sT0FBTyx3QkFBd0I7SUFRbkM7O09BRUc7SUFDSDtRQUNFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRztZQUN0QixJQUFJO1lBQ0osS0FBSztTQUNOLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksZ0JBQWdCLENBQUMsU0FBMEIsRUFBRSxZQUFrQztRQUNwRixtQ0FBbUM7UUFDbkMsSUFBSSxTQUEyQyxDQUFDO1FBQ2hELElBQUksUUFBZ0IsQ0FBQztRQUNyQixJQUFJLE1BQWMsQ0FBQztRQUNuQixJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7WUFDeEIsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hILFFBQVEsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3BFLE1BQU0sR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3BFO2FBQU07WUFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDaEgsUUFBUSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDcEUsTUFBTSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDcEU7UUFFRCxrQ0FBa0M7UUFDbEMsT0FBTztZQUNMLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUN6QyxPQUFPLEVBQUU7Z0JBQ1AsUUFBUTtnQkFDUixNQUFNO2dCQUNOLElBQUksRUFBRSxVQUFVLEVBQUUsNERBQTREO2FBQy9FO1NBQ0YsQ0FBQztJQUNKLENBQUM7OEdBcERVLHdCQUF3QjtrSEFBeEIsd0JBQXdCOzsyRkFBeEIsd0JBQXdCO2tCQURwQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgZmFkZSB9IGZyb20gJy4uL2FuaW1hdGlvbi1wcmVzZXRzL2ZhZGUuYW5pbWF0aW9uLXByZXNldCc7XHJcbmltcG9ydCB7IHNsaWRlIH0gZnJvbSAnLi4vYW5pbWF0aW9uLXByZXNldHMvc2xpZGUuYW5pbWF0aW9uLXByZXNldCc7XHJcbmltcG9ydCB7IE5vdGlmaWVyQW5pbWF0aW9uRGF0YSwgTm90aWZpZXJBbmltYXRpb25QcmVzZXQsIE5vdGlmaWVyQW5pbWF0aW9uUHJlc2V0S2V5ZnJhbWVzIH0gZnJvbSAnLi4vbW9kZWxzL25vdGlmaWVyLWFuaW1hdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IE5vdGlmaWVyTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL25vdGlmaWVyLW5vdGlmaWNhdGlvbi5tb2RlbCc7XHJcblxyXG4vKipcclxuICogTm90aWZpZXIgYW5pbWF0aW9uIHNlcnZpY2VcclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE5vdGlmaWVyQW5pbWF0aW9uU2VydmljZSB7XHJcbiAgLyoqXHJcbiAgICogTGlzdCBvZiBhbmltYXRpb24gcHJlc2V0cyAoY3VycmVudGx5IHN0YXRpYylcclxuICAgKi9cclxuICBwcml2YXRlIHJlYWRvbmx5IGFuaW1hdGlvblByZXNldHM6IHtcclxuICAgIFthbmltYXRpb25QcmVzZXROYW1lOiBzdHJpbmddOiBOb3RpZmllckFuaW1hdGlvblByZXNldDtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuYW5pbWF0aW9uUHJlc2V0cyA9IHtcclxuICAgICAgZmFkZSxcclxuICAgICAgc2xpZGUsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGFuaW1hdGlvbiBkYXRhXHJcbiAgICpcclxuICAgKiBUaGlzIG1ldGhvZCBnZW5lcmF0ZXMgYWxsIGRhdGEgdGhlIFdlYiBBbmltYXRpb25zIEFQSSBuZWVkcyB0byBhbmltYXRlIG91ciBub3RpZmljYXRpb24uIFRoZSByZXN1bHQgZGVwZW5kcyBvbiBib3RoIHRoZSBhbmltYXRpb25cclxuICAgKiBkaXJlY3Rpb24gKGVpdGhlciBpbiBvciBvdXQpIGFzIHdlbGwgYXMgdGhlIG5vdGlmaWNhdGlvbnMgKGFuZCBpdHMgYXR0cmlidXRlcykgaXRzZWxmLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICAgZGlyZWN0aW9uICAgIEFuaW1hdGlvbiBkaXJlY3Rpb24sIGVpdGhlciBpbiBvciBvdXRcclxuICAgKiBAcGFyYW0gICBub3RpZmljYXRpb24gTm90aWZpY2F0aW9uIHRoZSBhbmltYXRpb24gZGF0YSBzaG91bGQgYmUgZ2VuZXJhdGVkIGZvclxyXG4gICAqIEByZXR1cm5zIEFuaW1hdGlvbiBpbmZvcm1hdGlvblxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRBbmltYXRpb25EYXRhKGRpcmVjdGlvbjogJ3Nob3cnIHwgJ2hpZGUnLCBub3RpZmljYXRpb246IE5vdGlmaWVyTm90aWZpY2F0aW9uKTogTm90aWZpZXJBbmltYXRpb25EYXRhIHtcclxuICAgIC8vIEdldCBhbGwgbmVjZXNzYXJ5IGFuaW1hdGlvbiBkYXRhXHJcbiAgICBsZXQga2V5ZnJhbWVzOiBOb3RpZmllckFuaW1hdGlvblByZXNldEtleWZyYW1lcztcclxuICAgIGxldCBkdXJhdGlvbjogbnVtYmVyO1xyXG4gICAgbGV0IGVhc2luZzogc3RyaW5nO1xyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3Nob3cnKSB7XHJcbiAgICAgIGtleWZyYW1lcyA9IHRoaXMuYW5pbWF0aW9uUHJlc2V0c1tub3RpZmljYXRpb24uY29tcG9uZW50LmdldENvbmZpZygpLmFuaW1hdGlvbnMuc2hvdy5wcmVzZXRdLnNob3cobm90aWZpY2F0aW9uKTtcclxuICAgICAgZHVyYXRpb24gPSBub3RpZmljYXRpb24uY29tcG9uZW50LmdldENvbmZpZygpLmFuaW1hdGlvbnMuc2hvdy5zcGVlZDtcclxuICAgICAgZWFzaW5nID0gbm90aWZpY2F0aW9uLmNvbXBvbmVudC5nZXRDb25maWcoKS5hbmltYXRpb25zLnNob3cuZWFzaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAga2V5ZnJhbWVzID0gdGhpcy5hbmltYXRpb25QcmVzZXRzW25vdGlmaWNhdGlvbi5jb21wb25lbnQuZ2V0Q29uZmlnKCkuYW5pbWF0aW9ucy5oaWRlLnByZXNldF0uaGlkZShub3RpZmljYXRpb24pO1xyXG4gICAgICBkdXJhdGlvbiA9IG5vdGlmaWNhdGlvbi5jb21wb25lbnQuZ2V0Q29uZmlnKCkuYW5pbWF0aW9ucy5oaWRlLnNwZWVkO1xyXG4gICAgICBlYXNpbmcgPSBub3RpZmljYXRpb24uY29tcG9uZW50LmdldENvbmZpZygpLmFuaW1hdGlvbnMuaGlkZS5lYXNpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQnVpbGQgYW5kIHJldHVybiBhbmltYXRpb24gZGF0YVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAga2V5ZnJhbWVzOiBba2V5ZnJhbWVzLmZyb20sIGtleWZyYW1lcy50b10sXHJcbiAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICBkdXJhdGlvbixcclxuICAgICAgICBlYXNpbmcsXHJcbiAgICAgICAgZmlsbDogJ2ZvcndhcmRzJywgLy8gS2VlcCB0aGUgbmV3bHkgcGFpbnRlZCBzdGF0ZSBhZnRlciB0aGUgYW5pbWF0aW9uIGZpbmlzaGVkXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=