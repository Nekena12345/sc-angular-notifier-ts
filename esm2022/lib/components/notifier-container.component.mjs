import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { NotifierNotification } from '../models/notifier-notification.model';
import * as i0 from "@angular/core";
import * as i1 from "../services/notifier-queue.service";
import * as i2 from "../services/notifier.service";
import * as i3 from "@angular/common";
import * as i4 from "./notifier-notification.component";
/**
 * Notifier container component
 * ----------------------------
 * This component acts as a wrapper for all notification components; consequently, it is responsible for creating a new notification
 * component and removing an existing notification component. Being more precicely, it also handles side effects of those actions, such as
 * shifting or even completely removing other notifications as well. Overall, this components handles actions coming from the queue service
 * by subscribing to its action stream.
 *
 * Technical sidenote:
 * This component has to be used somewhere in an application to work; it will not inject and create itself automatically, primarily in order
 * to not break the Angular AoT compilation. Moreover, this component (and also the notification components) set their change detection
 * strategy onPush, which means that we handle change detection manually in order to get the best performance. (#perfmatters)
 */
export class NotifierContainerComponent {
    /**
     * Constructor
     *
     * @param changeDetector       Change detector, used for manually triggering change detection runs
     * @param notifierQueueService Notifier queue service
     * @param notifierService      Notifier service
     */
    constructor(changeDetector, notifierQueueService, notifierService) {
        this.changeDetector = changeDetector;
        this.queueService = notifierQueueService;
        this.config = notifierService.getConfig();
        this.notifications = [];
        this.notificationCustomAction = new EventEmitter();
        // Connects this component up to the action queue, then handle incoming actions
        this.queueServiceSubscription = this.queueService.actionStream.subscribe((action) => {
            this.handleAction(action).then(() => {
                this.queueService.continue();
            });
        });
    }
    /**
     * Component destroyment lifecycle hook, cleans up the observable subsciption
     */
    ngOnDestroy() {
        if (this.queueServiceSubscription) {
            this.queueServiceSubscription.unsubscribe();
        }
    }
    /**
     * Notification identifier, used as the ngFor trackby function
     *
     * @param   index        Index
     * @param   notification Notifier notification
     * @returns Notification ID as the unique identnfier
     */
    identifyNotification(index, notification) {
        return notification.id;
    }
    /**
     * Event handler, handles clicks on notification dismiss buttons
     *
     * @param notificationId ID of the notification to dismiss
     */
    onNotificationDismiss(notificationId) {
        this.queueService.push({
            payload: notificationId,
            type: 'HIDE',
        });
    }
    /**
     * Event handler, handles notification ready events
     *
     * @param notificationComponent Notification component reference
     */
    onNotificationReady(notificationComponent) {
        const currentNotification = this.notifications[this.notifications.length - 1]; // Get the latest notification
        currentNotification.component = notificationComponent; // Save the new omponent reference
        this.continueHandleShowAction(currentNotification); // Continue with handling the show action
    }
    /**
     * Event handler, handles custom actions
     *
     * @param action
     */
    onNotificationCustomAction(action) {
        this.queueService.push({
            payload: action,
            type: 'CUSTOM_ACTION',
        });
    }
    /**
     * Handle incoming actions by mapping action types to methods, and then running them
     *
     * @param   action Action object
     * @returns Promise, resolved when done
     */
    handleAction(action) {
        switch (action.type // TODO: Maybe a map (actionType -> class method) is a cleaner solution here?
        ) {
            case 'SHOW':
                return this.handleShowAction(action);
            case 'HIDE':
                return this.handleHideAction(action);
            case 'HIDE_OLDEST':
                return this.handleHideOldestAction(action);
            case 'HIDE_NEWEST':
                return this.handleHideNewestAction(action);
            case 'HIDE_ALL':
                return this.handleHideAllAction();
            case 'CUSTOM_ACTION':
                return this.handleCustomAction(action);
            default:
                return new Promise((resolve) => {
                    resolve(); // Ignore unknown action types
                });
        }
    }
    /**
     * Show a new notification
     *
     * We simply add the notification to the list, and then wait until its properly initialized / created / rendered.
     *
     * @param   action Action object
     * @returns Promise, resolved when done
     */
    handleShowAction(action) {
        return new Promise((resolve) => {
            this.tempPromiseResolver = resolve; // Save the promise resolve function so that it can be called later on by another method
            this.addNotificationToList(new NotifierNotification(action.payload));
        });
    }
    /**
     * Continue to show a new notification (after the notification components is initialized / created / rendered).
     *
     * If this is the first (and thus only) notification, we can simply show it. Otherwhise, if stacking is disabled (or a low value), we
     * switch out notifications, in particular we hide the existing one, and then show our new one. Yet, if stacking is enabled, we first
     * shift all older notifications, and then show our new notification. In addition, if there are too many notification on the screen,
     * we hide the oldest one first. Furthermore, if configured, animation overlapping is applied.
     *
     * @param notification New notification to show
     */
    continueHandleShowAction(notification) {
        // First (which means only one) notification in the list?
        const numberOfNotifications = this.notifications.length;
        if (numberOfNotifications === 1) {
            notification.component.show().then(this.tempPromiseResolver); // Done
        }
        else {
            const implicitStackingLimit = 2;
            // Stacking enabled? (stacking value below 2 means stacking is disabled)
            if (this.config.behaviour.stacking === false || this.config.behaviour.stacking < implicitStackingLimit) {
                this.notifications[0].component.hide().then(() => {
                    this.removeNotificationFromList(this.notifications[0]);
                    notification.component.show().then(this.tempPromiseResolver); // Done
                });
            }
            else {
                const stepPromises = [];
                // Are there now too many notifications?
                if (numberOfNotifications > this.config.behaviour.stacking) {
                    const oldNotifications = this.notifications.slice(1, numberOfNotifications - 1);
                    // Are animations enabled?
                    if (this.config.animations.enabled) {
                        // Is animation overlap enabled?
                        if (this.config.animations.overlap !== false && this.config.animations.overlap > 0) {
                            stepPromises.push(this.notifications[0].component.hide());
                            setTimeout(() => {
                                stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), true));
                            }, this.config.animations.hide.speed - this.config.animations.overlap);
                            setTimeout(() => {
                                stepPromises.push(notification.component.show());
                            }, this.config.animations.hide.speed + this.config.animations.shift.speed - this.config.animations.overlap);
                        }
                        else {
                            stepPromises.push(new Promise((resolve) => {
                                this.notifications[0].component.hide().then(() => {
                                    this.shiftNotifications(oldNotifications, notification.component.getHeight(), true).then(() => {
                                        notification.component.show().then(resolve);
                                    });
                                });
                            }));
                        }
                    }
                    else {
                        stepPromises.push(this.notifications[0].component.hide());
                        stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), true));
                        stepPromises.push(notification.component.show());
                    }
                }
                else {
                    const oldNotifications = this.notifications.slice(0, numberOfNotifications - 1);
                    // Are animations enabled?
                    if (this.config.animations.enabled) {
                        // Is animation overlap enabled?
                        if (this.config.animations.overlap !== false && this.config.animations.overlap > 0) {
                            stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), true));
                            setTimeout(() => {
                                stepPromises.push(notification.component.show());
                            }, this.config.animations.shift.speed - this.config.animations.overlap);
                        }
                        else {
                            stepPromises.push(new Promise((resolve) => {
                                this.shiftNotifications(oldNotifications, notification.component.getHeight(), true).then(() => {
                                    notification.component.show().then(resolve);
                                });
                            }));
                        }
                    }
                    else {
                        stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), true));
                        stepPromises.push(notification.component.show());
                    }
                }
                Promise.all(stepPromises).then(() => {
                    if (this.config.behaviour.stacking !== false && numberOfNotifications > this.config.behaviour.stacking) {
                        this.removeNotificationFromList(this.notifications[0]);
                    }
                    this.tempPromiseResolver();
                }); // Done
            }
        }
    }
    /**
     * Hide an existing notification
     *
     * Fist, we skip everything if there are no notifications at all, or the given notification does not exist. Then, we hide the given
     * notification. If there exist older notifications, we then shift them around to fill the gap. Once both hiding the given notification
     * and shifting the older notificaitons is done, the given notification gets finally removed (from the DOM).
     *
     * @param   action Action object, payload contains the notification ID
     * @returns Promise, resolved when done
     */
    handleHideAction(action) {
        return new Promise((resolve) => {
            const stepPromises = [];
            // Does the notification exist / are there even any notifications? (let's prevent accidential errors)
            const notification = this.findNotificationById(action.payload);
            if (notification === undefined) {
                resolve();
                return;
            }
            // Get older notifications
            const notificationIndex = this.findNotificationIndexById(action.payload);
            if (notificationIndex === undefined) {
                resolve();
                return;
            }
            const oldNotifications = this.notifications.slice(0, notificationIndex);
            // Do older notifications exist, and thus do we need to shift other notifications as a consequence?
            if (oldNotifications.length > 0) {
                // Are animations enabled?
                if (this.config.animations.enabled && this.config.animations.hide.speed > 0) {
                    // Is animation overlap enabled?
                    if (this.config.animations.overlap !== false && this.config.animations.overlap > 0) {
                        stepPromises.push(notification.component.hide());
                        setTimeout(() => {
                            stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), false));
                        }, this.config.animations.hide.speed - this.config.animations.overlap);
                    }
                    else {
                        notification.component.hide().then(() => {
                            stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), false));
                        });
                    }
                }
                else {
                    stepPromises.push(notification.component.hide());
                    stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), false));
                }
            }
            else {
                stepPromises.push(notification.component.hide());
            }
            // Wait until both hiding and shifting is done, then remove the notification from the list
            Promise.all(stepPromises).then(() => {
                this.removeNotificationFromList(notification);
                resolve(); // Done
            });
        });
    }
    /**
     * Hide the oldest notification (bridge to handleHideAction)
     *
     * @param   action Action object
     * @returns Promise, resolved when done
     */
    handleHideOldestAction(action) {
        // Are there any notifications? (prevent accidential errors)
        if (this.notifications.length === 0) {
            return new Promise((resolve) => {
                resolve();
            }); // Done
        }
        else {
            action.payload = this.notifications[0].id;
            return this.handleHideAction(action);
        }
    }
    /**
     * Hide the newest notification (bridge to handleHideAction)
     *
     * @param   action Action object
     * @returns Promise, resolved when done
     */
    handleHideNewestAction(action) {
        // Are there any notifications? (prevent accidential errors)
        if (this.notifications.length === 0) {
            return new Promise((resolve) => {
                resolve();
            }); // Done
        }
        else {
            action.payload = this.notifications[this.notifications.length - 1].id;
            return this.handleHideAction(action);
        }
    }
    /**
     * Hide all notifications at once
     *
     * @returns Promise, resolved when done
     */
    handleHideAllAction() {
        return new Promise((resolve) => {
            // Are there any notifications? (prevent accidential errors)
            const numberOfNotifications = this.notifications.length;
            if (numberOfNotifications === 0) {
                resolve(); // Done
                return;
            }
            // Are animations enabled?
            if (this.config.animations.enabled &&
                this.config.animations.hide.speed > 0 &&
                this.config.animations.hide.offset !== false &&
                this.config.animations.hide.offset > 0) {
                for (let i = numberOfNotifications - 1; i >= 0; i--) {
                    const animationOffset = this.config.position.vertical.position === 'top' ? numberOfNotifications - 1 : i;
                    setTimeout(() => {
                        this.notifications[i].component.hide().then(() => {
                            // Are we done here, was this the last notification to be hidden?
                            if ((this.config.position.vertical.position === 'top' && i === 0) ||
                                (this.config.position.vertical.position === 'bottom' && i === numberOfNotifications - 1)) {
                                this.removeAllNotificationsFromList();
                                resolve(); // Done
                            }
                        });
                    }, this.config.animations.hide.offset * animationOffset);
                }
            }
            else {
                const stepPromises = [];
                for (let i = numberOfNotifications - 1; i >= 0; i--) {
                    stepPromises.push(this.notifications[i].component.hide());
                }
                Promise.all(stepPromises).then(() => {
                    this.removeAllNotificationsFromList();
                    resolve(); // Done
                });
            }
        });
    }
    handleCustomAction(action) {
        this.notificationCustomAction.emit({ name: action.payload.actionName, payload: action.payload.actionPayload });
        return this.handleHideAction({ type: 'HIDE', payload: action.payload.notificationId });
    }
    /**
     * Shift multiple notifications at once
     *
     * @param   notifications List containing the notifications to be shifted
     * @param   distance      Distance to shift (in px)
     * @param   toMakePlace   Flag, defining in which direciton to shift
     * @returns Promise, resolved when done
     */
    shiftNotifications(notifications, distance, toMakePlace) {
        return new Promise((resolve) => {
            // Are there any notifications to shift?
            if (notifications.length === 0) {
                resolve();
                return;
            }
            const notificationPromises = [];
            for (let i = notifications.length - 1; i >= 0; i--) {
                notificationPromises.push(notifications[i].component.shift(distance, toMakePlace));
            }
            Promise.all(notificationPromises).then(resolve); // Done
        });
    }
    /**
     * Add a new notification to the list of notifications (triggers change detection)
     *
     * @param notification Notification to add to the list of notifications
     */
    addNotificationToList(notification) {
        this.notifications.push(notification);
        this.changeDetector.markForCheck(); // Run change detection because the notification list changed
    }
    /**
     * Remove an existing notification from the list of notifications (triggers change detection)
     *
     * @param notification Notification to be removed from the list of notifications
     */
    removeNotificationFromList(notification) {
        this.notifications = this.notifications.filter((item) => item.component !== notification.component);
        this.changeDetector.markForCheck(); // Run change detection because the notification list changed
    }
    /**
     * Remove all notifications from the list (triggers change detection)
     */
    removeAllNotificationsFromList() {
        this.notifications = [];
        this.changeDetector.markForCheck(); // Run change detection because the notification list changed
    }
    /**
     * Helper: Find a notification in the notification list by a given notification ID
     *
     * @param   notificationId Notification ID, used for finding notification
     * @returns Notification, undefined if not found
     */
    findNotificationById(notificationId) {
        return this.notifications.find((currentNotification) => currentNotification.id === notificationId);
    }
    /**
     * Helper: Find a notification's index by a given notification ID
     *
     * @param   notificationId Notification ID, used for finding a notification's index
     * @returns Notification index, undefined if not found
     */
    findNotificationIndexById(notificationId) {
        const notificationIndex = this.notifications.findIndex((currentNotification) => currentNotification.id === notificationId);
        return notificationIndex !== -1 ? notificationIndex : undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierContainerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.NotifierQueueService }, { token: i2.NotifierService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.4", type: NotifierContainerComponent, selector: "notifier-container", outputs: { notificationCustomAction: "notificationCustomAction" }, host: { classAttribute: "notifier__container" }, ngImport: i0, template: "<ul class=\"notifier__container-list\">\r\n  <li class=\"notifier__container-list-item\" *ngFor=\"let notification of notifications; trackBy: identifyNotification\">\r\n    <notifier-notification [notification]=\"notification\" (ready)=\"onNotificationReady($event)\" (dismiss)=\"onNotificationDismiss($event)\" (customAction)=\"onNotificationCustomAction($event)\">\r\n    </notifier-notification>\r\n  </li>\r\n</ul>\r\n", dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i4.NotifierNotificationComponent, selector: "notifier-notification", inputs: ["notification"], outputs: ["ready", "dismiss", "customAction"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierContainerComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        class: 'notifier__container',
                    }, selector: 'notifier-container', template: "<ul class=\"notifier__container-list\">\r\n  <li class=\"notifier__container-list-item\" *ngFor=\"let notification of notifications; trackBy: identifyNotification\">\r\n    <notifier-notification [notification]=\"notification\" (ready)=\"onNotificationReady($event)\" (dismiss)=\"onNotificationDismiss($event)\" (customAction)=\"onNotificationCustomAction($event)\">\r\n    </notifier-notification>\r\n  </li>\r\n</ul>\r\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.NotifierQueueService }, { type: i2.NotifierService }]; }, propDecorators: { notificationCustomAction: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXItY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItbm90aWZpZXIvc3JjL2xpYi9jb21wb25lbnRzL25vdGlmaWVyLWNvbnRhaW5lci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLW5vdGlmaWVyL3NyYy9saWIvY29tcG9uZW50cy9ub3RpZmllci1jb250YWluZXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFxQixTQUFTLEVBQUUsWUFBWSxFQUFhLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUt2SCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQzs7Ozs7O0FBSzdFOzs7Ozs7Ozs7Ozs7R0FZRztBQVNILE1BQU0sT0FBTywwQkFBMEI7SUFvQ3JDOzs7Ozs7T0FNRztJQUNILFlBQW1CLGNBQWlDLEVBQUUsb0JBQTBDLEVBQUUsZUFBZ0M7UUFDaEksSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxvQkFBb0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN4RCwrRUFBK0U7UUFDL0UsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQXNCLEVBQUUsRUFBRTtZQUNsRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xDLElB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LGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLDZEQUE2RDtJQUNuRyxDQUFDO0lBRUQ7O09BRUc7SUFDSyw4QkFBOEI7UUFDcEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLDZEQUE2RDtJQUNuRyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxvQkFBb0IsQ0FBQyxjQUFzQjtRQUNqRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsbUJBQXlDLEVBQUUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsS0FBSyxjQUFjLENBQUMsQ0FBQztJQUMzSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyx5QkFBeUIsQ0FBQyxjQUFzQjtRQUN0RCxNQUFNLGlCQUFpQixHQUFXLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUM1RCxDQUFDLG1CQUF5QyxFQUFFLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLEtBQUssY0FBYyxDQUN6RixDQUFDO1FBQ0YsT0FBTyxpQkFBaUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNsRSxDQUFDOzhHQXhkVSwwQkFBMEI7a0dBQTFCLDBCQUEwQiw4S0MvQnZDLHdhQU1BOzsyRkR5QmEsMEJBQTBCO2tCQVJ0QyxTQUFTO3NDQUNTLHVCQUF1QixDQUFDLE1BQU0sUUFDekM7d0JBQ0osS0FBSyxFQUFFLHFCQUFxQjtxQkFDN0IsWUFDUyxvQkFBb0I7eUtBYXZCLHdCQUF3QjtzQkFEOUIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgTm90aWZpZXJBY3Rpb24gfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItYWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJDb25maWcgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItY29uZmlnLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJOb3RpZmljYXRpb24gfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItbm90aWZpY2F0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbm90aWZpZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE5vdGlmaWVyUXVldWVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbm90aWZpZXItcXVldWUuc2VydmljZSc7XHJcbmltcG9ydCB7IE5vdGlmaWVyTm90aWZpY2F0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9ub3RpZmllci1ub3RpZmljYXRpb24uY29tcG9uZW50JztcclxuXHJcbi8qKlxyXG4gKiBOb3RpZmllciBjb250YWluZXIgY29tcG9uZW50XHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogVGhpcyBjb21wb25lbnQgYWN0cyBhcyBhIHdyYXBwZXIgZm9yIGFsbCBub3RpZmljYXRpb24gY29tcG9uZW50czsgY29uc2VxdWVudGx5LCBpdCBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgYSBuZXcgbm90aWZpY2F0aW9uXHJcbiAqIGNvbXBvbmVudCBhbmQgcmVtb3ZpbmcgYW4gZXhpc3Rpbmcgbm90aWZpY2F0aW9uIGNvbXBvbmVudC4gQmVpbmcgbW9yZSBwcmVjaWNlbHksIGl0IGFsc28gaGFuZGxlcyBzaWRlIGVmZmVjdHMgb2YgdGhvc2UgYWN0aW9ucywgc3VjaCBhc1xyXG4gKiBzaGlmdGluZyBvciBldmVuIGNvbXBsZXRlbHkgcmVtb3Zpbmcgb3RoZXIgbm90aWZpY2F0aW9ucyBhcyB3ZWxsLiBPdmVyYWxsLCB0aGlzIGNvbXBvbmVudHMgaGFuZGxlcyBhY3Rpb25zIGNvbWluZyBmcm9tIHRoZSBxdWV1ZSBzZXJ2aWNlXHJcbiAqIGJ5IHN1YnNjcmliaW5nIHRvIGl0cyBhY3Rpb24gc3RyZWFtLlxyXG4gKlxyXG4gKiBUZWNobmljYWwgc2lkZW5vdGU6XHJcbiAqIFRoaXMgY29tcG9uZW50IGhhcyB0byBiZSB1c2VkIHNvbWV3aGVyZSBpbiBhbiBhcHBsaWNhdGlvbiB0byB3b3JrOyBpdCB3aWxsIG5vdCBpbmplY3QgYW5kIGNyZWF0ZSBpdHNlbGYgYXV0b21hdGljYWxseSwgcHJpbWFyaWx5IGluIG9yZGVyXHJcbiAqIHRvIG5vdCBicmVhayB0aGUgQW5ndWxhciBBb1QgY29tcGlsYXRpb24uIE1vcmVvdmVyLCB0aGlzIGNvbXBvbmVudCAoYW5kIGFsc28gdGhlIG5vdGlmaWNhdGlvbiBjb21wb25lbnRzKSBzZXQgdGhlaXIgY2hhbmdlIGRldGVjdGlvblxyXG4gKiBzdHJhdGVneSBvblB1c2gsIHdoaWNoIG1lYW5zIHRoYXQgd2UgaGFuZGxlIGNoYW5nZSBkZXRlY3Rpb24gbWFudWFsbHkgaW4gb3JkZXIgdG8gZ2V0IHRoZSBiZXN0IHBlcmZvcm1hbmNlLiAoI3BlcmZtYXR0ZXJzKVxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsIC8vICgjcGVyZm1hdHRlcnMpXHJcbiAgaG9zdDoge1xyXG4gICAgY2xhc3M6ICdub3RpZmllcl9fY29udGFpbmVyJyxcclxuICB9LFxyXG4gIHNlbGVjdG9yOiAnbm90aWZpZXItY29udGFpbmVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbm90aWZpZXItY29udGFpbmVyLmNvbXBvbmVudC5odG1sJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIE5vdGlmaWVyQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcclxuICAvKipcclxuICAgKiBMaXN0IG9mIGN1cnJlbnRseSBzb21ld2hhdCBhY3RpdmUgbm90aWZpY2F0aW9uc1xyXG4gICAqL1xyXG4gIHB1YmxpYyBub3RpZmljYXRpb25zOiBBcnJheTxOb3RpZmllck5vdGlmaWNhdGlvbj47XHJcbiAgLyoqXHJcbiAgICogY3VzdG9tIGFjdGlvbiBldmVudCBlbW1pdHRlclxyXG4gICAqIG5vdGlmaWNhdGlvbiBjdXN0b20gYWN0aW9uIGV2ZW50IGVtbWl0dGVyXHJcbiAgICovXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIG5vdGlmaWNhdGlvbkN1c3RvbUFjdGlvbjogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgLyoqXHJcbiAgICogQ2hhbmdlIGRldGVjdG9yXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkb25seSBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWY7XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vdGlmaWVyIHF1ZXVlIHNlcnZpY2VcclxuICAgKi9cclxuICBwcml2YXRlIHJlYWRvbmx5IHF1ZXVlU2VydmljZTogTm90aWZpZXJRdWV1ZVNlcnZpY2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vdGlmaWVyIGNvbmZpZ3VyYXRpb25cclxuICAgKi9cclxuICBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZzogTm90aWZpZXJDb25maWc7XHJcblxyXG4gIC8qKlxyXG4gICAqIFF1ZXVlIHNlcnZpY2Ugb2JzZXJ2YWJsZSBzdWJzY3JpcHRpb24gKHNhdmVkIGZvciBjbGVhbnVwKVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcXVldWVTZXJ2aWNlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcblxyXG4gIC8qKlxyXG4gICAqIFByb21pc2UgcmVzb2x2ZSBmdW5jdGlvbiByZWZlcmVuY2UsIHRlbXBvcmFyaWx5IHVzZWQgd2hpbGUgdGhlIG5vdGlmaWNhdGlvbiBjaGlsZCBjb21wb25lbnQgZ2V0cyBjcmVhdGVkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSB0ZW1wUHJvbWlzZVJlc29sdmVyOiAoKSA9PiB2b2lkO1xyXG5cclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNoYW5nZURldGVjdG9yICAgICAgIENoYW5nZSBkZXRlY3RvciwgdXNlZCBmb3IgbWFudWFsbHkgdHJpZ2dlcmluZyBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bnNcclxuICAgKiBAcGFyYW0gbm90aWZpZXJRdWV1ZVNlcnZpY2UgTm90aWZpZXIgcXVldWUgc2VydmljZVxyXG4gICAqIEBwYXJhbSBub3RpZmllclNlcnZpY2UgICAgICBOb3RpZmllciBzZXJ2aWNlXHJcbiAgICovXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZiwgbm90aWZpZXJRdWV1ZVNlcnZpY2U6IE5vdGlmaWVyUXVldWVTZXJ2aWNlLCBub3RpZmllclNlcnZpY2U6IE5vdGlmaWVyU2VydmljZSkge1xyXG4gICAgdGhpcy5jaGFuZ2VEZXRlY3RvciA9IGNoYW5nZURldGVjdG9yO1xyXG4gICAgdGhpcy5xdWV1ZVNlcnZpY2UgPSBub3RpZmllclF1ZXVlU2VydmljZTtcclxuICAgIHRoaXMuY29uZmlnID0gbm90aWZpZXJTZXJ2aWNlLmdldENvbmZpZygpO1xyXG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gW107XHJcbiAgICB0aGlzLm5vdGlmaWNhdGlvbkN1c3RvbUFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gICAgLy8gQ29ubmVjdHMgdGhpcyBjb21wb25lbnQgdXAgdG8gdGhlIGFjdGlvbiBxdWV1ZSwgdGhlbiBoYW5kbGUgaW5jb21pbmcgYWN0aW9uc1xyXG4gICAgdGhpcy5xdWV1ZVNlcnZpY2VTdWJzY3JpcHRpb24gPSB0aGlzLnF1ZXVlU2VydmljZS5hY3Rpb25TdHJlYW0uc3Vic2NyaWJlKChhY3Rpb246IE5vdGlmaWVyQWN0aW9uKSA9PiB7XHJcbiAgICAgIHRoaXMuaGFuZGxlQWN0aW9uKGFjdGlvbikudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5xdWV1ZVNlcnZpY2UuY29udGludWUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbXBvbmVudCBkZXN0cm95bWVudCBsaWZlY3ljbGUgaG9vaywgY2xlYW5zIHVwIHRoZSBvYnNlcnZhYmxlIHN1YnNjaXB0aW9uXHJcbiAgICovXHJcbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucXVldWVTZXJ2aWNlU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMucXVldWVTZXJ2aWNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBOb3RpZmljYXRpb24gaWRlbnRpZmllciwgdXNlZCBhcyB0aGUgbmdGb3IgdHJhY2tieSBmdW5jdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtICAgaW5kZXggICAgICAgIEluZGV4XHJcbiAgICogQHBhcmFtICAgbm90aWZpY2F0aW9uIE5vdGlmaWVyIG5vdGlmaWNhdGlvblxyXG4gICAqIEByZXR1cm5zIE5vdGlmaWNhdGlvbiBJRCBhcyB0aGUgdW5pcXVlIGlkZW50bmZpZXJcclxuICAgKi9cclxuICBwdWJsaWMgaWRlbnRpZnlOb3RpZmljYXRpb24oaW5kZXg6IG51bWJlciwgbm90aWZpY2F0aW9uOiBOb3RpZmllck5vdGlmaWNhdGlvbik6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbm90aWZpY2F0aW9uLmlkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXZlbnQgaGFuZGxlciwgaGFuZGxlcyBjbGlja3Mgb24gbm90aWZpY2F0aW9uIGRpc21pc3MgYnV0dG9uc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIG5vdGlmaWNhdGlvbklkIElEIG9mIHRoZSBub3RpZmljYXRpb24gdG8gZGlzbWlzc1xyXG4gICAqL1xyXG4gIHB1YmxpYyBvbk5vdGlmaWNhdGlvbkRpc21pc3Mobm90aWZpY2F0aW9uSWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5xdWV1ZVNlcnZpY2UucHVzaCh7XHJcbiAgICAgIHBheWxvYWQ6IG5vdGlmaWNhdGlvbklkLFxyXG4gICAgICB0eXBlOiAnSElERScsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV2ZW50IGhhbmRsZXIsIGhhbmRsZXMgbm90aWZpY2F0aW9uIHJlYWR5IGV2ZW50c1xyXG4gICAqXHJcbiAgICogQHBhcmFtIG5vdGlmaWNhdGlvbkNvbXBvbmVudCBOb3RpZmljYXRpb24gY29tcG9uZW50IHJlZmVyZW5jZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBvbk5vdGlmaWNhdGlvblJlYWR5KG5vdGlmaWNhdGlvbkNvbXBvbmVudDogTm90aWZpZXJOb3RpZmljYXRpb25Db21wb25lbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGN1cnJlbnROb3RpZmljYXRpb246IE5vdGlmaWVyTm90aWZpY2F0aW9uID0gdGhpcy5ub3RpZmljYXRpb25zW3RoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggLSAxXTsgLy8gR2V0IHRoZSBsYXRlc3Qgbm90aWZpY2F0aW9uXHJcbiAgICBjdXJyZW50Tm90aWZpY2F0aW9uLmNvbXBvbmVudCA9IG5vdGlmaWNhdGlvbkNvbXBvbmVudDsgLy8gU2F2ZSB0aGUgbmV3IG9tcG9uZW50IHJlZmVyZW5jZVxyXG4gICAgdGhpcy5jb250aW51ZUhhbmRsZVNob3dBY3Rpb24oY3VycmVudE5vdGlmaWNhdGlvbik7IC8vIENvbnRpbnVlIHdpdGggaGFuZGxpbmcgdGhlIHNob3cgYWN0aW9uXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFdmVudCBoYW5kbGVyLCBoYW5kbGVzIGN1c3RvbSBhY3Rpb25zXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWN0aW9uXHJcbiAgICovXHJcbiAgb25Ob3RpZmljYXRpb25DdXN0b21BY3Rpb24oYWN0aW9uOiB7IG5vdGlmaWNhdGlvbklkOiBzdHJpbmc7IGFjdGlvbk5hbWU6IHN0cmluZzsgYWN0aW9uUGF5bG9hZDogYW55IH0pIHtcclxuICAgIHRoaXMucXVldWVTZXJ2aWNlLnB1c2goe1xyXG4gICAgICBwYXlsb2FkOiBhY3Rpb24sXHJcbiAgICAgIHR5cGU6ICdDVVNUT01fQUNUSU9OJyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlIGluY29taW5nIGFjdGlvbnMgYnkgbWFwcGluZyBhY3Rpb24gdHlwZXMgdG8gbWV0aG9kcywgYW5kIHRoZW4gcnVubmluZyB0aGVtXHJcbiAgICpcclxuICAgKiBAcGFyYW0gICBhY3Rpb24gQWN0aW9uIG9iamVjdFxyXG4gICAqIEByZXR1cm5zIFByb21pc2UsIHJlc29sdmVkIHdoZW4gZG9uZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgaGFuZGxlQWN0aW9uKGFjdGlvbjogTm90aWZpZXJBY3Rpb24pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHN3aXRjaCAoXHJcbiAgICAgIGFjdGlvbi50eXBlIC8vIFRPRE86IE1heWJlIGEgbWFwIChhY3Rpb25UeXBlIC0+IGNsYXNzIG1ldGhvZCkgaXMgYSBjbGVhbmVyIHNvbHV0aW9uIGhlcmU/XHJcbiAgICApIHtcclxuICAgICAgY2FzZSAnU0hPVyc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2hvd0FjdGlvbihhY3Rpb24pO1xyXG4gICAgICBjYXNlICdISURFJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVIaWRlQWN0aW9uKGFjdGlvbik7XHJcbiAgICAgIGNhc2UgJ0hJREVfT0xERVNUJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVIaWRlT2xkZXN0QWN0aW9uKGFjdGlvbik7XHJcbiAgICAgIGNhc2UgJ0hJREVfTkVXRVNUJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVIaWRlTmV3ZXN0QWN0aW9uKGFjdGlvbik7XHJcblxyXG4gICAgICBjYXNlICdISURFX0FMTCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlSGlkZUFsbEFjdGlvbigpO1xyXG4gICAgICBjYXNlICdDVVNUT01fQUNUSU9OJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDdXN0b21BY3Rpb24oYWN0aW9uKTtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcclxuICAgICAgICAgIHJlc29sdmUoKTsgLy8gSWdub3JlIHVua25vd24gYWN0aW9uIHR5cGVzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaG93IGEgbmV3IG5vdGlmaWNhdGlvblxyXG4gICAqXHJcbiAgICogV2Ugc2ltcGx5IGFkZCB0aGUgbm90aWZpY2F0aW9uIHRvIHRoZSBsaXN0LCBhbmQgdGhlbiB3YWl0IHVudGlsIGl0cyBwcm9wZXJseSBpbml0aWFsaXplZCAvIGNyZWF0ZWQgLyByZW5kZXJlZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAgIGFjdGlvbiBBY3Rpb24gb2JqZWN0XHJcbiAgICogQHJldHVybnMgUHJvbWlzZSwgcmVzb2x2ZWQgd2hlbiBkb25lXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBoYW5kbGVTaG93QWN0aW9uKGFjdGlvbjogTm90aWZpZXJBY3Rpb24pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZTogKCkgPT4gdm9pZCkgPT4ge1xyXG4gICAgICB0aGlzLnRlbXBQcm9taXNlUmVzb2x2ZXIgPSByZXNvbHZlOyAvLyBTYXZlIHRoZSBwcm9taXNlIHJlc29sdmUgZnVuY3Rpb24gc28gdGhhdCBpdCBjYW4gYmUgY2FsbGVkIGxhdGVyIG9uIGJ5IGFub3RoZXIgbWV0aG9kXHJcbiAgICAgIHRoaXMuYWRkTm90aWZpY2F0aW9uVG9MaXN0KG5ldyBOb3RpZmllck5vdGlmaWNhdGlvbihhY3Rpb24ucGF5bG9hZCkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb250aW51ZSB0byBzaG93IGEgbmV3IG5vdGlmaWNhdGlvbiAoYWZ0ZXIgdGhlIG5vdGlmaWNhdGlvbiBjb21wb25lbnRzIGlzIGluaXRpYWxpemVkIC8gY3JlYXRlZCAvIHJlbmRlcmVkKS5cclxuICAgKlxyXG4gICAqIElmIHRoaXMgaXMgdGhlIGZpcnN0IChhbmQgdGh1cyBvbmx5KSBub3RpZmljYXRpb24sIHdlIGNhbiBzaW1wbHkgc2hvdyBpdC4gT3RoZXJ3aGlzZSwgaWYgc3RhY2tpbmcgaXMgZGlzYWJsZWQgKG9yIGEgbG93IHZhbHVlKSwgd2VcclxuICAgKiBzd2l0Y2ggb3V0IG5vdGlmaWNhdGlvbnMsIGluIHBhcnRpY3VsYXIgd2UgaGlkZSB0aGUgZXhpc3Rpbmcgb25lLCBhbmQgdGhlbiBzaG93IG91ciBuZXcgb25lLiBZZXQsIGlmIHN0YWNraW5nIGlzIGVuYWJsZWQsIHdlIGZpcnN0XHJcbiAgICogc2hpZnQgYWxsIG9sZGVyIG5vdGlmaWNhdGlvbnMsIGFuZCB0aGVuIHNob3cgb3VyIG5ldyBub3RpZmljYXRpb24uIEluIGFkZGl0aW9uLCBpZiB0aGVyZSBhcmUgdG9vIG1hbnkgbm90aWZpY2F0aW9uIG9uIHRoZSBzY3JlZW4sXHJcbiAgICogd2UgaGlkZSB0aGUgb2xkZXN0IG9uZSBmaXJzdC4gRnVydGhlcm1vcmUsIGlmIGNvbmZpZ3VyZWQsIGFuaW1hdGlvbiBvdmVybGFwcGluZyBpcyBhcHBsaWVkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5vdGlmaWNhdGlvbiBOZXcgbm90aWZpY2F0aW9uIHRvIHNob3dcclxuICAgKi9cclxuICBwcml2YXRlIGNvbnRpbnVlSGFuZGxlU2hvd0FjdGlvbihub3RpZmljYXRpb246IE5vdGlmaWVyTm90aWZpY2F0aW9uKTogdm9pZCB7XHJcbiAgICAvLyBGaXJzdCAod2hpY2ggbWVhbnMgb25seSBvbmUpIG5vdGlmaWNhdGlvbiBpbiB0aGUgbGlzdD9cclxuICAgIGNvbnN0IG51bWJlck9mTm90aWZpY2F0aW9uczogbnVtYmVyID0gdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aDtcclxuICAgIGlmIChudW1iZXJPZk5vdGlmaWNhdGlvbnMgPT09IDEpIHtcclxuICAgICAgbm90aWZpY2F0aW9uLmNvbXBvbmVudC5zaG93KCkudGhlbih0aGlzLnRlbXBQcm9taXNlUmVzb2x2ZXIpOyAvLyBEb25lXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBpbXBsaWNpdFN0YWNraW5nTGltaXQgPSAyO1xyXG5cclxuICAgICAgLy8gU3RhY2tpbmcgZW5hYmxlZD8gKHN0YWNraW5nIHZhbHVlIGJlbG93IDIgbWVhbnMgc3RhY2tpbmcgaXMgZGlzYWJsZWQpXHJcbiAgICAgIGlmICh0aGlzLmNvbmZpZy5iZWhhdmlvdXIuc3RhY2tpbmcgPT09IGZhbHNlIHx8IHRoaXMuY29uZmlnLmJlaGF2aW91ci5zdGFja2luZyA8IGltcGxpY2l0U3RhY2tpbmdMaW1pdCkge1xyXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uc1swXS5jb21wb25lbnQuaGlkZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZW1vdmVOb3RpZmljYXRpb25Gcm9tTGlzdCh0aGlzLm5vdGlmaWNhdGlvbnNbMF0pO1xyXG4gICAgICAgICAgbm90aWZpY2F0aW9uLmNvbXBvbmVudC5zaG93KCkudGhlbih0aGlzLnRlbXBQcm9taXNlUmVzb2x2ZXIpOyAvLyBEb25lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgc3RlcFByb21pc2VzOiBBcnJheTxQcm9taXNlPHZvaWQ+PiA9IFtdO1xyXG5cclxuICAgICAgICAvLyBBcmUgdGhlcmUgbm93IHRvbyBtYW55IG5vdGlmaWNhdGlvbnM/XHJcbiAgICAgICAgaWYgKG51bWJlck9mTm90aWZpY2F0aW9ucyA+IHRoaXMuY29uZmlnLmJlaGF2aW91ci5zdGFja2luZykge1xyXG4gICAgICAgICAgY29uc3Qgb2xkTm90aWZpY2F0aW9uczogQXJyYXk8Tm90aWZpZXJOb3RpZmljYXRpb24+ID0gdGhpcy5ub3RpZmljYXRpb25zLnNsaWNlKDEsIG51bWJlck9mTm90aWZpY2F0aW9ucyAtIDEpO1xyXG5cclxuICAgICAgICAgIC8vIEFyZSBhbmltYXRpb25zIGVuYWJsZWQ/XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuYW5pbWF0aW9ucy5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgIC8vIElzIGFuaW1hdGlvbiBvdmVybGFwIGVuYWJsZWQ/XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5hbmltYXRpb25zLm92ZXJsYXAgIT09IGZhbHNlICYmIHRoaXMuY29uZmlnLmFuaW1hdGlvbnMub3ZlcmxhcCA+IDApIHtcclxuICAgICAgICAgICAgICBzdGVwUHJvbWlzZXMucHVzaCh0aGlzLm5vdGlmaWNhdGlvbnNbMF0uY29tcG9uZW50LmhpZGUoKSk7XHJcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdGVwUHJvbWlzZXMucHVzaCh0aGlzLnNoaWZ0Tm90aWZpY2F0aW9ucyhvbGROb3RpZmljYXRpb25zLCBub3RpZmljYXRpb24uY29tcG9uZW50LmdldEhlaWdodCgpLCB0cnVlKSk7XHJcbiAgICAgICAgICAgICAgfSwgdGhpcy5jb25maWcuYW5pbWF0aW9ucy5oaWRlLnNwZWVkIC0gdGhpcy5jb25maWcuYW5pbWF0aW9ucy5vdmVybGFwKTtcclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHN0ZXBQcm9taXNlcy5wdXNoKG5vdGlmaWNhdGlvbi5jb21wb25lbnQuc2hvdygpKTtcclxuICAgICAgICAgICAgICB9LCB0aGlzLmNvbmZpZy5hbmltYXRpb25zLmhpZGUuc3BlZWQgKyB0aGlzLmNvbmZpZy5hbmltYXRpb25zLnNoaWZ0LnNwZWVkIC0gdGhpcy5jb25maWcuYW5pbWF0aW9ucy5vdmVybGFwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzdGVwUHJvbWlzZXMucHVzaChcclxuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9uc1swXS5jb21wb25lbnQuaGlkZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpZnROb3RpZmljYXRpb25zKG9sZE5vdGlmaWNhdGlvbnMsIG5vdGlmaWNhdGlvbi5jb21wb25lbnQuZ2V0SGVpZ2h0KCksIHRydWUpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uLmNvbXBvbmVudC5zaG93KCkudGhlbihyZXNvbHZlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdGVwUHJvbWlzZXMucHVzaCh0aGlzLm5vdGlmaWNhdGlvbnNbMF0uY29tcG9uZW50LmhpZGUoKSk7XHJcbiAgICAgICAgICAgIHN0ZXBQcm9taXNlcy5wdXNoKHRoaXMuc2hpZnROb3RpZmljYXRpb25zKG9sZE5vdGlmaWNhdGlvbnMsIG5vdGlmaWNhdGlvbi5jb21wb25lbnQuZ2V0SGVpZ2h0KCksIHRydWUpKTtcclxuICAgICAgICAgICAgc3RlcFByb21pc2VzLnB1c2gobm90aWZpY2F0aW9uLmNvbXBvbmVudC5zaG93KCkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBvbGROb3RpZmljYXRpb25zOiBBcnJheTxOb3RpZmllck5vdGlmaWNhdGlvbj4gPSB0aGlzLm5vdGlmaWNhdGlvbnMuc2xpY2UoMCwgbnVtYmVyT2ZOb3RpZmljYXRpb25zIC0gMSk7XHJcblxyXG4gICAgICAgICAgLy8gQXJlIGFuaW1hdGlvbnMgZW5hYmxlZD9cclxuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5hbmltYXRpb25zLmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgLy8gSXMgYW5pbWF0aW9uIG92ZXJsYXAgZW5hYmxlZD9cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmFuaW1hdGlvbnMub3ZlcmxhcCAhPT0gZmFsc2UgJiYgdGhpcy5jb25maWcuYW5pbWF0aW9ucy5vdmVybGFwID4gMCkge1xyXG4gICAgICAgICAgICAgIHN0ZXBQcm9taXNlcy5wdXNoKHRoaXMuc2hpZnROb3RpZmljYXRpb25zKG9sZE5vdGlmaWNhdGlvbnMsIG5vdGlmaWNhdGlvbi5jb21wb25lbnQuZ2V0SGVpZ2h0KCksIHRydWUpKTtcclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHN0ZXBQcm9taXNlcy5wdXNoKG5vdGlmaWNhdGlvbi5jb21wb25lbnQuc2hvdygpKTtcclxuICAgICAgICAgICAgICB9LCB0aGlzLmNvbmZpZy5hbmltYXRpb25zLnNoaWZ0LnNwZWVkIC0gdGhpcy5jb25maWcuYW5pbWF0aW9ucy5vdmVybGFwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzdGVwUHJvbWlzZXMucHVzaChcclxuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hpZnROb3RpZmljYXRpb25zKG9sZE5vdGlmaWNhdGlvbnMsIG5vdGlmaWNhdGlvbi5jb21wb25lbnQuZ2V0SGVpZ2h0KCksIHRydWUpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jb21wb25lbnQuc2hvdygpLnRoZW4ocmVzb2x2ZSk7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3RlcFByb21pc2VzLnB1c2godGhpcy5zaGlmdE5vdGlmaWNhdGlvbnMob2xkTm90aWZpY2F0aW9ucywgbm90aWZpY2F0aW9uLmNvbXBvbmVudC5nZXRIZWlnaHQoKSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICBzdGVwUHJvbWlzZXMucHVzaChub3RpZmljYXRpb24uY29tcG9uZW50LnNob3coKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBQcm9taXNlLmFsbChzdGVwUHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmJlaGF2aW91ci5zdGFja2luZyAhPT0gZmFsc2UgJiYgbnVtYmVyT2ZOb3RpZmljYXRpb25zID4gdGhpcy5jb25maWcuYmVoYXZpb3VyLnN0YWNraW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTm90aWZpY2F0aW9uRnJvbUxpc3QodGhpcy5ub3RpZmljYXRpb25zWzBdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGVtcFByb21pc2VSZXNvbHZlcigpO1xyXG4gICAgICAgIH0pOyAvLyBEb25lXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGUgYW4gZXhpc3Rpbmcgbm90aWZpY2F0aW9uXHJcbiAgICpcclxuICAgKiBGaXN0LCB3ZSBza2lwIGV2ZXJ5dGhpbmcgaWYgdGhlcmUgYXJlIG5vIG5vdGlmaWNhdGlvbnMgYXQgYWxsLCBvciB0aGUgZ2l2ZW4gbm90aWZpY2F0aW9uIGRvZXMgbm90IGV4aXN0LiBUaGVuLCB3ZSBoaWRlIHRoZSBnaXZlblxyXG4gICAqIG5vdGlmaWNhdGlvbi4gSWYgdGhlcmUgZXhpc3Qgb2xkZXIgbm90aWZpY2F0aW9ucywgd2UgdGhlbiBzaGlmdCB0aGVtIGFyb3VuZCB0byBmaWxsIHRoZSBnYXAuIE9uY2UgYm90aCBoaWRpbmcgdGhlIGdpdmVuIG5vdGlmaWNhdGlvblxyXG4gICAqIGFuZCBzaGlmdGluZyB0aGUgb2xkZXIgbm90aWZpY2FpdG9ucyBpcyBkb25lLCB0aGUgZ2l2ZW4gbm90aWZpY2F0aW9uIGdldHMgZmluYWxseSByZW1vdmVkIChmcm9tIHRoZSBET00pLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICAgYWN0aW9uIEFjdGlvbiBvYmplY3QsIHBheWxvYWQgY29udGFpbnMgdGhlIG5vdGlmaWNhdGlvbiBJRFxyXG4gICAqIEByZXR1cm5zIFByb21pc2UsIHJlc29sdmVkIHdoZW4gZG9uZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgaGFuZGxlSGlkZUFjdGlvbihhY3Rpb246IE5vdGlmaWVyQWN0aW9uKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcclxuICAgICAgY29uc3Qgc3RlcFByb21pc2VzOiBBcnJheTxQcm9taXNlPHZvaWQ+PiA9IFtdO1xyXG5cclxuICAgICAgLy8gRG9lcyB0aGUgbm90aWZpY2F0aW9uIGV4aXN0IC8gYXJlIHRoZXJlIGV2ZW4gYW55IG5vdGlmaWNhdGlvbnM/IChsZXQncyBwcmV2ZW50IGFjY2lkZW50aWFsIGVycm9ycylcclxuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uOiBOb3RpZmllck5vdGlmaWNhdGlvbiB8IHVuZGVmaW5lZCA9IHRoaXMuZmluZE5vdGlmaWNhdGlvbkJ5SWQoYWN0aW9uLnBheWxvYWQpO1xyXG4gICAgICBpZiAobm90aWZpY2F0aW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBHZXQgb2xkZXIgbm90aWZpY2F0aW9uc1xyXG4gICAgICBjb25zdCBub3RpZmljYXRpb25JbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkID0gdGhpcy5maW5kTm90aWZpY2F0aW9uSW5kZXhCeUlkKGFjdGlvbi5wYXlsb2FkKTtcclxuICAgICAgaWYgKG5vdGlmaWNhdGlvbkluZGV4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG9sZE5vdGlmaWNhdGlvbnM6IEFycmF5PE5vdGlmaWVyTm90aWZpY2F0aW9uPiA9IHRoaXMubm90aWZpY2F0aW9ucy5zbGljZSgwLCBub3RpZmljYXRpb25JbmRleCk7XHJcblxyXG4gICAgICAvLyBEbyBvbGRlciBub3RpZmljYXRpb25zIGV4aXN0LCBhbmQgdGh1cyBkbyB3ZSBuZWVkIHRvIHNoaWZ0IG90aGVyIG5vdGlmaWNhdGlvbnMgYXMgYSBjb25zZXF1ZW5jZT9cclxuICAgICAgaWYgKG9sZE5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIC8vIEFyZSBhbmltYXRpb25zIGVuYWJsZWQ/XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmFuaW1hdGlvbnMuZW5hYmxlZCAmJiB0aGlzLmNvbmZpZy5hbmltYXRpb25zLmhpZGUuc3BlZWQgPiAwKSB7XHJcbiAgICAgICAgICAvLyBJcyBhbmltYXRpb24gb3ZlcmxhcCBlbmFibGVkP1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmFuaW1hdGlvbnMub3ZlcmxhcCAhPT0gZmFsc2UgJiYgdGhpcy5jb25maWcuYW5pbWF0aW9ucy5vdmVybGFwID4gMCkge1xyXG4gICAgICAgICAgICBzdGVwUHJvbWlzZXMucHVzaChub3RpZmljYXRpb24uY29tcG9uZW50LmhpZGUoKSk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHN0ZXBQcm9taXNlcy5wdXNoKHRoaXMuc2hpZnROb3RpZmljYXRpb25zKG9sZE5vdGlmaWNhdGlvbnMsIG5vdGlmaWNhdGlvbi5jb21wb25lbnQuZ2V0SGVpZ2h0KCksIGZhbHNlKSk7XHJcbiAgICAgICAgICAgIH0sIHRoaXMuY29uZmlnLmFuaW1hdGlvbnMuaGlkZS5zcGVlZCAtIHRoaXMuY29uZmlnLmFuaW1hdGlvbnMub3ZlcmxhcCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY29tcG9uZW50LmhpZGUoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICBzdGVwUHJvbWlzZXMucHVzaCh0aGlzLnNoaWZ0Tm90aWZpY2F0aW9ucyhvbGROb3RpZmljYXRpb25zLCBub3RpZmljYXRpb24uY29tcG9uZW50LmdldEhlaWdodCgpLCBmYWxzZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3RlcFByb21pc2VzLnB1c2gobm90aWZpY2F0aW9uLmNvbXBvbmVudC5oaWRlKCkpO1xyXG4gICAgICAgICAgc3RlcFByb21pc2VzLnB1c2godGhpcy5zaGlmdE5vdGlmaWNhdGlvbnMob2xkTm90aWZpY2F0aW9ucywgbm90aWZpY2F0aW9uLmNvbXBvbmVudC5nZXRIZWlnaHQoKSwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3RlcFByb21pc2VzLnB1c2gobm90aWZpY2F0aW9uLmNvbXBvbmVudC5oaWRlKCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBXYWl0IHVudGlsIGJvdGggaGlkaW5nIGFuZCBzaGlmdGluZyBpcyBkb25lLCB0aGVuIHJlbW92ZSB0aGUgbm90aWZpY2F0aW9uIGZyb20gdGhlIGxpc3RcclxuICAgICAgUHJvbWlzZS5hbGwoc3RlcFByb21pc2VzKS50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLnJlbW92ZU5vdGlmaWNhdGlvbkZyb21MaXN0KG5vdGlmaWNhdGlvbik7XHJcbiAgICAgICAgcmVzb2x2ZSgpOyAvLyBEb25lXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIaWRlIHRoZSBvbGRlc3Qgbm90aWZpY2F0aW9uIChicmlkZ2UgdG8gaGFuZGxlSGlkZUFjdGlvbilcclxuICAgKlxyXG4gICAqIEBwYXJhbSAgIGFjdGlvbiBBY3Rpb24gb2JqZWN0XHJcbiAgICogQHJldHVybnMgUHJvbWlzZSwgcmVzb2x2ZWQgd2hlbiBkb25lXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBoYW5kbGVIaWRlT2xkZXN0QWN0aW9uKGFjdGlvbjogTm90aWZpZXJBY3Rpb24pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIC8vIEFyZSB0aGVyZSBhbnkgbm90aWZpY2F0aW9ucz8gKHByZXZlbnQgYWNjaWRlbnRpYWwgZXJyb3JzKVxyXG4gICAgaWYgKHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9KTsgLy8gRG9uZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWN0aW9uLnBheWxvYWQgPSB0aGlzLm5vdGlmaWNhdGlvbnNbMF0uaWQ7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUhpZGVBY3Rpb24oYWN0aW9uKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGUgdGhlIG5ld2VzdCBub3RpZmljYXRpb24gKGJyaWRnZSB0byBoYW5kbGVIaWRlQWN0aW9uKVxyXG4gICAqXHJcbiAgICogQHBhcmFtICAgYWN0aW9uIEFjdGlvbiBvYmplY3RcclxuICAgKiBAcmV0dXJucyBQcm9taXNlLCByZXNvbHZlZCB3aGVuIGRvbmVcclxuICAgKi9cclxuICBwcml2YXRlIGhhbmRsZUhpZGVOZXdlc3RBY3Rpb24oYWN0aW9uOiBOb3RpZmllckFjdGlvbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgLy8gQXJlIHRoZXJlIGFueSBub3RpZmljYXRpb25zPyAocHJldmVudCBhY2NpZGVudGlhbCBlcnJvcnMpXHJcbiAgICBpZiAodGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0pOyAvLyBEb25lXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhY3Rpb24ucGF5bG9hZCA9IHRoaXMubm90aWZpY2F0aW9uc1t0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoIC0gMV0uaWQ7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUhpZGVBY3Rpb24oYWN0aW9uKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGUgYWxsIG5vdGlmaWNhdGlvbnMgYXQgb25jZVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSwgcmVzb2x2ZWQgd2hlbiBkb25lXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBoYW5kbGVIaWRlQWxsQWN0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlOiAoKSA9PiB2b2lkKSA9PiB7XHJcbiAgICAgIC8vIEFyZSB0aGVyZSBhbnkgbm90aWZpY2F0aW9ucz8gKHByZXZlbnQgYWNjaWRlbnRpYWwgZXJyb3JzKVxyXG4gICAgICBjb25zdCBudW1iZXJPZk5vdGlmaWNhdGlvbnM6IG51bWJlciA9IHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGg7XHJcbiAgICAgIGlmIChudW1iZXJPZk5vdGlmaWNhdGlvbnMgPT09IDApIHtcclxuICAgICAgICByZXNvbHZlKCk7IC8vIERvbmVcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFyZSBhbmltYXRpb25zIGVuYWJsZWQ/XHJcbiAgICAgIGlmIChcclxuICAgICAgICB0aGlzLmNvbmZpZy5hbmltYXRpb25zLmVuYWJsZWQgJiZcclxuICAgICAgICB0aGlzLmNvbmZpZy5hbmltYXRpb25zLmhpZGUuc3BlZWQgPiAwICYmXHJcbiAgICAgICAgdGhpcy5jb25maWcuYW5pbWF0aW9ucy5oaWRlLm9mZnNldCAhPT0gZmFsc2UgJiZcclxuICAgICAgICB0aGlzLmNvbmZpZy5hbmltYXRpb25zLmhpZGUub2Zmc2V0ID4gMFxyXG4gICAgICApIHtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSBudW1iZXJPZk5vdGlmaWNhdGlvbnMgLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgY29uc3QgYW5pbWF0aW9uT2Zmc2V0OiBudW1iZXIgPSB0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5wb3NpdGlvbiA9PT0gJ3RvcCcgPyBudW1iZXJPZk5vdGlmaWNhdGlvbnMgLSAxIDogaTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnNbaV0uY29tcG9uZW50LmhpZGUoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAvLyBBcmUgd2UgZG9uZSBoZXJlLCB3YXMgdGhpcyB0aGUgbGFzdCBub3RpZmljYXRpb24gdG8gYmUgaGlkZGVuP1xyXG4gICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICh0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5wb3NpdGlvbiA9PT0gJ3RvcCcgJiYgaSA9PT0gMCkgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5wb3NpdGlvbiA9PT0gJ2JvdHRvbScgJiYgaSA9PT0gbnVtYmVyT2ZOb3RpZmljYXRpb25zIC0gMSlcclxuICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTm90aWZpY2F0aW9uc0Zyb21MaXN0KCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7IC8vIERvbmVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSwgdGhpcy5jb25maWcuYW5pbWF0aW9ucy5oaWRlLm9mZnNldCAqIGFuaW1hdGlvbk9mZnNldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHN0ZXBQcm9taXNlczogQXJyYXk8UHJvbWlzZTx2b2lkPj4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSBudW1iZXJPZk5vdGlmaWNhdGlvbnMgLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgc3RlcFByb21pc2VzLnB1c2godGhpcy5ub3RpZmljYXRpb25zW2ldLmNvbXBvbmVudC5oaWRlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBQcm9taXNlLmFsbChzdGVwUHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZW1vdmVBbGxOb3RpZmljYXRpb25zRnJvbUxpc3QoKTtcclxuICAgICAgICAgIHJlc29sdmUoKTsgLy8gRG9uZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBoYW5kbGVDdXN0b21BY3Rpb24oYWN0aW9uOiBOb3RpZmllckFjdGlvbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5ub3RpZmljYXRpb25DdXN0b21BY3Rpb24uZW1pdCh7IG5hbWU6IGFjdGlvbi5wYXlsb2FkLmFjdGlvbk5hbWUsIHBheWxvYWQ6IGFjdGlvbi5wYXlsb2FkLmFjdGlvblBheWxvYWQgfSk7XHJcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVIaWRlQWN0aW9uKHsgdHlwZTogJ0hJREUnLCBwYXlsb2FkOiBhY3Rpb24ucGF5bG9hZC5ub3RpZmljYXRpb25JZCB9KTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICogU2hpZnQgbXVsdGlwbGUgbm90aWZpY2F0aW9ucyBhdCBvbmNlXHJcbiAgICpcclxuICAgKiBAcGFyYW0gICBub3RpZmljYXRpb25zIExpc3QgY29udGFpbmluZyB0aGUgbm90aWZpY2F0aW9ucyB0byBiZSBzaGlmdGVkXHJcbiAgICogQHBhcmFtICAgZGlzdGFuY2UgICAgICBEaXN0YW5jZSB0byBzaGlmdCAoaW4gcHgpXHJcbiAgICogQHBhcmFtICAgdG9NYWtlUGxhY2UgICBGbGFnLCBkZWZpbmluZyBpbiB3aGljaCBkaXJlY2l0b24gdG8gc2hpZnRcclxuICAgKiBAcmV0dXJucyBQcm9taXNlLCByZXNvbHZlZCB3aGVuIGRvbmVcclxuICAgKi9cclxuICBwcml2YXRlIHNoaWZ0Tm90aWZpY2F0aW9ucyhub3RpZmljYXRpb25zOiBBcnJheTxOb3RpZmllck5vdGlmaWNhdGlvbj4sIGRpc3RhbmNlOiBudW1iZXIsIHRvTWFrZVBsYWNlOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmU6ICgpID0+IHZvaWQpID0+IHtcclxuICAgICAgLy8gQXJlIHRoZXJlIGFueSBub3RpZmljYXRpb25zIHRvIHNoaWZ0P1xyXG4gICAgICBpZiAobm90aWZpY2F0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBub3RpZmljYXRpb25Qcm9taXNlczogQXJyYXk8UHJvbWlzZTx2b2lkPj4gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gbm90aWZpY2F0aW9ucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIG5vdGlmaWNhdGlvblByb21pc2VzLnB1c2gobm90aWZpY2F0aW9uc1tpXS5jb21wb25lbnQuc2hpZnQoZGlzdGFuY2UsIHRvTWFrZVBsYWNlKSk7XHJcbiAgICAgIH1cclxuICAgICAgUHJvbWlzZS5hbGwobm90aWZpY2F0aW9uUHJvbWlzZXMpLnRoZW4ocmVzb2x2ZSk7IC8vIERvbmVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGEgbmV3IG5vdGlmaWNhdGlvbiB0byB0aGUgbGlzdCBvZiBub3RpZmljYXRpb25zICh0cmlnZ2VycyBjaGFuZ2UgZGV0ZWN0aW9uKVxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb24gdG8gYWRkIHRvIHRoZSBsaXN0IG9mIG5vdGlmaWNhdGlvbnNcclxuICAgKi9cclxuICBwcml2YXRlIGFkZE5vdGlmaWNhdGlvblRvTGlzdChub3RpZmljYXRpb246IE5vdGlmaWVyTm90aWZpY2F0aW9uKTogdm9pZCB7XHJcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMucHVzaChub3RpZmljYXRpb24pO1xyXG4gICAgdGhpcy5jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTsgLy8gUnVuIGNoYW5nZSBkZXRlY3Rpb24gYmVjYXVzZSB0aGUgbm90aWZpY2F0aW9uIGxpc3QgY2hhbmdlZFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGFuIGV4aXN0aW5nIG5vdGlmaWNhdGlvbiBmcm9tIHRoZSBsaXN0IG9mIG5vdGlmaWNhdGlvbnMgKHRyaWdnZXJzIGNoYW5nZSBkZXRlY3Rpb24pXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbiB0byBiZSByZW1vdmVkIGZyb20gdGhlIGxpc3Qgb2Ygbm90aWZpY2F0aW9uc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVtb3ZlTm90aWZpY2F0aW9uRnJvbUxpc3Qobm90aWZpY2F0aW9uOiBOb3RpZmllck5vdGlmaWNhdGlvbik6IHZvaWQge1xyXG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gdGhpcy5ub3RpZmljYXRpb25zLmZpbHRlcigoaXRlbTogTm90aWZpZXJOb3RpZmljYXRpb24pID0+IGl0ZW0uY29tcG9uZW50ICE9PSBub3RpZmljYXRpb24uY29tcG9uZW50KTtcclxuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7IC8vIFJ1biBjaGFuZ2UgZGV0ZWN0aW9uIGJlY2F1c2UgdGhlIG5vdGlmaWNhdGlvbiBsaXN0IGNoYW5nZWRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBhbGwgbm90aWZpY2F0aW9ucyBmcm9tIHRoZSBsaXN0ICh0cmlnZ2VycyBjaGFuZ2UgZGV0ZWN0aW9uKVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVtb3ZlQWxsTm90aWZpY2F0aW9uc0Zyb21MaXN0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gW107XHJcbiAgICB0aGlzLmNoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpOyAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBiZWNhdXNlIHRoZSBub3RpZmljYXRpb24gbGlzdCBjaGFuZ2VkXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIZWxwZXI6IEZpbmQgYSBub3RpZmljYXRpb24gaW4gdGhlIG5vdGlmaWNhdGlvbiBsaXN0IGJ5IGEgZ2l2ZW4gbm90aWZpY2F0aW9uIElEXHJcbiAgICpcclxuICAgKiBAcGFyYW0gICBub3RpZmljYXRpb25JZCBOb3RpZmljYXRpb24gSUQsIHVzZWQgZm9yIGZpbmRpbmcgbm90aWZpY2F0aW9uXHJcbiAgICogQHJldHVybnMgTm90aWZpY2F0aW9uLCB1bmRlZmluZWQgaWYgbm90IGZvdW5kXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBmaW5kTm90aWZpY2F0aW9uQnlJZChub3RpZmljYXRpb25JZDogc3RyaW5nKTogTm90aWZpZXJOb3RpZmljYXRpb24gfCB1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIHRoaXMubm90aWZpY2F0aW9ucy5maW5kKChjdXJyZW50Tm90aWZpY2F0aW9uOiBOb3RpZmllck5vdGlmaWNhdGlvbikgPT4gY3VycmVudE5vdGlmaWNhdGlvbi5pZCA9PT0gbm90aWZpY2F0aW9uSWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGVscGVyOiBGaW5kIGEgbm90aWZpY2F0aW9uJ3MgaW5kZXggYnkgYSBnaXZlbiBub3RpZmljYXRpb24gSURcclxuICAgKlxyXG4gICAqIEBwYXJhbSAgIG5vdGlmaWNhdGlvbklkIE5vdGlmaWNhdGlvbiBJRCwgdXNlZCBmb3IgZmluZGluZyBhIG5vdGlmaWNhdGlvbidzIGluZGV4XHJcbiAgICogQHJldHVybnMgTm90aWZpY2F0aW9uIGluZGV4LCB1bmRlZmluZWQgaWYgbm90IGZvdW5kXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBmaW5kTm90aWZpY2F0aW9uSW5kZXhCeUlkKG5vdGlmaWNhdGlvbklkOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xyXG4gICAgY29uc3Qgbm90aWZpY2F0aW9uSW5kZXg6IG51bWJlciA9IHRoaXMubm90aWZpY2F0aW9ucy5maW5kSW5kZXgoXHJcbiAgICAgIChjdXJyZW50Tm90aWZpY2F0aW9uOiBOb3RpZmllck5vdGlmaWNhdGlvbikgPT4gY3VycmVudE5vdGlmaWNhdGlvbi5pZCA9PT0gbm90aWZpY2F0aW9uSWQsXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIG5vdGlmaWNhdGlvbkluZGV4ICE9PSAtMSA/IG5vdGlmaWNhdGlvbkluZGV4IDogdW5kZWZpbmVkO1xyXG4gIH1cclxufVxyXG4iLCI8dWwgY2xhc3M9XCJub3RpZmllcl9fY29udGFpbmVyLWxpc3RcIj5cclxuICA8bGkgY2xhc3M9XCJub3RpZmllcl9fY29udGFpbmVyLWxpc3QtaXRlbVwiICpuZ0Zvcj1cImxldCBub3RpZmljYXRpb24gb2Ygbm90aWZpY2F0aW9uczsgdHJhY2tCeTogaWRlbnRpZnlOb3RpZmljYXRpb25cIj5cclxuICAgIDxub3RpZmllci1ub3RpZmljYXRpb24gW25vdGlmaWNhdGlvbl09XCJub3RpZmljYXRpb25cIiAocmVhZHkpPVwib25Ob3RpZmljYXRpb25SZWFkeSgkZXZlbnQpXCIgKGRpc21pc3MpPVwib25Ob3RpZmljYXRpb25EaXNtaXNzKCRldmVudClcIiAoY3VzdG9tQWN0aW9uKT1cIm9uTm90aWZpY2F0aW9uQ3VzdG9tQWN0aW9uKCRldmVudClcIj5cclxuICAgIDwvbm90aWZpZXItbm90aWZpY2F0aW9uPlxyXG4gIDwvbGk+XHJcbjwvdWw+XHJcbiJdfQ==