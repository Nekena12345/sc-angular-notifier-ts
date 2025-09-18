/**
 * Notifier configuration
 *
 * The notifier configuration defines what notifications look like, how they behave, and how they get animated. It is a global
 * configuration, which means that it only can be set once (at the beginning), and cannot be changed afterwards. Aligning to the world of
 * Angular, this configuration can be provided in the root app module - alternatively, a meaningful default configuration will be used.
 */
export class NotifierConfig {
    /**
     * Constructor
     *
     * @param [customOptions={}] Custom notifier options, optional
     */
    constructor(customOptions = {}) {
        // Set default values
        this.animations = {
            enabled: true,
            hide: {
                easing: 'ease',
                offset: 50,
                preset: 'fade',
                speed: 300,
            },
            overlap: 150,
            shift: {
                easing: 'ease',
                speed: 300,
            },
            show: {
                easing: 'ease',
                preset: 'slide',
                speed: 300,
            },
        };
        this.behaviour = {
            autoHide: 7000,
            onClick: false,
            onMouseover: 'pauseAutoHide',
            showDismissButton: true,
            stacking: 4,
        };
        this.position = {
            horizontal: {
                distance: 12,
                position: 'left',
            },
            vertical: {
                distance: 12,
                gap: 10,
                position: 'bottom',
            },
        };
        this.theme = 'material';
        // The following merges the custom options into the notifier config, respecting the already set default values
        // This linear, more explicit and code-sizy workflow is preferred here over a recursive one (because we know the object structure)
        // Technical sidenote: Objects are merged, other types of values simply overwritten / copied
        if (customOptions.theme !== undefined) {
            this.theme = customOptions.theme;
        }
        if (customOptions.animations !== undefined) {
            if (customOptions.animations.enabled !== undefined) {
                this.animations.enabled = customOptions.animations.enabled;
            }
            if (customOptions.animations.overlap !== undefined) {
                this.animations.overlap = customOptions.animations.overlap;
            }
            if (customOptions.animations.hide !== undefined) {
                Object.assign(this.animations.hide, customOptions.animations.hide);
            }
            if (customOptions.animations.shift !== undefined) {
                Object.assign(this.animations.shift, customOptions.animations.shift);
            }
            if (customOptions.animations.show !== undefined) {
                Object.assign(this.animations.show, customOptions.animations.show);
            }
        }
        if (customOptions.behaviour !== undefined) {
            Object.assign(this.behaviour, customOptions.behaviour);
        }
        if (customOptions.position !== undefined) {
            if (customOptions.position.horizontal !== undefined) {
                Object.assign(this.position.horizontal, customOptions.position.horizontal);
            }
            if (customOptions.position.vertical !== undefined) {
                Object.assign(this.position.vertical, customOptions.position.vertical);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXItY29uZmlnLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ub3RpZmllci9zcmMvbGliL21vZGVscy9ub3RpZmllci1jb25maWcubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNENBOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBdUR6Qjs7OztPQUlHO0lBQ0gsWUFBbUIsZ0JBQWlDLEVBQUU7UUFDcEQscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUc7WUFDaEIsT0FBTyxFQUFFLElBQUk7WUFDYixJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7YUFDWDtZQUNELE9BQU8sRUFBRSxHQUFHO1lBQ1osS0FBSyxFQUFFO2dCQUNMLE1BQU0sRUFBRSxNQUFNO2dCQUNkLEtBQUssRUFBRSxHQUFHO2FBQ1g7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsS0FBSyxFQUFFLEdBQUc7YUFDWDtTQUNGLENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxHQUFHO1lBQ2YsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsS0FBSztZQUNkLFdBQVcsRUFBRSxlQUFlO1lBQzVCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsUUFBUSxFQUFFLENBQUM7U0FDWixDQUFDO1FBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNkLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsRUFBRTtnQkFDWixRQUFRLEVBQUUsTUFBTTthQUNqQjtZQUNELFFBQVEsRUFBRTtnQkFDUixRQUFRLEVBQUUsRUFBRTtnQkFDWixHQUFHLEVBQUUsRUFBRTtnQkFDUCxRQUFRLEVBQUUsUUFBUTthQUNuQjtTQUNGLENBQUM7UUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUV4Qiw4R0FBOEc7UUFDOUcsa0lBQWtJO1FBQ2xJLDRGQUE0RjtRQUM1RixJQUFJLGFBQWEsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQztTQUNsQztRQUNELElBQUksYUFBYSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDMUMsSUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2FBQzVEO1lBQ0QsSUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2FBQzVEO1lBQ0QsSUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNwRTtZQUNELElBQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEU7WUFDRCxJQUFJLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BFO1NBQ0Y7UUFDRCxJQUFJLGFBQWEsQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFJLGFBQWEsQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3hDLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUNuRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDNUU7WUFDRCxJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3hFO1NBQ0Y7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogTm90aWZpZXIgb3B0aW9uc1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBOb3RpZmllck9wdGlvbnMge1xyXG4gIGFuaW1hdGlvbnM/OiB7XHJcbiAgICBlbmFibGVkPzogYm9vbGVhbjtcclxuICAgIGhpZGU/OiB7XHJcbiAgICAgIGVhc2luZz86IHN0cmluZztcclxuICAgICAgb2Zmc2V0PzogbnVtYmVyIHwgZmFsc2U7XHJcbiAgICAgIHByZXNldD86IHN0cmluZztcclxuICAgICAgc3BlZWQ/OiBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgb3ZlcmxhcD86IG51bWJlciB8IGZhbHNlO1xyXG4gICAgc2hpZnQ/OiB7XHJcbiAgICAgIGVhc2luZz86IHN0cmluZztcclxuICAgICAgc3BlZWQ/OiBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgc2hvdz86IHtcclxuICAgICAgZWFzaW5nPzogc3RyaW5nO1xyXG4gICAgICBwcmVzZXQ/OiBzdHJpbmc7XHJcbiAgICAgIHNwZWVkPzogbnVtYmVyO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIGJlaGF2aW91cj86IHtcclxuICAgIGF1dG9IaWRlPzogbnVtYmVyIHwgZmFsc2U7XHJcbiAgICBvbkNsaWNrPzogJ2hpZGUnIHwgZmFsc2U7XHJcbiAgICBvbk1vdXNlb3Zlcj86ICdwYXVzZUF1dG9IaWRlJyB8ICdyZXNldEF1dG9IaWRlJyB8IGZhbHNlO1xyXG4gICAgc2hvd0Rpc21pc3NCdXR0b24/OiBib29sZWFuO1xyXG4gICAgc3RhY2tpbmc/OiBudW1iZXIgfCBmYWxzZTtcclxuICB9O1xyXG4gIHBvc2l0aW9uPzoge1xyXG4gICAgaG9yaXpvbnRhbD86IHtcclxuICAgICAgZGlzdGFuY2U/OiBudW1iZXI7XHJcbiAgICAgIHBvc2l0aW9uPzogJ2xlZnQnIHwgJ21pZGRsZScgfCAncmlnaHQnO1xyXG4gICAgfTtcclxuICAgIHZlcnRpY2FsPzoge1xyXG4gICAgICBkaXN0YW5jZT86IG51bWJlcjtcclxuICAgICAgZ2FwPzogbnVtYmVyO1xyXG4gICAgICBwb3NpdGlvbj86ICd0b3AnIHwgJ2JvdHRvbSc7XHJcbiAgICB9O1xyXG4gIH07XHJcbiAgdGhlbWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBOb3RpZmllciBjb25maWd1cmF0aW9uXHJcbiAqXHJcbiAqIFRoZSBub3RpZmllciBjb25maWd1cmF0aW9uIGRlZmluZXMgd2hhdCBub3RpZmljYXRpb25zIGxvb2sgbGlrZSwgaG93IHRoZXkgYmVoYXZlLCBhbmQgaG93IHRoZXkgZ2V0IGFuaW1hdGVkLiBJdCBpcyBhIGdsb2JhbFxyXG4gKiBjb25maWd1cmF0aW9uLCB3aGljaCBtZWFucyB0aGF0IGl0IG9ubHkgY2FuIGJlIHNldCBvbmNlIChhdCB0aGUgYmVnaW5uaW5nKSwgYW5kIGNhbm5vdCBiZSBjaGFuZ2VkIGFmdGVyd2FyZHMuIEFsaWduaW5nIHRvIHRoZSB3b3JsZCBvZlxyXG4gKiBBbmd1bGFyLCB0aGlzIGNvbmZpZ3VyYXRpb24gY2FuIGJlIHByb3ZpZGVkIGluIHRoZSByb290IGFwcCBtb2R1bGUgLSBhbHRlcm5hdGl2ZWx5LCBhIG1lYW5pbmdmdWwgZGVmYXVsdCBjb25maWd1cmF0aW9uIHdpbGwgYmUgdXNlZC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBOb3RpZmllckNvbmZpZyBpbXBsZW1lbnRzIE5vdGlmaWVyT3B0aW9ucyB7XHJcbiAgLyoqXHJcbiAgICogQ3VzdG9taXplIGFuaW1hdGlvbnNcclxuICAgKi9cclxuICBwdWJsaWMgYW5pbWF0aW9uczoge1xyXG4gICAgZW5hYmxlZDogYm9vbGVhbjtcclxuICAgIGhpZGU6IHtcclxuICAgICAgZWFzaW5nOiBzdHJpbmc7XHJcbiAgICAgIG9mZnNldDogbnVtYmVyIHwgZmFsc2U7XHJcbiAgICAgIHByZXNldDogc3RyaW5nO1xyXG4gICAgICBzcGVlZDogbnVtYmVyO1xyXG4gICAgfTtcclxuICAgIG92ZXJsYXA6IG51bWJlciB8IGZhbHNlO1xyXG4gICAgc2hpZnQ6IHtcclxuICAgICAgZWFzaW5nOiBzdHJpbmc7XHJcbiAgICAgIHNwZWVkOiBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgc2hvdzoge1xyXG4gICAgICBlYXNpbmc6IHN0cmluZztcclxuICAgICAgcHJlc2V0OiBzdHJpbmc7XHJcbiAgICAgIHNwZWVkOiBudW1iZXI7XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEN1c3RvbWl6ZSBiZWhhdmlvdXJcclxuICAgKi9cclxuICBwdWJsaWMgYmVoYXZpb3VyOiB7XHJcbiAgICBhdXRvSGlkZTogbnVtYmVyIHwgZmFsc2U7XHJcbiAgICBvbkNsaWNrOiAnaGlkZScgfCBmYWxzZTtcclxuICAgIG9uTW91c2VvdmVyOiAncGF1c2VBdXRvSGlkZScgfCAncmVzZXRBdXRvSGlkZScgfCBmYWxzZTtcclxuICAgIHNob3dEaXNtaXNzQnV0dG9uOiBib29sZWFuO1xyXG4gICAgc3RhY2tpbmc6IG51bWJlciB8IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEN1c3RvbWl6ZSBwb3NpdGlvbmluZ1xyXG4gICAqL1xyXG4gIHB1YmxpYyBwb3NpdGlvbjoge1xyXG4gICAgaG9yaXpvbnRhbDoge1xyXG4gICAgICBkaXN0YW5jZTogbnVtYmVyO1xyXG4gICAgICBwb3NpdGlvbjogJ2xlZnQnIHwgJ21pZGRsZScgfCAncmlnaHQnO1xyXG4gICAgfTtcclxuICAgIHZlcnRpY2FsOiB7XHJcbiAgICAgIGRpc3RhbmNlOiBudW1iZXI7XHJcbiAgICAgIGdhcDogbnVtYmVyO1xyXG4gICAgICBwb3NpdGlvbjogJ3RvcCcgfCAnYm90dG9tJztcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3VzdG9taXplIHRoZW1pbmdcclxuICAgKi9cclxuICBwdWJsaWMgdGhlbWU6IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogQ29uc3RydWN0b3JcclxuICAgKlxyXG4gICAqIEBwYXJhbSBbY3VzdG9tT3B0aW9ucz17fV0gQ3VzdG9tIG5vdGlmaWVyIG9wdGlvbnMsIG9wdGlvbmFsXHJcbiAgICovXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGN1c3RvbU9wdGlvbnM6IE5vdGlmaWVyT3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyBTZXQgZGVmYXVsdCB2YWx1ZXNcclxuICAgIHRoaXMuYW5pbWF0aW9ucyA9IHtcclxuICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgaGlkZToge1xyXG4gICAgICAgIGVhc2luZzogJ2Vhc2UnLFxyXG4gICAgICAgIG9mZnNldDogNTAsXHJcbiAgICAgICAgcHJlc2V0OiAnZmFkZScsXHJcbiAgICAgICAgc3BlZWQ6IDMwMCxcclxuICAgICAgfSxcclxuICAgICAgb3ZlcmxhcDogMTUwLFxyXG4gICAgICBzaGlmdDoge1xyXG4gICAgICAgIGVhc2luZzogJ2Vhc2UnLFxyXG4gICAgICAgIHNwZWVkOiAzMDAsXHJcbiAgICAgIH0sXHJcbiAgICAgIHNob3c6IHtcclxuICAgICAgICBlYXNpbmc6ICdlYXNlJyxcclxuICAgICAgICBwcmVzZXQ6ICdzbGlkZScsXHJcbiAgICAgICAgc3BlZWQ6IDMwMCxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgICB0aGlzLmJlaGF2aW91ciA9IHtcclxuICAgICAgYXV0b0hpZGU6IDcwMDAsXHJcbiAgICAgIG9uQ2xpY2s6IGZhbHNlLFxyXG4gICAgICBvbk1vdXNlb3ZlcjogJ3BhdXNlQXV0b0hpZGUnLFxyXG4gICAgICBzaG93RGlzbWlzc0J1dHRvbjogdHJ1ZSxcclxuICAgICAgc3RhY2tpbmc6IDQsXHJcbiAgICB9O1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IHtcclxuICAgICAgaG9yaXpvbnRhbDoge1xyXG4gICAgICAgIGRpc3RhbmNlOiAxMixcclxuICAgICAgICBwb3NpdGlvbjogJ2xlZnQnLFxyXG4gICAgICB9LFxyXG4gICAgICB2ZXJ0aWNhbDoge1xyXG4gICAgICAgIGRpc3RhbmNlOiAxMixcclxuICAgICAgICBnYXA6IDEwLFxyXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgICB0aGlzLnRoZW1lID0gJ21hdGVyaWFsJztcclxuXHJcbiAgICAvLyBUaGUgZm9sbG93aW5nIG1lcmdlcyB0aGUgY3VzdG9tIG9wdGlvbnMgaW50byB0aGUgbm90aWZpZXIgY29uZmlnLCByZXNwZWN0aW5nIHRoZSBhbHJlYWR5IHNldCBkZWZhdWx0IHZhbHVlc1xyXG4gICAgLy8gVGhpcyBsaW5lYXIsIG1vcmUgZXhwbGljaXQgYW5kIGNvZGUtc2l6eSB3b3JrZmxvdyBpcyBwcmVmZXJyZWQgaGVyZSBvdmVyIGEgcmVjdXJzaXZlIG9uZSAoYmVjYXVzZSB3ZSBrbm93IHRoZSBvYmplY3Qgc3RydWN0dXJlKVxyXG4gICAgLy8gVGVjaG5pY2FsIHNpZGVub3RlOiBPYmplY3RzIGFyZSBtZXJnZWQsIG90aGVyIHR5cGVzIG9mIHZhbHVlcyBzaW1wbHkgb3ZlcndyaXR0ZW4gLyBjb3BpZWRcclxuICAgIGlmIChjdXN0b21PcHRpb25zLnRoZW1lICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy50aGVtZSA9IGN1c3RvbU9wdGlvbnMudGhlbWU7XHJcbiAgICB9XHJcbiAgICBpZiAoY3VzdG9tT3B0aW9ucy5hbmltYXRpb25zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgaWYgKGN1c3RvbU9wdGlvbnMuYW5pbWF0aW9ucy5lbmFibGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbnMuZW5hYmxlZCA9IGN1c3RvbU9wdGlvbnMuYW5pbWF0aW9ucy5lbmFibGVkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjdXN0b21PcHRpb25zLmFuaW1hdGlvbnMub3ZlcmxhcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25zLm92ZXJsYXAgPSBjdXN0b21PcHRpb25zLmFuaW1hdGlvbnMub3ZlcmxhcDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY3VzdG9tT3B0aW9ucy5hbmltYXRpb25zLmhpZGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5hbmltYXRpb25zLmhpZGUsIGN1c3RvbU9wdGlvbnMuYW5pbWF0aW9ucy5oaWRlKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY3VzdG9tT3B0aW9ucy5hbmltYXRpb25zLnNoaWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuYW5pbWF0aW9ucy5zaGlmdCwgY3VzdG9tT3B0aW9ucy5hbmltYXRpb25zLnNoaWZ0KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY3VzdG9tT3B0aW9ucy5hbmltYXRpb25zLnNob3cgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5hbmltYXRpb25zLnNob3csIGN1c3RvbU9wdGlvbnMuYW5pbWF0aW9ucy5zaG93KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGN1c3RvbU9wdGlvbnMuYmVoYXZpb3VyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmJlaGF2aW91ciwgY3VzdG9tT3B0aW9ucy5iZWhhdmlvdXIpO1xyXG4gICAgfVxyXG4gICAgaWYgKGN1c3RvbU9wdGlvbnMucG9zaXRpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAoY3VzdG9tT3B0aW9ucy5wb3NpdGlvbi5ob3Jpem9udGFsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMucG9zaXRpb24uaG9yaXpvbnRhbCwgY3VzdG9tT3B0aW9ucy5wb3NpdGlvbi5ob3Jpem9udGFsKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY3VzdG9tT3B0aW9ucy5wb3NpdGlvbi52ZXJ0aWNhbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnBvc2l0aW9uLnZlcnRpY2FsLCBjdXN0b21PcHRpb25zLnBvc2l0aW9uLnZlcnRpY2FsKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=