import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NotifierTimerService } from '../services/notifier-timer.service';
import * as i0 from "@angular/core";
import * as i1 from "../services/notifier.service";
import * as i2 from "../services/notifier-timer.service";
import * as i3 from "../services/notifier-animation.service";
import * as i4 from "@angular/common";
/**
 * Notifier notification component
 * -------------------------------
 * This component is responsible for actually displaying the notification on screen. In addition, it's able to show and hide this
 * notification, in particular to animate this notification in and out, as well as shift (move) this notification vertically around.
 * Furthermore, the notification component handles all interactions the user has with this notification / component, such as clicks and
 * mouse movements.
 */
export class NotifierNotificationComponent {
    /**
     * Constructor
     *
     * @param elementRef               Reference to the component's element
     * @param renderer                 Angular renderer
     * @param notifierService          Notifier service
     * @param notifierTimerService     Notifier timer service
     * @param notifierAnimationService Notifier animation service
     */
    constructor(elementRef, renderer, notifierService, notifierTimerService, notifierAnimationService) {
        this.config = notifierService.getConfig();
        this.ready = new EventEmitter();
        this.dismiss = new EventEmitter();
        this.customAction = new EventEmitter();
        this.timerService = notifierTimerService;
        this.animationService = notifierAnimationService;
        this.renderer = renderer;
        this.element = elementRef.nativeElement;
        this.elementShift = 0;
    }
    /**
     * Component after view init lifecycle hook, setts up the component and then emits the ready event
     */
    ngAfterViewInit() {
        this.setup();
        this.elementHeight = this.element.offsetHeight;
        this.elementWidth = this.element.offsetWidth;
        this.ready.emit(this);
    }
    /**
     * Get the notifier config
     *
     * @returns Notifier configuration
     */
    getConfig() {
        return this.config;
    }
    /**
     * Get notification element height (in px)
     *
     * @returns Notification element height (in px)
     */
    getHeight() {
        return this.elementHeight;
    }
    /**
     * Get notification element width (in px)
     *
     * @returns Notification element height (in px)
     */
    getWidth() {
        return this.elementWidth;
    }
    /**
     * Get notification shift offset (in px)
     *
     * @returns Notification element shift offset (in px)
     */
    getShift() {
        return this.elementShift;
    }
    /**
     * Show (animate in) this notification
     *
     * @returns Promise, resolved when done
     */
    show() {
        return new Promise((resolve) => {
            // Are animations enabled?
            if (this.config.animations.enabled && this.config.animations.show.speed > 0) {
                // Get animation data
                const animationData = this.animationService.getAnimationData('show', this.notification);
                // Set initial styles (styles before animation), prevents quick flicker when animation starts
                const animatedProperties = Object.keys(animationData.keyframes[0]);
                for (let i = animatedProperties.length - 1; i >= 0; i--) {
                    this.renderer.setStyle(this.element, animatedProperties[i], animationData.keyframes[0][animatedProperties[i]]);
                }
                // Animate notification in
                this.renderer.setStyle(this.element, 'visibility', 'visible');
                const animation = this.element.animate(animationData.keyframes, animationData.options);
                animation.onfinish = () => {
                    this.startAutoHideTimer();
                    resolve(); // Done
                };
            }
            else {
                // Show notification
                this.renderer.setStyle(this.element, 'visibility', 'visible');
                this.startAutoHideTimer();
                resolve(); // Done
            }
        });
    }
    /**
     * Hide (animate out) this notification
     *
     * @returns Promise, resolved when done
     */
    hide() {
        return new Promise((resolve) => {
            this.stopAutoHideTimer();
            // Are animations enabled?
            if (this.config.animations.enabled && this.config.animations.hide.speed > 0) {
                const animationData = this.animationService.getAnimationData('hide', this.notification);
                const animation = this.element.animate(animationData.keyframes, animationData.options);
                animation.onfinish = () => {
                    resolve(); // Done
                };
            }
            else {
                resolve(); // Done
            }
        });
    }
    /**
     * Shift (move) this notification
     *
     * @param   distance         Distance to shift (in px)
     * @param   shiftToMakePlace Flag, defining in which direction to shift
     * @returns Promise, resolved when done
     */
    shift(distance, shiftToMakePlace) {
        return new Promise((resolve) => {
            // Calculate new position (position after the shift)
            let newElementShift;
            if ((this.config.position.vertical.position === 'top' && shiftToMakePlace) ||
                (this.config.position.vertical.position === 'bottom' && !shiftToMakePlace)) {
                newElementShift = this.elementShift + distance + this.config.position.vertical.gap;
            }
            else {
                newElementShift = this.elementShift - distance - this.config.position.vertical.gap;
            }
            const horizontalPosition = this.config.position.horizontal.position === 'middle' ? '-50%' : '0';
            // Are animations enabled?
            if (this.config.animations.enabled && this.config.animations.shift.speed > 0) {
                const animationData = {
                    // TODO: Extract into animation service
                    keyframes: [
                        {
                            transform: `translate3d( ${horizontalPosition}, ${this.elementShift}px, 0 )`,
                        },
                        {
                            transform: `translate3d( ${horizontalPosition}, ${newElementShift}px, 0 )`,
                        },
                    ],
                    options: {
                        duration: this.config.animations.shift.speed,
                        easing: this.config.animations.shift.easing,
                        fill: 'forwards',
                    },
                };
                this.elementShift = newElementShift;
                const animation = this.element.animate(animationData.keyframes, animationData.options);
                animation.onfinish = () => {
                    resolve(); // Done
                };
            }
            else {
                this.renderer.setStyle(this.element, 'transform', `translate3d( ${horizontalPosition}, ${newElementShift}px, 0 )`);
                this.elementShift = newElementShift;
                resolve(); // Done
            }
        });
    }
    /**
     * Handle click on dismiss button
     */
    onClickDismiss() {
        this.dismiss.emit(this.notification.id);
    }
    /**
     * Handle mouseover over notification area
     */
    onNotificationMouseover() {
        if (this.config.behaviour.onMouseover === 'pauseAutoHide') {
            this.pauseAutoHideTimer();
        }
        else if (this.config.behaviour.onMouseover === 'resetAutoHide') {
            this.stopAutoHideTimer();
        }
    }
    /**
     * Handle mouseout from notification area
     */
    onNotificationMouseout() {
        if (this.config.behaviour.onMouseover === 'pauseAutoHide') {
            this.continueAutoHideTimer();
        }
        else if (this.config.behaviour.onMouseover === 'resetAutoHide') {
            this.startAutoHideTimer();
        }
    }
    /**
     * Handle click on notification area
     */
    onNotificationClick() {
        if (this.config.behaviour.onClick === 'hide') {
            this.onClickDismiss();
        }
    }
    /**
     * Handle custom action
     */
    onCustomAction(name, payload) {
        this.customAction.emit({ notificationId: this.notification.id, actionName: name, actionPayload: payload });
    }
    /**
     * Start the auto hide timer (if enabled)
     */
    startAutoHideTimer() {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.start(this.config.behaviour.autoHide).then(() => {
                this.onClickDismiss();
            });
        }
    }
    /**
     * Pause the auto hide timer (if enabled)
     */
    pauseAutoHideTimer() {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.pause();
        }
    }
    /**
     * Continue the auto hide timer (if enabled)
     */
    continueAutoHideTimer() {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.continue();
        }
    }
    /**
     * Stop the auto hide timer (if enabled)
     */
    stopAutoHideTimer() {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.stop();
        }
    }
    /**
     * Initial notification setup
     */
    setup() {
        // Set start position (initially the exact same for every new notification)
        if (this.config.position.horizontal.position === 'left') {
            this.renderer.setStyle(this.element, 'left', `${this.config.position.horizontal.distance}px`);
        }
        else if (this.config.position.horizontal.position === 'right') {
            this.renderer.setStyle(this.element, 'right', `${this.config.position.horizontal.distance}px`);
        }
        else {
            this.renderer.setStyle(this.element, 'left', '50%');
            // Let's get the GPU handle some work as well (#perfmatters)
            this.renderer.setStyle(this.element, 'transform', 'translate3d( -50%, 0, 0 )');
        }
        if (this.config.position.vertical.position === 'top') {
            this.renderer.setStyle(this.element, 'top', `${this.config.position.vertical.distance}px`);
        }
        else {
            this.renderer.setStyle(this.element, 'bottom', `${this.config.position.vertical.distance}px`);
        }
        // Add classes (responsible for visual design)
        this.renderer.addClass(this.element, `notifier__notification--${this.notification.type}`);
        this.renderer.addClass(this.element, `notifier__notification--${this.config.theme}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierNotificationComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.NotifierService }, { token: i2.NotifierTimerService }, { token: i3.NotifierAnimationService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.4", type: NotifierNotificationComponent, selector: "notifier-notification", inputs: { notification: "notification" }, outputs: { ready: "ready", dismiss: "dismiss", customAction: "customAction" }, host: { listeners: { "click": "onNotificationClick()", "mouseout": "onNotificationMouseout()", "mouseover": "onNotificationMouseover()" }, classAttribute: "notifier__notification" }, providers: [
            // We provide the timer to the component's local injector, so that every notification components gets its own
            // instance of the timer service, thus running their timers independently from each other
            NotifierTimerService,
        ], ngImport: i0, template: "<ng-container\r\n  *ngIf=\"notification.template; else predefinedNotification\"\r\n  [ngTemplateOutlet]=\"notification.template\"\r\n    [ngTemplateOutletContext]=\"{ notification: notification, context: this }\"\r\n>\r\n</ng-container>\r\n\r\n<ng-template #predefinedNotification>\r\n  <p class=\"notifier__notification-message\">{{ notification.message }}</p>\r\n  <button\r\n    class=\"notifier__notification-button\"\r\n    type=\"button\"\r\n    title=\"dismiss\"\r\n    *ngIf=\"config.behaviour.showDismissButton\"\r\n    (click)=\"onClickDismiss()\"\r\n  >\r\n    <svg class=\"notifier__notification-button-icon\" viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">\r\n      <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\" />\r\n    </svg>\r\n  </button>\r\n</ng-template>\r\n", dependencies: [{ kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierNotificationComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '(click)': 'onNotificationClick()',
                        '(mouseout)': 'onNotificationMouseout()',
                        '(mouseover)': 'onNotificationMouseover()',
                        class: 'notifier__notification',
                    }, providers: [
                        // We provide the timer to the component's local injector, so that every notification components gets its own
                        // instance of the timer service, thus running their timers independently from each other
                        NotifierTimerService,
                    ], selector: 'notifier-notification', template: "<ng-container\r\n  *ngIf=\"notification.template; else predefinedNotification\"\r\n  [ngTemplateOutlet]=\"notification.template\"\r\n    [ngTemplateOutletContext]=\"{ notification: notification, context: this }\"\r\n>\r\n</ng-container>\r\n\r\n<ng-template #predefinedNotification>\r\n  <p class=\"notifier__notification-message\">{{ notification.message }}</p>\r\n  <button\r\n    class=\"notifier__notification-button\"\r\n    type=\"button\"\r\n    title=\"dismiss\"\r\n    *ngIf=\"config.behaviour.showDismissButton\"\r\n    (click)=\"onClickDismiss()\"\r\n  >\r\n    <svg class=\"notifier__notification-button-icon\" viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">\r\n      <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\" />\r\n    </svg>\r\n  </button>\r\n</ng-template>\r\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.NotifierService }, { type: i2.NotifierTimerService }, { type: i3.NotifierAnimationService }]; }, propDecorators: { notification: [{
                type: Input
            }], ready: [{
                type: Output
            }], dismiss: [{
                type: Output
            }], customAction: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXItbm90aWZpY2F0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItbm90aWZpZXIvc3JjL2xpYi9jb21wb25lbnRzL25vdGlmaWVyLW5vdGlmaWNhdGlvbi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLW5vdGlmaWVyL3NyYy9saWIvY29tcG9uZW50cy9ub3RpZmllci1ub3RpZmljYXRpb24uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFpQix1QkFBdUIsRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFPdEksT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7Ozs7OztBQUUxRTs7Ozs7OztHQU9HO0FBaUJILE1BQU0sT0FBTyw2QkFBNkI7SUFpRXhDOzs7Ozs7OztPQVFHO0lBQ0gsWUFDRSxVQUFzQixFQUN0QixRQUFtQixFQUNuQixlQUFnQyxFQUNoQyxvQkFBMEMsRUFDMUMsd0JBQWtEO1FBRWxELElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxZQUFZLEVBQWlDLENBQUM7UUFDL0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBSWhDLENBQUM7UUFDTCxJQUFJLENBQUMsWUFBWSxHQUFHLG9CQUFvQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyx3QkFBd0IsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FB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Z0JBT0EsT0FBTztzQkFEYixNQUFNO2dCQUlQLFlBQVk7c0JBRFgsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBOb3RpZmllckFuaW1hdGlvbkRhdGEgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItYW5pbWF0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJDb25maWcgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItY29uZmlnLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJOb3RpZmljYXRpb24gfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItbm90aWZpY2F0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbm90aWZpZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE5vdGlmaWVyQW5pbWF0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL25vdGlmaWVyLWFuaW1hdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTm90aWZpZXJUaW1lclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9ub3RpZmllci10aW1lci5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBOb3RpZmllciBub3RpZmljYXRpb24gY29tcG9uZW50XHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogVGhpcyBjb21wb25lbnQgaXMgcmVzcG9uc2libGUgZm9yIGFjdHVhbGx5IGRpc3BsYXlpbmcgdGhlIG5vdGlmaWNhdGlvbiBvbiBzY3JlZW4uIEluIGFkZGl0aW9uLCBpdCdzIGFibGUgdG8gc2hvdyBhbmQgaGlkZSB0aGlzXHJcbiAqIG5vdGlmaWNhdGlvbiwgaW4gcGFydGljdWxhciB0byBhbmltYXRlIHRoaXMgbm90aWZpY2F0aW9uIGluIGFuZCBvdXQsIGFzIHdlbGwgYXMgc2hpZnQgKG1vdmUpIHRoaXMgbm90aWZpY2F0aW9uIHZlcnRpY2FsbHkgYXJvdW5kLlxyXG4gKiBGdXJ0aGVybW9yZSwgdGhlIG5vdGlmaWNhdGlvbiBjb21wb25lbnQgaGFuZGxlcyBhbGwgaW50ZXJhY3Rpb25zIHRoZSB1c2VyIGhhcyB3aXRoIHRoaXMgbm90aWZpY2F0aW9uIC8gY29tcG9uZW50LCBzdWNoIGFzIGNsaWNrcyBhbmRcclxuICogbW91c2UgbW92ZW1lbnRzLlxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIC8vICgjcGVyZm1hdHRlcnMpXHJcbiAgaG9zdDoge1xyXG4gICAgJyhjbGljayknOiAnb25Ob3RpZmljYXRpb25DbGljaygpJyxcclxuICAgICcobW91c2VvdXQpJzogJ29uTm90aWZpY2F0aW9uTW91c2VvdXQoKScsXHJcbiAgICAnKG1vdXNlb3ZlciknOiAnb25Ob3RpZmljYXRpb25Nb3VzZW92ZXIoKScsXHJcbiAgICBjbGFzczogJ25vdGlmaWVyX19ub3RpZmljYXRpb24nLFxyXG4gIH0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICAvLyBXZSBwcm92aWRlIHRoZSB0aW1lciB0byB0aGUgY29tcG9uZW50J3MgbG9jYWwgaW5qZWN0b3IsIHNvIHRoYXQgZXZlcnkgbm90aWZpY2F0aW9uIGNvbXBvbmVudHMgZ2V0cyBpdHMgb3duXHJcbiAgICAvLyBpbnN0YW5jZSBvZiB0aGUgdGltZXIgc2VydmljZSwgdGh1cyBydW5uaW5nIHRoZWlyIHRpbWVycyBpbmRlcGVuZGVudGx5IGZyb20gZWFjaCBvdGhlclxyXG4gICAgTm90aWZpZXJUaW1lclNlcnZpY2UsXHJcbiAgXSxcclxuICBzZWxlY3RvcjogJ25vdGlmaWVyLW5vdGlmaWNhdGlvbicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25vdGlmaWVyLW5vdGlmaWNhdGlvbi5jb21wb25lbnQuaHRtbCcsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb3RpZmllck5vdGlmaWNhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xyXG4gIC8qKlxyXG4gICAqIElucHV0OiBOb3RpZmljYXRpb24gb2JqZWN0LCBjb250YWlucyBhbGwgZGV0YWlscyBuZWNlc3NhcnkgdG8gY29uc3RydWN0IHRoZSBub3RpZmljYXRpb25cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHB1YmxpYyBub3RpZmljYXRpb246IE5vdGlmaWVyTm90aWZpY2F0aW9uO1xyXG5cclxuICAvKipcclxuICAgKiBPdXRwdXQ6IFJlYWR5IGV2ZW50LCBoYW5kbGVzIHRoZSBpbml0aWFsaXphdGlvbiBzdWNjZXNzIGJ5IGVtaXR0aW5nIGEgcmVmZXJlbmNlIHRvIHRoaXMgbm90aWZpY2F0aW9uIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKVxyXG4gIHB1YmxpYyByZWFkeTogRXZlbnRFbWl0dGVyPE5vdGlmaWVyTm90aWZpY2F0aW9uQ29tcG9uZW50PjtcclxuXHJcbiAgLyoqXHJcbiAgICogT3V0cHV0OiBEaXNtaXNzIGV2ZW50LCBoYW5kbGVzIHRoZSBjbGljayBvbiB0aGUgZGlzbWlzcyBidXR0b24gYnkgZW1pdHRpbmcgdGhlIG5vdGlmaWNhdGlvbiBJRCBvZiB0aGlzIG5vdGlmaWNhdGlvbiBjb21wb25lbnRcclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgZGlzbWlzczogRXZlbnRFbWl0dGVyPHN0cmluZz47XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGN1c3RvbUFjdGlvbjogRXZlbnRFbWl0dGVyPHtcclxuICAgIG5vdGlmaWNhdGlvbklkOiBzdHJpbmc7XHJcbiAgICBhY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBhY3Rpb25QYXlsb2FkOiBhbnk7XHJcbiAgfT47XHJcbiAgLyoqXHJcbiAgICogTm90aWZpZXIgY29uZmlndXJhdGlvblxyXG4gICAqL1xyXG4gIHB1YmxpYyByZWFkb25seSBjb25maWc6IE5vdGlmaWVyQ29uZmlnO1xyXG5cclxuICAvKipcclxuICAgKiBOb3RpZmllciB0aW1lciBzZXJ2aWNlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkb25seSB0aW1lclNlcnZpY2U6IE5vdGlmaWVyVGltZXJTZXJ2aWNlO1xyXG5cclxuICAvKipcclxuICAgKiBOb3RpZmllciBhbmltYXRpb24gc2VydmljZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgYW5pbWF0aW9uU2VydmljZTogTm90aWZpZXJBbmltYXRpb25TZXJ2aWNlO1xyXG5cclxuICAvKipcclxuICAgKiBBbmd1bGFyIHJlbmRlcmVyLCB1c2VkIHRvIHByZXNlcnZlIHRoZSBvdmVyYWxsIERPTSBhYnN0cmFjdGlvbiAmIGluZGVwZW5kZW5jZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXI6IFJlbmRlcmVyMjtcclxuXHJcbiAgLyoqXHJcbiAgICogTmF0aXZlIGVsZW1lbnQgcmVmZXJlbmNlLCB1c2VkIGZvciBtYW5pcHVsYXRpbmcgRE9NIHByb3BlcnRpZXNcclxuICAgKi9cclxuICBwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG5cclxuICAvKipcclxuICAgKiBDdXJyZW50IG5vdGlmaWNhdGlvbiBoZWlnaHQsIGNhbGN1bGF0ZWQgYW5kIGNhY2hlZCBoZXJlICgjcGVyZm1hdHRlcnMpXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbGVtZW50SGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIEN1cnJlbnQgbm90aWZpY2F0aW9uIHdpZHRoLCBjYWxjdWxhdGVkIGFuZCBjYWNoZWQgaGVyZSAoI3BlcmZtYXR0ZXJzKVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZWxlbWVudFdpZHRoOiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIEN1cnJlbnQgbm90aWZpY2F0aW9uIHNoaWZ0LCBjYWxjdWxhdGVkIGFuZCBjYWNoZWQgaGVyZSAoI3BlcmZtYXR0ZXJzKVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZWxlbWVudFNoaWZ0OiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnN0cnVjdG9yXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZWxlbWVudFJlZiAgICAgICAgICAgICAgIFJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50J3MgZWxlbWVudFxyXG4gICAqIEBwYXJhbSByZW5kZXJlciAgICAgICAgICAgICAgICAgQW5ndWxhciByZW5kZXJlclxyXG4gICAqIEBwYXJhbSBub3RpZmllclNlcnZpY2UgICAgICAgICAgTm90aWZpZXIgc2VydmljZVxyXG4gICAqIEBwYXJhbSBub3RpZmllclRpbWVyU2VydmljZSAgICAgTm90aWZpZXIgdGltZXIgc2VydmljZVxyXG4gICAqIEBwYXJhbSBub3RpZmllckFuaW1hdGlvblNlcnZpY2UgTm90aWZpZXIgYW5pbWF0aW9uIHNlcnZpY2VcclxuICAgKi9cclxuICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcclxuICAgIG5vdGlmaWVyU2VydmljZTogTm90aWZpZXJTZXJ2aWNlLFxyXG4gICAgbm90aWZpZXJUaW1lclNlcnZpY2U6IE5vdGlmaWVyVGltZXJTZXJ2aWNlLFxyXG4gICAgbm90aWZpZXJBbmltYXRpb25TZXJ2aWNlOiBOb3RpZmllckFuaW1hdGlvblNlcnZpY2UsXHJcbiAgKSB7XHJcbiAgICB0aGlzLmNvbmZpZyA9IG5vdGlmaWVyU2VydmljZS5nZXRDb25maWcoKTtcclxuICAgIHRoaXMucmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPE5vdGlmaWVyTm90aWZpY2F0aW9uQ29tcG9uZW50PigpO1xyXG4gICAgdGhpcy5kaXNtaXNzID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgICB0aGlzLmN1c3RvbUFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8e1xyXG4gICAgICBub3RpZmljYXRpb25JZDogc3RyaW5nO1xyXG4gICAgICBhY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICAgIGFjdGlvblBheWxvYWQ6IGFueTtcclxuICAgIH0+KCk7XHJcbiAgICB0aGlzLnRpbWVyU2VydmljZSA9IG5vdGlmaWVyVGltZXJTZXJ2aWNlO1xyXG4gICAgdGhpcy5hbmltYXRpb25TZXJ2aWNlID0gbm90aWZpZXJBbmltYXRpb25TZXJ2aWNlO1xyXG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xyXG4gICAgdGhpcy5lbGVtZW50U2hpZnQgPSAwO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29tcG9uZW50IGFmdGVyIHZpZXcgaW5pdCBsaWZlY3ljbGUgaG9vaywgc2V0dHMgdXAgdGhlIGNvbXBvbmVudCBhbmQgdGhlbiBlbWl0cyB0aGUgcmVhZHkgZXZlbnRcclxuICAgKi9cclxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5zZXR1cCgpO1xyXG4gICAgdGhpcy5lbGVtZW50SGVpZ2h0ID0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIHRoaXMuZWxlbWVudFdpZHRoID0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgdGhpcy5yZWFkeS5lbWl0KHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBub3RpZmllciBjb25maWdcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIE5vdGlmaWVyIGNvbmZpZ3VyYXRpb25cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0Q29uZmlnKCk6IE5vdGlmaWVyQ29uZmlnIHtcclxuICAgIHJldHVybiB0aGlzLmNvbmZpZztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBub3RpZmljYXRpb24gZWxlbWVudCBoZWlnaHQgKGluIHB4KVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgTm90aWZpY2F0aW9uIGVsZW1lbnQgaGVpZ2h0IChpbiBweClcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0SGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50SGVpZ2h0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IG5vdGlmaWNhdGlvbiBlbGVtZW50IHdpZHRoIChpbiBweClcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIE5vdGlmaWNhdGlvbiBlbGVtZW50IGhlaWdodCAoaW4gcHgpXHJcbiAgICovXHJcbiAgcHVibGljIGdldFdpZHRoKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50V2lkdGg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgbm90aWZpY2F0aW9uIHNoaWZ0IG9mZnNldCAoaW4gcHgpXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBOb3RpZmljYXRpb24gZWxlbWVudCBzaGlmdCBvZmZzZXQgKGluIHB4KVxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRTaGlmdCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFNoaWZ0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2hvdyAoYW5pbWF0ZSBpbikgdGhpcyBub3RpZmljYXRpb25cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UsIHJlc29sdmVkIHdoZW4gZG9uZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBzaG93KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XHJcbiAgICAgIC8vIEFyZSBhbmltYXRpb25zIGVuYWJsZWQ/XHJcbiAgICAgIGlmICh0aGlzLmNvbmZpZy5hbmltYXRpb25zLmVuYWJsZWQgJiYgdGhpcy5jb25maWcuYW5pbWF0aW9ucy5zaG93LnNwZWVkID4gMCkge1xyXG4gICAgICAgIC8vIEdldCBhbmltYXRpb24gZGF0YVxyXG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbkRhdGE6IE5vdGlmaWVyQW5pbWF0aW9uRGF0YSA9IHRoaXMuYW5pbWF0aW9uU2VydmljZS5nZXRBbmltYXRpb25EYXRhKCdzaG93JywgdGhpcy5ub3RpZmljYXRpb24pO1xyXG5cclxuICAgICAgICAvLyBTZXQgaW5pdGlhbCBzdHlsZXMgKHN0eWxlcyBiZWZvcmUgYW5pbWF0aW9uKSwgcHJldmVudHMgcXVpY2sgZmxpY2tlciB3aGVuIGFuaW1hdGlvbiBzdGFydHNcclxuICAgICAgICBjb25zdCBhbmltYXRlZFByb3BlcnRpZXM6IEFycmF5PHN0cmluZz4gPSBPYmplY3Qua2V5cyhhbmltYXRpb25EYXRhLmtleWZyYW1lc1swXSk7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gYW5pbWF0ZWRQcm9wZXJ0aWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudCwgYW5pbWF0ZWRQcm9wZXJ0aWVzW2ldLCBhbmltYXRpb25EYXRhLmtleWZyYW1lc1swXVthbmltYXRlZFByb3BlcnRpZXNbaV1dKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFuaW1hdGUgbm90aWZpY2F0aW9uIGluXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcclxuICAgICAgICBjb25zdCBhbmltYXRpb246IEFuaW1hdGlvbiA9IHRoaXMuZWxlbWVudC5hbmltYXRlKGFuaW1hdGlvbkRhdGEua2V5ZnJhbWVzLCBhbmltYXRpb25EYXRhLm9wdGlvbnMpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5vbmZpbmlzaCA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc3RhcnRBdXRvSGlkZVRpbWVyKCk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7IC8vIERvbmVcclxuICAgICAgICB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIFNob3cgbm90aWZpY2F0aW9uXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcclxuICAgICAgICB0aGlzLnN0YXJ0QXV0b0hpZGVUaW1lcigpO1xyXG4gICAgICAgIHJlc29sdmUoKTsgLy8gRG9uZVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGUgKGFuaW1hdGUgb3V0KSB0aGlzIG5vdGlmaWNhdGlvblxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSwgcmVzb2x2ZWQgd2hlbiBkb25lXHJcbiAgICovXHJcbiAgcHVibGljIGhpZGUoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcclxuICAgICAgdGhpcy5zdG9wQXV0b0hpZGVUaW1lcigpO1xyXG5cclxuICAgICAgLy8gQXJlIGFuaW1hdGlvbnMgZW5hYmxlZD9cclxuICAgICAgaWYgKHRoaXMuY29uZmlnLmFuaW1hdGlvbnMuZW5hYmxlZCAmJiB0aGlzLmNvbmZpZy5hbmltYXRpb25zLmhpZGUuc3BlZWQgPiAwKSB7XHJcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uRGF0YTogTm90aWZpZXJBbmltYXRpb25EYXRhID0gdGhpcy5hbmltYXRpb25TZXJ2aWNlLmdldEFuaW1hdGlvbkRhdGEoJ2hpZGUnLCB0aGlzLm5vdGlmaWNhdGlvbik7XHJcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uOiBBbmltYXRpb24gPSB0aGlzLmVsZW1lbnQuYW5pbWF0ZShhbmltYXRpb25EYXRhLmtleWZyYW1lcywgYW5pbWF0aW9uRGF0YS5vcHRpb25zKTtcclxuICAgICAgICBhbmltYXRpb24ub25maW5pc2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICByZXNvbHZlKCk7IC8vIERvbmVcclxuICAgICAgICB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoKTsgLy8gRG9uZVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNoaWZ0IChtb3ZlKSB0aGlzIG5vdGlmaWNhdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtICAgZGlzdGFuY2UgICAgICAgICBEaXN0YW5jZSB0byBzaGlmdCAoaW4gcHgpXHJcbiAgICogQHBhcmFtICAgc2hpZnRUb01ha2VQbGFjZSBGbGFnLCBkZWZpbmluZyBpbiB3aGljaCBkaXJlY3Rpb24gdG8gc2hpZnRcclxuICAgKiBAcmV0dXJucyBQcm9taXNlLCByZXNvbHZlZCB3aGVuIGRvbmVcclxuICAgKi9cclxuICBwdWJsaWMgc2hpZnQoZGlzdGFuY2U6IG51bWJlciwgc2hpZnRUb01ha2VQbGFjZTogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XHJcbiAgICAgIC8vIENhbGN1bGF0ZSBuZXcgcG9zaXRpb24gKHBvc2l0aW9uIGFmdGVyIHRoZSBzaGlmdClcclxuICAgICAgbGV0IG5ld0VsZW1lbnRTaGlmdDogbnVtYmVyO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgKHRoaXMuY29uZmlnLnBvc2l0aW9uLnZlcnRpY2FsLnBvc2l0aW9uID09PSAndG9wJyAmJiBzaGlmdFRvTWFrZVBsYWNlKSB8fFxyXG4gICAgICAgICh0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5wb3NpdGlvbiA9PT0gJ2JvdHRvbScgJiYgIXNoaWZ0VG9NYWtlUGxhY2UpXHJcbiAgICAgICkge1xyXG4gICAgICAgIG5ld0VsZW1lbnRTaGlmdCA9IHRoaXMuZWxlbWVudFNoaWZ0ICsgZGlzdGFuY2UgKyB0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5nYXA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3RWxlbWVudFNoaWZ0ID0gdGhpcy5lbGVtZW50U2hpZnQgLSBkaXN0YW5jZSAtIHRoaXMuY29uZmlnLnBvc2l0aW9uLnZlcnRpY2FsLmdhcDtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBob3Jpem9udGFsUG9zaXRpb246IHN0cmluZyA9IHRoaXMuY29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwucG9zaXRpb24gPT09ICdtaWRkbGUnID8gJy01MCUnIDogJzAnO1xyXG5cclxuICAgICAgLy8gQXJlIGFuaW1hdGlvbnMgZW5hYmxlZD9cclxuICAgICAgaWYgKHRoaXMuY29uZmlnLmFuaW1hdGlvbnMuZW5hYmxlZCAmJiB0aGlzLmNvbmZpZy5hbmltYXRpb25zLnNoaWZ0LnNwZWVkID4gMCkge1xyXG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbkRhdGE6IE5vdGlmaWVyQW5pbWF0aW9uRGF0YSA9IHtcclxuICAgICAgICAgIC8vIFRPRE86IEV4dHJhY3QgaW50byBhbmltYXRpb24gc2VydmljZVxyXG4gICAgICAgICAga2V5ZnJhbWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUzZCggJHtob3Jpem9udGFsUG9zaXRpb259LCAke3RoaXMuZWxlbWVudFNoaWZ0fXB4LCAwIClgLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoICR7aG9yaXpvbnRhbFBvc2l0aW9ufSwgJHtuZXdFbGVtZW50U2hpZnR9cHgsIDAgKWAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5jb25maWcuYW5pbWF0aW9ucy5zaGlmdC5zcGVlZCxcclxuICAgICAgICAgICAgZWFzaW5nOiB0aGlzLmNvbmZpZy5hbmltYXRpb25zLnNoaWZ0LmVhc2luZyxcclxuICAgICAgICAgICAgZmlsbDogJ2ZvcndhcmRzJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRTaGlmdCA9IG5ld0VsZW1lbnRTaGlmdDtcclxuICAgICAgICBjb25zdCBhbmltYXRpb246IEFuaW1hdGlvbiA9IHRoaXMuZWxlbWVudC5hbmltYXRlKGFuaW1hdGlvbkRhdGEua2V5ZnJhbWVzLCBhbmltYXRpb25EYXRhLm9wdGlvbnMpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5vbmZpbmlzaCA9ICgpID0+IHtcclxuICAgICAgICAgIHJlc29sdmUoKTsgLy8gRG9uZVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlM2QoICR7aG9yaXpvbnRhbFBvc2l0aW9ufSwgJHtuZXdFbGVtZW50U2hpZnR9cHgsIDAgKWApO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudFNoaWZ0ID0gbmV3RWxlbWVudFNoaWZ0O1xyXG4gICAgICAgIHJlc29sdmUoKTsgLy8gRG9uZVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZSBjbGljayBvbiBkaXNtaXNzIGJ1dHRvblxyXG4gICAqL1xyXG4gIHB1YmxpYyBvbkNsaWNrRGlzbWlzcygpOiB2b2lkIHtcclxuICAgIHRoaXMuZGlzbWlzcy5lbWl0KHRoaXMubm90aWZpY2F0aW9uLmlkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZSBtb3VzZW92ZXIgb3ZlciBub3RpZmljYXRpb24gYXJlYVxyXG4gICAqL1xyXG4gIHB1YmxpYyBvbk5vdGlmaWNhdGlvbk1vdXNlb3ZlcigpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5iZWhhdmlvdXIub25Nb3VzZW92ZXIgPT09ICdwYXVzZUF1dG9IaWRlJykge1xyXG4gICAgICB0aGlzLnBhdXNlQXV0b0hpZGVUaW1lcigpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5iZWhhdmlvdXIub25Nb3VzZW92ZXIgPT09ICdyZXNldEF1dG9IaWRlJykge1xyXG4gICAgICB0aGlzLnN0b3BBdXRvSGlkZVRpbWVyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGUgbW91c2VvdXQgZnJvbSBub3RpZmljYXRpb24gYXJlYVxyXG4gICAqL1xyXG4gIHB1YmxpYyBvbk5vdGlmaWNhdGlvbk1vdXNlb3V0KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmJlaGF2aW91ci5vbk1vdXNlb3ZlciA9PT0gJ3BhdXNlQXV0b0hpZGUnKSB7XHJcbiAgICAgIHRoaXMuY29udGludWVBdXRvSGlkZVRpbWVyKCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLmJlaGF2aW91ci5vbk1vdXNlb3ZlciA9PT0gJ3Jlc2V0QXV0b0hpZGUnKSB7XHJcbiAgICAgIHRoaXMuc3RhcnRBdXRvSGlkZVRpbWVyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGUgY2xpY2sgb24gbm90aWZpY2F0aW9uIGFyZWFcclxuICAgKi9cclxuICBwdWJsaWMgb25Ob3RpZmljYXRpb25DbGljaygpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5iZWhhdmlvdXIub25DbGljayA9PT0gJ2hpZGUnKSB7XHJcbiAgICAgIHRoaXMub25DbGlja0Rpc21pc3MoKTtcclxuICAgIH1cclxuICB9XHJcbiAgLyoqXHJcbiAgICogSGFuZGxlIGN1c3RvbSBhY3Rpb25cclxuICAgKi9cclxuICBwdWJsaWMgb25DdXN0b21BY3Rpb24obmFtZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuY3VzdG9tQWN0aW9uLmVtaXQoeyBub3RpZmljYXRpb25JZDogdGhpcy5ub3RpZmljYXRpb24uaWQsIGFjdGlvbk5hbWU6IG5hbWUsIGFjdGlvblBheWxvYWQ6IHBheWxvYWQgfSk7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIFN0YXJ0IHRoZSBhdXRvIGhpZGUgdGltZXIgKGlmIGVuYWJsZWQpXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzdGFydEF1dG9IaWRlVGltZXIoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jb25maWcuYmVoYXZpb3VyLmF1dG9IaWRlICE9PSBmYWxzZSAmJiB0aGlzLmNvbmZpZy5iZWhhdmlvdXIuYXV0b0hpZGUgPiAwKSB7XHJcbiAgICAgIHRoaXMudGltZXJTZXJ2aWNlLnN0YXJ0KHRoaXMuY29uZmlnLmJlaGF2aW91ci5hdXRvSGlkZSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vbkNsaWNrRGlzbWlzcygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhdXNlIHRoZSBhdXRvIGhpZGUgdGltZXIgKGlmIGVuYWJsZWQpXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBwYXVzZUF1dG9IaWRlVGltZXIoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jb25maWcuYmVoYXZpb3VyLmF1dG9IaWRlICE9PSBmYWxzZSAmJiB0aGlzLmNvbmZpZy5iZWhhdmlvdXIuYXV0b0hpZGUgPiAwKSB7XHJcbiAgICAgIHRoaXMudGltZXJTZXJ2aWNlLnBhdXNlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb250aW51ZSB0aGUgYXV0byBoaWRlIHRpbWVyIChpZiBlbmFibGVkKVxyXG4gICAqL1xyXG4gIHByaXZhdGUgY29udGludWVBdXRvSGlkZVRpbWVyKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmJlaGF2aW91ci5hdXRvSGlkZSAhPT0gZmFsc2UgJiYgdGhpcy5jb25maWcuYmVoYXZpb3VyLmF1dG9IaWRlID4gMCkge1xyXG4gICAgICB0aGlzLnRpbWVyU2VydmljZS5jb250aW51ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3RvcCB0aGUgYXV0byBoaWRlIHRpbWVyIChpZiBlbmFibGVkKVxyXG4gICAqL1xyXG4gIHByaXZhdGUgc3RvcEF1dG9IaWRlVGltZXIoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jb25maWcuYmVoYXZpb3VyLmF1dG9IaWRlICE9PSBmYWxzZSAmJiB0aGlzLmNvbmZpZy5iZWhhdmlvdXIuYXV0b0hpZGUgPiAwKSB7XHJcbiAgICAgIHRoaXMudGltZXJTZXJ2aWNlLnN0b3AoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWwgbm90aWZpY2F0aW9uIHNldHVwXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZXR1cCgpOiB2b2lkIHtcclxuICAgIC8vIFNldCBzdGFydCBwb3NpdGlvbiAoaW5pdGlhbGx5IHRoZSBleGFjdCBzYW1lIGZvciBldmVyeSBuZXcgbm90aWZpY2F0aW9uKVxyXG4gICAgaWYgKHRoaXMuY29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwucG9zaXRpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudCwgJ2xlZnQnLCBgJHt0aGlzLmNvbmZpZy5wb3NpdGlvbi5ob3Jpem9udGFsLmRpc3RhbmNlfXB4YCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwucG9zaXRpb24gPT09ICdyaWdodCcpIHtcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsICdyaWdodCcsIGAke3RoaXMuY29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwuZGlzdGFuY2V9cHhgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50LCAnbGVmdCcsICc1MCUnKTtcclxuICAgICAgLy8gTGV0J3MgZ2V0IHRoZSBHUFUgaGFuZGxlIHNvbWUgd29yayBhcyB3ZWxsICgjcGVyZm1hdHRlcnMpXHJcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKCAtNTAlLCAwLCAwICknKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5wb3NpdGlvbiA9PT0gJ3RvcCcpIHtcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsICd0b3AnLCBgJHt0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5kaXN0YW5jZX1weGApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsICdib3R0b20nLCBgJHt0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5kaXN0YW5jZX1weGApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBjbGFzc2VzIChyZXNwb25zaWJsZSBmb3IgdmlzdWFsIGRlc2lnbilcclxuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbGVtZW50LCBgbm90aWZpZXJfX25vdGlmaWNhdGlvbi0tJHt0aGlzLm5vdGlmaWNhdGlvbi50eXBlfWApO1xyXG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnQsIGBub3RpZmllcl9fbm90aWZpY2F0aW9uLS0ke3RoaXMuY29uZmlnLnRoZW1lfWApO1xyXG4gIH1cclxufVxyXG4iLCI8bmctY29udGFpbmVyXHJcbiAgKm5nSWY9XCJub3RpZmljYXRpb24udGVtcGxhdGU7IGVsc2UgcHJlZGVmaW5lZE5vdGlmaWNhdGlvblwiXHJcbiAgW25nVGVtcGxhdGVPdXRsZXRdPVwibm90aWZpY2F0aW9uLnRlbXBsYXRlXCJcclxuICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IG5vdGlmaWNhdGlvbjogbm90aWZpY2F0aW9uLCBjb250ZXh0OiB0aGlzIH1cIlxyXG4+XHJcbjwvbmctY29udGFpbmVyPlxyXG5cclxuPG5nLXRlbXBsYXRlICNwcmVkZWZpbmVkTm90aWZpY2F0aW9uPlxyXG4gIDxwIGNsYXNzPVwibm90aWZpZXJfX25vdGlmaWNhdGlvbi1tZXNzYWdlXCI+e3sgbm90aWZpY2F0aW9uLm1lc3NhZ2UgfX08L3A+XHJcbiAgPGJ1dHRvblxyXG4gICAgY2xhc3M9XCJub3RpZmllcl9fbm90aWZpY2F0aW9uLWJ1dHRvblwiXHJcbiAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgIHRpdGxlPVwiZGlzbWlzc1wiXHJcbiAgICAqbmdJZj1cImNvbmZpZy5iZWhhdmlvdXIuc2hvd0Rpc21pc3NCdXR0b25cIlxyXG4gICAgKGNsaWNrKT1cIm9uQ2xpY2tEaXNtaXNzKClcIlxyXG4gID5cclxuICAgIDxzdmcgY2xhc3M9XCJub3RpZmllcl9fbm90aWZpY2F0aW9uLWJ1dHRvbi1pY29uXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiPlxyXG4gICAgICA8cGF0aCBkPVwiTTE5IDYuNDFMMTcuNTkgNSAxMiAxMC41OSA2LjQxIDUgNSA2LjQxIDEwLjU5IDEyIDUgMTcuNTkgNi40MSAxOSAxMiAxMy40MSAxNy41OSAxOSAxOSAxNy41OSAxMy40MSAxMnpcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgPC9idXR0b24+XHJcbjwvbmctdGVtcGxhdGU+XHJcbiJdfQ==