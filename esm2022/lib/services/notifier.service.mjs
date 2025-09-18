import { Inject, Injectable } from '@angular/core';
import { NotifierConfigToken } from '../notifier.tokens';
import * as i0 from "@angular/core";
import * as i1 from "./notifier-queue.service";
import * as i2 from "../models/notifier-config.model";
/**
 * Notifier service
 *
 * This service provides access to the public notifier API. Once injected into a component, directive, pipe, service, or any other building
 * block of an applications, it can be used to show new notifications, and hide existing ones. Internally, it transforms API calls into
 * actions, which then get thrown into the action queue - eventually being processed at the right moment.
 */
export class NotifierService {
    /**
     * Constructor
     *
     * @param notifierQueueService Notifier queue service
     * @param config               Notifier configuration, optionally injected as a dependency
     */
    constructor(notifierQueueService, config) {
        this.queueService = notifierQueueService;
        this.config = config;
    }
    /**
     * Get the notifier configuration
     *
     * @returns Notifier configuration
     */
    getConfig() {
        return this.config;
    }
    /**
     * Get the observable for handling actions
     *
     * @returns Observable of NotifierAction
     */
    get actionStream() {
        return this.queueService.actionStream.asObservable();
    }
    /**
     * API: Show a new notification
     *
     * @param notificationOptions Notification options
     */
    show(notificationOptions) {
        this.queueService.push({
            payload: notificationOptions,
            type: 'SHOW',
        });
    }
    /**
     * API: Hide a specific notification, given its ID
     *
     * @param notificationId ID of the notification to hide
     */
    hide(notificationId) {
        this.queueService.push({
            payload: notificationId,
            type: 'HIDE',
        });
    }
    /**
     * API: Hide the newest notification
     */
    hideNewest() {
        this.queueService.push({
            type: 'HIDE_NEWEST',
        });
    }
    /**
     * API: Hide the oldest notification
     */
    hideOldest() {
        this.queueService.push({
            type: 'HIDE_OLDEST',
        });
    }
    /**
     * API: Hide all notifications at once
     */
    hideAll() {
        this.queueService.push({
            type: 'HIDE_ALL',
        });
    }
    /**
     * API: Shortcut for showing a new notification
     *
     * @param type             Type of the notification
     * @param message          Message of the notification
     * @param [notificationId] Unique ID for the notification (optional)
     */
    notify(type, message, notificationId) {
        const notificationOptions = {
            message,
            type,
        };
        if (notificationId !== undefined) {
            notificationOptions.id = notificationId;
        }
        this.show(notificationOptions);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierService, deps: [{ token: i1.NotifierQueueService }, { token: NotifierConfigToken }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NotifierQueueService }, { type: i2.NotifierConfig, decorators: [{
                    type: Inject,
                    args: [NotifierConfigToken]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItbm90aWZpZXIvc3JjL2xpYi9zZXJ2aWNlcy9ub3RpZmllci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTW5ELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7O0FBR3pEOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyxlQUFlO0lBVzFCOzs7OztPQUtHO0lBQ0gsWUFBbUIsb0JBQTBDLEVBQStCLE1BQXNCO1FBQ2hILElBQUksQ0FBQyxZQUFZLEdBQUcsb0JBQW9CLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxTQUFTO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBVyxZQUFZO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsbUJBQWdEO1FBQzFELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ3JCLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLElBQUksQ0FBQyxjQUFzQjtRQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztZQUNyQixPQUFPLEVBQUUsY0FBYztZQUN2QixJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLFVBQVU7UUFDZixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztZQUNyQixJQUFJLEVBQUUsYUFBYTtTQUNwQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxVQUFVO1FBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7WUFDckIsSUFBSSxFQUFFLGFBQWE7U0FDcEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksT0FBTztRQUNaLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ3JCLElBQUksRUFBRSxVQUFVO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsSUFBWSxFQUFFLE9BQWUsRUFBRSxjQUF1QjtRQUNsRSxNQUFNLG1CQUFtQixHQUFnQztZQUN2RCxPQUFPO1lBQ1AsSUFBSTtTQUNMLENBQUM7UUFDRixJQUFJLGNBQWMsS0FBSyxTQUFTLEVBQUU7WUFDaEMsbUJBQW1CLENBQUMsRUFBRSxHQUFHLGNBQWMsQ0FBQztTQUN6QztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNqQyxDQUFDOzhHQTNHVSxlQUFlLHNEQWlCNkMsbUJBQW1CO2tIQWpCL0UsZUFBZTs7MkZBQWYsZUFBZTtrQkFEM0IsVUFBVTs7MEJBa0J1RCxNQUFNOzJCQUFDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBOb3RpZmllckFjdGlvbiB9IGZyb20gJy4uL21vZGVscy9ub3RpZmllci1hY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBOb3RpZmllckNvbmZpZyB9IGZyb20gJy4uL21vZGVscy9ub3RpZmllci1jb25maWcubW9kZWwnO1xyXG5pbXBvcnQgeyBOb3RpZmllck5vdGlmaWNhdGlvbk9wdGlvbnMgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItbm90aWZpY2F0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJDb25maWdUb2tlbiB9IGZyb20gJy4uL25vdGlmaWVyLnRva2Vucyc7XHJcbmltcG9ydCB7IE5vdGlmaWVyUXVldWVTZXJ2aWNlIH0gZnJvbSAnLi9ub3RpZmllci1xdWV1ZS5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBOb3RpZmllciBzZXJ2aWNlXHJcbiAqXHJcbiAqIFRoaXMgc2VydmljZSBwcm92aWRlcyBhY2Nlc3MgdG8gdGhlIHB1YmxpYyBub3RpZmllciBBUEkuIE9uY2UgaW5qZWN0ZWQgaW50byBhIGNvbXBvbmVudCwgZGlyZWN0aXZlLCBwaXBlLCBzZXJ2aWNlLCBvciBhbnkgb3RoZXIgYnVpbGRpbmdcclxuICogYmxvY2sgb2YgYW4gYXBwbGljYXRpb25zLCBpdCBjYW4gYmUgdXNlZCB0byBzaG93IG5ldyBub3RpZmljYXRpb25zLCBhbmQgaGlkZSBleGlzdGluZyBvbmVzLiBJbnRlcm5hbGx5LCBpdCB0cmFuc2Zvcm1zIEFQSSBjYWxscyBpbnRvXHJcbiAqIGFjdGlvbnMsIHdoaWNoIHRoZW4gZ2V0IHRocm93biBpbnRvIHRoZSBhY3Rpb24gcXVldWUgLSBldmVudHVhbGx5IGJlaW5nIHByb2Nlc3NlZCBhdCB0aGUgcmlnaHQgbW9tZW50LlxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTm90aWZpZXJTZXJ2aWNlIHtcclxuICAvKipcclxuICAgKiBOb3RpZmllciBxdWV1ZSBzZXJ2aWNlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkb25seSBxdWV1ZVNlcnZpY2U6IE5vdGlmaWVyUXVldWVTZXJ2aWNlO1xyXG5cclxuICAvKipcclxuICAgKiBOb3RpZmllciBjb25maWd1cmF0aW9uXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkb25seSBjb25maWc6IE5vdGlmaWVyQ29uZmlnO1xyXG5cclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5vdGlmaWVyUXVldWVTZXJ2aWNlIE5vdGlmaWVyIHF1ZXVlIHNlcnZpY2VcclxuICAgKiBAcGFyYW0gY29uZmlnICAgICAgICAgICAgICAgTm90aWZpZXIgY29uZmlndXJhdGlvbiwgb3B0aW9uYWxseSBpbmplY3RlZCBhcyBhIGRlcGVuZGVuY3lcclxuICAgKi9cclxuICBwdWJsaWMgY29uc3RydWN0b3Iobm90aWZpZXJRdWV1ZVNlcnZpY2U6IE5vdGlmaWVyUXVldWVTZXJ2aWNlLCBASW5qZWN0KE5vdGlmaWVyQ29uZmlnVG9rZW4pIGNvbmZpZzogTm90aWZpZXJDb25maWcpIHtcclxuICAgIHRoaXMucXVldWVTZXJ2aWNlID0gbm90aWZpZXJRdWV1ZVNlcnZpY2U7XHJcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgbm90aWZpZXIgY29uZmlndXJhdGlvblxyXG4gICAqXHJcbiAgICogQHJldHVybnMgTm90aWZpZXIgY29uZmlndXJhdGlvblxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRDb25maWcoKTogTm90aWZpZXJDb25maWcge1xyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBvYnNlcnZhYmxlIGZvciBoYW5kbGluZyBhY3Rpb25zXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBPYnNlcnZhYmxlIG9mIE5vdGlmaWVyQWN0aW9uXHJcbiAgICovXHJcbiAgcHVibGljIGdldCBhY3Rpb25TdHJlYW0oKTogT2JzZXJ2YWJsZTxOb3RpZmllckFjdGlvbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMucXVldWVTZXJ2aWNlLmFjdGlvblN0cmVhbS5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFQSTogU2hvdyBhIG5ldyBub3RpZmljYXRpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbSBub3RpZmljYXRpb25PcHRpb25zIE5vdGlmaWNhdGlvbiBvcHRpb25zXHJcbiAgICovXHJcbiAgcHVibGljIHNob3cobm90aWZpY2F0aW9uT3B0aW9uczogTm90aWZpZXJOb3RpZmljYXRpb25PcHRpb25zKTogdm9pZCB7XHJcbiAgICB0aGlzLnF1ZXVlU2VydmljZS5wdXNoKHtcclxuICAgICAgcGF5bG9hZDogbm90aWZpY2F0aW9uT3B0aW9ucyxcclxuICAgICAgdHlwZTogJ1NIT1cnLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBUEk6IEhpZGUgYSBzcGVjaWZpYyBub3RpZmljYXRpb24sIGdpdmVuIGl0cyBJRFxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5vdGlmaWNhdGlvbklkIElEIG9mIHRoZSBub3RpZmljYXRpb24gdG8gaGlkZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBoaWRlKG5vdGlmaWNhdGlvbklkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMucXVldWVTZXJ2aWNlLnB1c2goe1xyXG4gICAgICBwYXlsb2FkOiBub3RpZmljYXRpb25JZCxcclxuICAgICAgdHlwZTogJ0hJREUnLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBUEk6IEhpZGUgdGhlIG5ld2VzdCBub3RpZmljYXRpb25cclxuICAgKi9cclxuICBwdWJsaWMgaGlkZU5ld2VzdCgpOiB2b2lkIHtcclxuICAgIHRoaXMucXVldWVTZXJ2aWNlLnB1c2goe1xyXG4gICAgICB0eXBlOiAnSElERV9ORVdFU1QnLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBUEk6IEhpZGUgdGhlIG9sZGVzdCBub3RpZmljYXRpb25cclxuICAgKi9cclxuICBwdWJsaWMgaGlkZU9sZGVzdCgpOiB2b2lkIHtcclxuICAgIHRoaXMucXVldWVTZXJ2aWNlLnB1c2goe1xyXG4gICAgICB0eXBlOiAnSElERV9PTERFU1QnLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBUEk6IEhpZGUgYWxsIG5vdGlmaWNhdGlvbnMgYXQgb25jZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBoaWRlQWxsKCk6IHZvaWQge1xyXG4gICAgdGhpcy5xdWV1ZVNlcnZpY2UucHVzaCh7XHJcbiAgICAgIHR5cGU6ICdISURFX0FMTCcsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFQSTogU2hvcnRjdXQgZm9yIHNob3dpbmcgYSBuZXcgbm90aWZpY2F0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdHlwZSAgICAgICAgICAgICBUeXBlIG9mIHRoZSBub3RpZmljYXRpb25cclxuICAgKiBAcGFyYW0gbWVzc2FnZSAgICAgICAgICBNZXNzYWdlIG9mIHRoZSBub3RpZmljYXRpb25cclxuICAgKiBAcGFyYW0gW25vdGlmaWNhdGlvbklkXSBVbmlxdWUgSUQgZm9yIHRoZSBub3RpZmljYXRpb24gKG9wdGlvbmFsKVxyXG4gICAqL1xyXG4gIHB1YmxpYyBub3RpZnkodHlwZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIG5vdGlmaWNhdGlvbklkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBub3RpZmljYXRpb25PcHRpb25zOiBOb3RpZmllck5vdGlmaWNhdGlvbk9wdGlvbnMgPSB7XHJcbiAgICAgIG1lc3NhZ2UsXHJcbiAgICAgIHR5cGUsXHJcbiAgICB9O1xyXG4gICAgaWYgKG5vdGlmaWNhdGlvbklkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgbm90aWZpY2F0aW9uT3B0aW9ucy5pZCA9IG5vdGlmaWNhdGlvbklkO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zaG93KG5vdGlmaWNhdGlvbk9wdGlvbnMpO1xyXG4gIH1cclxufVxyXG4iXX0=