import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotifierContainerComponent } from './components/notifier-container.component';
import { NotifierNotificationComponent } from './components/notifier-notification.component';
import { NotifierConfig } from './models/notifier-config.model';
import { NotifierConfigToken, NotifierOptionsToken } from './notifier.tokens';
import { NotifierService } from './services/notifier.service';
import { NotifierAnimationService } from './services/notifier-animation.service';
import { NotifierQueueService } from './services/notifier-queue.service';
import * as i0 from "@angular/core";
/**
 * Factory for a notifier configuration with custom options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @param   options - Custom notifier options
 * @returns - Notifier configuration as result
 */
export function notifierCustomConfigFactory(options) {
    return new NotifierConfig(options);
}
/**
 * Factory for a notifier configuration with default options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @returns - Notifier configuration as result
 */
export function notifierDefaultConfigFactory() {
    return new NotifierConfig({});
}
/**
 * Notifier module
 */
export class NotifierModule {
    /**
     * Setup the notifier module with custom providers, in this case with a custom configuration based on the givne options
     *
     * @param   [options={}] - Custom notifier options
     * @returns - Notifier module with custom providers
     */
    static withConfig(options = {}) {
        return {
            ngModule: NotifierModule,
            providers: [
                // Provide the options itself upfront (as we need to inject them as dependencies -- see below)
                {
                    provide: NotifierOptionsToken,
                    useValue: options,
                },
                // Provide a custom notifier configuration, based on the given notifier options
                {
                    deps: [NotifierOptionsToken],
                    provide: NotifierConfigToken,
                    useFactory: notifierCustomConfigFactory,
                },
            ],
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.4", ngImport: i0, type: NotifierModule, declarations: [NotifierContainerComponent, NotifierNotificationComponent], imports: [CommonModule], exports: [NotifierContainerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierModule, providers: [
            NotifierAnimationService,
            NotifierService,
            NotifierQueueService,
            // Provide the default notifier configuration if just the module is imported
            {
                provide: NotifierConfigToken,
                useFactory: notifierDefaultConfigFactory,
            },
        ], imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.4", ngImport: i0, type: NotifierModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NotifierContainerComponent, NotifierNotificationComponent],
                    exports: [NotifierContainerComponent],
                    imports: [CommonModule],
                    providers: [
                        NotifierAnimationService,
                        NotifierService,
                        NotifierQueueService,
                        // Provide the default notifier configuration if just the module is imported
                        {
                            provide: NotifierConfigToken,
                            useFactory: notifierDefaultConfigFactory,
                        },
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ub3RpZmllci9zcmMvbGliL25vdGlmaWVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDdkYsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDN0YsT0FBTyxFQUFFLGNBQWMsRUFBbUIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNqRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDakYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7O0FBRXpFOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLDJCQUEyQixDQUFDLE9BQXdCO0lBQ2xFLE9BQU8sSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsNEJBQTRCO0lBQzFDLE9BQU8sSUFBSSxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVEOztHQUVHO0FBaUJILE1BQU0sT0FBTyxjQUFjO0lBQ3pCOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUEyQixFQUFFO1FBQ3BELE9BQU87WUFDTCxRQUFRLEVBQUUsY0FBYztZQUN4QixTQUFTLEVBQUU7Z0JBQ1QsOEZBQThGO2dCQUM5RjtvQkFDRSxPQUFPLEVBQUUsb0JBQW9CO29CQUM3QixRQUFRLEVBQUUsT0FBTztpQkFDbEI7Z0JBRUQsK0VBQStFO2dCQUMvRTtvQkFDRSxJQUFJLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDNUIsT0FBTyxFQUFFLG1CQUFtQjtvQkFDNUIsVUFBVSxFQUFFLDJCQUEyQjtpQkFDeEM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzhHQXpCVSxjQUFjOytHQUFkLGNBQWMsaUJBZlYsMEJBQTBCLEVBQUUsNkJBQTZCLGFBRTlELFlBQVksYUFEWiwwQkFBMEI7K0dBY3pCLGNBQWMsYUFaZDtZQUNULHdCQUF3QjtZQUN4QixlQUFlO1lBQ2Ysb0JBQW9CO1lBRXBCLDRFQUE0RTtZQUM1RTtnQkFDRSxPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixVQUFVLEVBQUUsNEJBQTRCO2FBQ3pDO1NBQ0YsWUFYUyxZQUFZOzsyRkFhWCxjQUFjO2tCQWhCMUIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSw2QkFBNkIsQ0FBQztvQkFDekUsT0FBTyxFQUFFLENBQUMsMEJBQTBCLENBQUM7b0JBQ3JDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsU0FBUyxFQUFFO3dCQUNULHdCQUF3Qjt3QkFDeEIsZUFBZTt3QkFDZixvQkFBb0I7d0JBRXBCLDRFQUE0RTt3QkFDNUU7NEJBQ0UsT0FBTyxFQUFFLG1CQUFtQjs0QkFDNUIsVUFBVSxFQUFFLDRCQUE0Qjt5QkFDekM7cUJBQ0Y7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgTm90aWZpZXJDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvbm90aWZpZXItY29udGFpbmVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5vdGlmaWVyTm90aWZpY2F0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWVyLW5vdGlmaWNhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOb3RpZmllckNvbmZpZywgTm90aWZpZXJPcHRpb25zIH0gZnJvbSAnLi9tb2RlbHMvbm90aWZpZXItY29uZmlnLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJDb25maWdUb2tlbiwgTm90aWZpZXJPcHRpb25zVG9rZW4gfSBmcm9tICcuL25vdGlmaWVyLnRva2Vucyc7XHJcbmltcG9ydCB7IE5vdGlmaWVyU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvbm90aWZpZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE5vdGlmaWVyQW5pbWF0aW9uU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvbm90aWZpZXItYW5pbWF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOb3RpZmllclF1ZXVlU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvbm90aWZpZXItcXVldWUuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogRmFjdG9yeSBmb3IgYSBub3RpZmllciBjb25maWd1cmF0aW9uIHdpdGggY3VzdG9tIG9wdGlvbnNcclxuICpcclxuICogU2lkZW5vdGU6XHJcbiAqIFJlcXVpcmVkIGFzIEFuZ3VsYXIgQW9UIGNvbXBpbGF0aW9uIGNhbm5vdCBoYW5kbGUgZHluYW1pYyBmdW5jdGlvbnM7IHNlZSA8aHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTEyNjI+LlxyXG4gKlxyXG4gKiBAcGFyYW0gICBvcHRpb25zIC0gQ3VzdG9tIG5vdGlmaWVyIG9wdGlvbnNcclxuICogQHJldHVybnMgLSBOb3RpZmllciBjb25maWd1cmF0aW9uIGFzIHJlc3VsdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG5vdGlmaWVyQ3VzdG9tQ29uZmlnRmFjdG9yeShvcHRpb25zOiBOb3RpZmllck9wdGlvbnMpOiBOb3RpZmllckNvbmZpZyB7XHJcbiAgcmV0dXJuIG5ldyBOb3RpZmllckNvbmZpZyhvcHRpb25zKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZhY3RvcnkgZm9yIGEgbm90aWZpZXIgY29uZmlndXJhdGlvbiB3aXRoIGRlZmF1bHQgb3B0aW9uc1xyXG4gKlxyXG4gKiBTaWRlbm90ZTpcclxuICogUmVxdWlyZWQgYXMgQW5ndWxhciBBb1QgY29tcGlsYXRpb24gY2Fubm90IGhhbmRsZSBkeW5hbWljIGZ1bmN0aW9uczsgc2VlIDxodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xMTI2Mj4uXHJcbiAqXHJcbiAqIEByZXR1cm5zIC0gTm90aWZpZXIgY29uZmlndXJhdGlvbiBhcyByZXN1bHRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBub3RpZmllckRlZmF1bHRDb25maWdGYWN0b3J5KCk6IE5vdGlmaWVyQ29uZmlnIHtcclxuICByZXR1cm4gbmV3IE5vdGlmaWVyQ29uZmlnKHt9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE5vdGlmaWVyIG1vZHVsZVxyXG4gKi9cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtOb3RpZmllckNvbnRhaW5lckNvbXBvbmVudCwgTm90aWZpZXJOb3RpZmljYXRpb25Db21wb25lbnRdLFxyXG4gIGV4cG9ydHM6IFtOb3RpZmllckNvbnRhaW5lckNvbXBvbmVudF0sXHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBOb3RpZmllckFuaW1hdGlvblNlcnZpY2UsXHJcbiAgICBOb3RpZmllclNlcnZpY2UsXHJcbiAgICBOb3RpZmllclF1ZXVlU2VydmljZSxcclxuXHJcbiAgICAvLyBQcm92aWRlIHRoZSBkZWZhdWx0IG5vdGlmaWVyIGNvbmZpZ3VyYXRpb24gaWYganVzdCB0aGUgbW9kdWxlIGlzIGltcG9ydGVkXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IE5vdGlmaWVyQ29uZmlnVG9rZW4sXHJcbiAgICAgIHVzZUZhY3Rvcnk6IG5vdGlmaWVyRGVmYXVsdENvbmZpZ0ZhY3RvcnksXHJcbiAgICB9LFxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb3RpZmllck1vZHVsZSB7XHJcbiAgLyoqXHJcbiAgICogU2V0dXAgdGhlIG5vdGlmaWVyIG1vZHVsZSB3aXRoIGN1c3RvbSBwcm92aWRlcnMsIGluIHRoaXMgY2FzZSB3aXRoIGEgY3VzdG9tIGNvbmZpZ3VyYXRpb24gYmFzZWQgb24gdGhlIGdpdm5lIG9wdGlvbnNcclxuICAgKlxyXG4gICAqIEBwYXJhbSAgIFtvcHRpb25zPXt9XSAtIEN1c3RvbSBub3RpZmllciBvcHRpb25zXHJcbiAgICogQHJldHVybnMgLSBOb3RpZmllciBtb2R1bGUgd2l0aCBjdXN0b20gcHJvdmlkZXJzXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyB3aXRoQ29uZmlnKG9wdGlvbnM6IE5vdGlmaWVyT3B0aW9ucyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxOb3RpZmllck1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IE5vdGlmaWVyTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICAvLyBQcm92aWRlIHRoZSBvcHRpb25zIGl0c2VsZiB1cGZyb250IChhcyB3ZSBuZWVkIHRvIGluamVjdCB0aGVtIGFzIGRlcGVuZGVuY2llcyAtLSBzZWUgYmVsb3cpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJvdmlkZTogTm90aWZpZXJPcHRpb25zVG9rZW4sXHJcbiAgICAgICAgICB1c2VWYWx1ZTogb3B0aW9ucyxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBQcm92aWRlIGEgY3VzdG9tIG5vdGlmaWVyIGNvbmZpZ3VyYXRpb24sIGJhc2VkIG9uIHRoZSBnaXZlbiBub3RpZmllciBvcHRpb25zXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZGVwczogW05vdGlmaWVyT3B0aW9uc1Rva2VuXSxcclxuICAgICAgICAgIHByb3ZpZGU6IE5vdGlmaWVyQ29uZmlnVG9rZW4sXHJcbiAgICAgICAgICB1c2VGYWN0b3J5OiBub3RpZmllckN1c3RvbUNvbmZpZ0ZhY3RvcnksXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==