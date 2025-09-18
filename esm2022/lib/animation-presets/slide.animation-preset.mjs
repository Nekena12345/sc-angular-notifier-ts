/**
 * Slide animation preset
 */
export const slide = {
    hide: (notification) => {
        // Prepare variables
        const config = notification.component.getConfig();
        const shift = notification.component.getShift();
        let from;
        let to;
        // Configure variables, depending on configuration and component
        if (config.position.horizontal.position === 'left') {
            from = {
                transform: `translate3d( 0, ${shift}px, 0 )`,
            };
            to = {
                transform: `translate3d( calc( -100% - ${config.position.horizontal.distance}px - 10px ), ${shift}px, 0 )`,
            };
        }
        else if (config.position.horizontal.position === 'right') {
            from = {
                transform: `translate3d( 0, ${shift}px, 0 )`,
            };
            to = {
                transform: `translate3d( calc( 100% + ${config.position.horizontal.distance}px + 10px ), ${shift}px, 0 )`,
            };
        }
        else {
            let horizontalPosition;
            if (config.position.vertical.position === 'top') {
                horizontalPosition = `calc( -100% - ${config.position.horizontal.distance}px - 10px )`;
            }
            else {
                horizontalPosition = `calc( 100% + ${config.position.horizontal.distance}px + 10px )`;
            }
            from = {
                transform: `translate3d( -50%, ${shift}px, 0 )`,
            };
            to = {
                transform: `translate3d( -50%, ${horizontalPosition}, 0 )`,
            };
        }
        // Done
        return {
            from,
            to,
        };
    },
    show: (notification) => {
        // Prepare variables
        const config = notification.component.getConfig();
        let from;
        let to;
        // Configure variables, depending on configuration and component
        if (config.position.horizontal.position === 'left') {
            from = {
                transform: `translate3d( calc( -100% - ${config.position.horizontal.distance}px - 10px ), 0, 0 )`,
            };
            to = {
                transform: 'translate3d( 0, 0, 0 )',
            };
        }
        else if (config.position.horizontal.position === 'right') {
            from = {
                transform: `translate3d( calc( 100% + ${config.position.horizontal.distance}px + 10px ), 0, 0 )`,
            };
            to = {
                transform: 'translate3d( 0, 0, 0 )',
            };
        }
        else {
            let horizontalPosition;
            if (config.position.vertical.position === 'top') {
                horizontalPosition = `calc( -100% - ${config.position.horizontal.distance}px - 10px )`;
            }
            else {
                horizontalPosition = `calc( 100% + ${config.position.horizontal.distance}px + 10px )`;
            }
            from = {
                transform: `translate3d( -50%, ${horizontalPosition}, 0 )`,
            };
            to = {
                transform: 'translate3d( -50%, 0, 0 )',
            };
        }
        // Done
        return {
            from,
            to,
        };
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUuYW5pbWF0aW9uLXByZXNldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItbm90aWZpZXIvc3JjL2xpYi9hbmltYXRpb24tcHJlc2V0cy9zbGlkZS5hbmltYXRpb24tcHJlc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUE0QjtJQUM1QyxJQUFJLEVBQUUsQ0FBQyxZQUFrQyxFQUFvQyxFQUFFO1FBQzdFLG9CQUFvQjtRQUNwQixNQUFNLE1BQU0sR0FBbUIsWUFBWSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNsRSxNQUFNLEtBQUssR0FBVyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hELElBQUksSUFFSCxDQUFDO1FBQ0YsSUFBSSxFQUVILENBQUM7UUFFRixnRUFBZ0U7UUFDaEUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEtBQUssTUFBTSxFQUFFO1lBQ2xELElBQUksR0FBRztnQkFDTCxTQUFTLEVBQUUsbUJBQW1CLEtBQUssU0FBUzthQUM3QyxDQUFDO1lBQ0YsRUFBRSxHQUFHO2dCQUNILFNBQVMsRUFBRSw4QkFBOEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxnQkFBZ0IsS0FBSyxTQUFTO2FBQzNHLENBQUM7U0FDSDthQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtZQUMxRCxJQUFJLEdBQUc7Z0JBQ0wsU0FBUyxFQUFFLG1CQUFtQixLQUFLLFNBQVM7YUFDN0MsQ0FBQztZQUNGLEVBQUUsR0FBRztnQkFDSCxTQUFTLEVBQUUsNkJBQTZCLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsZ0JBQWdCLEtBQUssU0FBUzthQUMxRyxDQUFDO1NBQ0g7YUFBTTtZQUNMLElBQUksa0JBQTBCLENBQUM7WUFDL0IsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUFFO2dCQUMvQyxrQkFBa0IsR0FBRyxpQkFBaUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxhQUFhLENBQUM7YUFDeEY7aUJBQU07Z0JBQ0wsa0JBQWtCLEdBQUcsZ0JBQWdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsYUFBYSxDQUFDO2FBQ3ZGO1lBQ0QsSUFBSSxHQUFHO2dCQUNMLFNBQVMsRUFBRSxzQkFBc0IsS0FBSyxTQUFTO2FBQ2hELENBQUM7WUFDRixFQUFFLEdBQUc7Z0JBQ0gsU0FBUyxFQUFFLHNCQUFzQixrQkFBa0IsT0FBTzthQUMzRCxDQUFDO1NBQ0g7UUFFRCxPQUFPO1FBQ1AsT0FBTztZQUNMLElBQUk7WUFDSixFQUFFO1NBQ0gsQ0FBQztJQUNKLENBQUM7SUFDRCxJQUFJLEVBQUUsQ0FBQyxZQUFrQyxFQUFvQyxFQUFFO1FBQzdFLG9CQUFvQjtRQUNwQixNQUFNLE1BQU0sR0FBbUIsWUFBWSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNsRSxJQUFJLElBRUgsQ0FBQztRQUNGLElBQUksRUFFSCxDQUFDO1FBRUYsZ0VBQWdFO1FBQ2hFLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxLQUFLLE1BQU0sRUFBRTtZQUNsRCxJQUFJLEdBQUc7Z0JBQ0wsU0FBUyxFQUFFLDhCQUE4QixNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLHFCQUFxQjthQUNsRyxDQUFDO1lBQ0YsRUFBRSxHQUFHO2dCQUNILFNBQVMsRUFBRSx3QkFBd0I7YUFDcEMsQ0FBQztTQUNIO2FBQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO1lBQzFELElBQUksR0FBRztnQkFDTCxTQUFTLEVBQUUsNkJBQTZCLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEscUJBQXFCO2FBQ2pHLENBQUM7WUFDRixFQUFFLEdBQUc7Z0JBQ0gsU0FBUyxFQUFFLHdCQUF3QjthQUNwQyxDQUFDO1NBQ0g7YUFBTTtZQUNMLElBQUksa0JBQTBCLENBQUM7WUFDL0IsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUFFO2dCQUMvQyxrQkFBa0IsR0FBRyxpQkFBaUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxhQUFhLENBQUM7YUFDeEY7aUJBQU07Z0JBQ0wsa0JBQWtCLEdBQUcsZ0JBQWdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsYUFBYSxDQUFDO2FBQ3ZGO1lBQ0QsSUFBSSxHQUFHO2dCQUNMLFNBQVMsRUFBRSxzQkFBc0Isa0JBQWtCLE9BQU87YUFDM0QsQ0FBQztZQUNGLEVBQUUsR0FBRztnQkFDSCxTQUFTLEVBQUUsMkJBQTJCO2FBQ3ZDLENBQUM7U0FDSDtRQUVELE9BQU87UUFDUCxPQUFPO1lBQ0wsSUFBSTtZQUNKLEVBQUU7U0FDSCxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOb3RpZmllckFuaW1hdGlvblByZXNldCwgTm90aWZpZXJBbmltYXRpb25QcmVzZXRLZXlmcmFtZXMgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItYW5pbWF0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJDb25maWcgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItY29uZmlnLm1vZGVsJztcclxuaW1wb3J0IHsgTm90aWZpZXJOb3RpZmljYXRpb24gfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpZXItbm90aWZpY2F0aW9uLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBTbGlkZSBhbmltYXRpb24gcHJlc2V0XHJcbiAqL1xyXG5leHBvcnQgY29uc3Qgc2xpZGU6IE5vdGlmaWVyQW5pbWF0aW9uUHJlc2V0ID0ge1xyXG4gIGhpZGU6IChub3RpZmljYXRpb246IE5vdGlmaWVyTm90aWZpY2F0aW9uKTogTm90aWZpZXJBbmltYXRpb25QcmVzZXRLZXlmcmFtZXMgPT4ge1xyXG4gICAgLy8gUHJlcGFyZSB2YXJpYWJsZXNcclxuICAgIGNvbnN0IGNvbmZpZzogTm90aWZpZXJDb25maWcgPSBub3RpZmljYXRpb24uY29tcG9uZW50LmdldENvbmZpZygpO1xyXG4gICAgY29uc3Qgc2hpZnQ6IG51bWJlciA9IG5vdGlmaWNhdGlvbi5jb21wb25lbnQuZ2V0U2hpZnQoKTtcclxuICAgIGxldCBmcm9tOiB7XHJcbiAgICAgIFthbmltYXRhYmxlUHJvcGVydHlOYW1lOiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gICAgbGV0IHRvOiB7XHJcbiAgICAgIFthbmltYXRhYmxlUHJvcGVydHlOYW1lOiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENvbmZpZ3VyZSB2YXJpYWJsZXMsIGRlcGVuZGluZyBvbiBjb25maWd1cmF0aW9uIGFuZCBjb21wb25lbnRcclxuICAgIGlmIChjb25maWcucG9zaXRpb24uaG9yaXpvbnRhbC5wb3NpdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgIGZyb20gPSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoIDAsICR7c2hpZnR9cHgsIDAgKWAsXHJcbiAgICAgIH07XHJcbiAgICAgIHRvID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCBjYWxjKCAtMTAwJSAtICR7Y29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwuZGlzdGFuY2V9cHggLSAxMHB4ICksICR7c2hpZnR9cHgsIDAgKWAsXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5wb3NpdGlvbi5ob3Jpem9udGFsLnBvc2l0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgIGZyb20gPSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoIDAsICR7c2hpZnR9cHgsIDAgKWAsXHJcbiAgICAgIH07XHJcbiAgICAgIHRvID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCBjYWxjKCAxMDAlICsgJHtjb25maWcucG9zaXRpb24uaG9yaXpvbnRhbC5kaXN0YW5jZX1weCArIDEwcHggKSwgJHtzaGlmdH1weCwgMCApYCxcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBob3Jpem9udGFsUG9zaXRpb246IHN0cmluZztcclxuICAgICAgaWYgKGNvbmZpZy5wb3NpdGlvbi52ZXJ0aWNhbC5wb3NpdGlvbiA9PT0gJ3RvcCcpIHtcclxuICAgICAgICBob3Jpem9udGFsUG9zaXRpb24gPSBgY2FsYyggLTEwMCUgLSAke2NvbmZpZy5wb3NpdGlvbi5ob3Jpem9udGFsLmRpc3RhbmNlfXB4IC0gMTBweCApYDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBob3Jpem9udGFsUG9zaXRpb24gPSBgY2FsYyggMTAwJSArICR7Y29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwuZGlzdGFuY2V9cHggKyAxMHB4IClgO1xyXG4gICAgICB9XHJcbiAgICAgIGZyb20gPSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoIC01MCUsICR7c2hpZnR9cHgsIDAgKWAsXHJcbiAgICAgIH07XHJcbiAgICAgIHRvID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCAtNTAlLCAke2hvcml6b250YWxQb3NpdGlvbn0sIDAgKWAsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRG9uZVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZnJvbSxcclxuICAgICAgdG8sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgc2hvdzogKG5vdGlmaWNhdGlvbjogTm90aWZpZXJOb3RpZmljYXRpb24pOiBOb3RpZmllckFuaW1hdGlvblByZXNldEtleWZyYW1lcyA9PiB7XHJcbiAgICAvLyBQcmVwYXJlIHZhcmlhYmxlc1xyXG4gICAgY29uc3QgY29uZmlnOiBOb3RpZmllckNvbmZpZyA9IG5vdGlmaWNhdGlvbi5jb21wb25lbnQuZ2V0Q29uZmlnKCk7XHJcbiAgICBsZXQgZnJvbToge1xyXG4gICAgICBbYW5pbWF0YWJsZVByb3BlcnR5TmFtZTogc3RyaW5nXTogc3RyaW5nO1xyXG4gICAgfTtcclxuICAgIGxldCB0bzoge1xyXG4gICAgICBbYW5pbWF0YWJsZVByb3BlcnR5TmFtZTogc3RyaW5nXTogc3RyaW5nO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDb25maWd1cmUgdmFyaWFibGVzLCBkZXBlbmRpbmcgb24gY29uZmlndXJhdGlvbiBhbmQgY29tcG9uZW50XHJcbiAgICBpZiAoY29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwucG9zaXRpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICBmcm9tID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCBjYWxjKCAtMTAwJSAtICR7Y29uZmlnLnBvc2l0aW9uLmhvcml6b250YWwuZGlzdGFuY2V9cHggLSAxMHB4ICksIDAsIDAgKWAsXHJcbiAgICAgIH07XHJcbiAgICAgIHRvID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKCAwLCAwLCAwICknLFxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIGlmIChjb25maWcucG9zaXRpb24uaG9yaXpvbnRhbC5wb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICBmcm9tID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCBjYWxjKCAxMDAlICsgJHtjb25maWcucG9zaXRpb24uaG9yaXpvbnRhbC5kaXN0YW5jZX1weCArIDEwcHggKSwgMCwgMCApYCxcclxuICAgICAgfTtcclxuICAgICAgdG8gPSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoIDAsIDAsIDAgKScsXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgaG9yaXpvbnRhbFBvc2l0aW9uOiBzdHJpbmc7XHJcbiAgICAgIGlmIChjb25maWcucG9zaXRpb24udmVydGljYWwucG9zaXRpb24gPT09ICd0b3AnKSB7XHJcbiAgICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uID0gYGNhbGMoIC0xMDAlIC0gJHtjb25maWcucG9zaXRpb24uaG9yaXpvbnRhbC5kaXN0YW5jZX1weCAtIDEwcHggKWA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uID0gYGNhbGMoIDEwMCUgKyAke2NvbmZpZy5wb3NpdGlvbi5ob3Jpem9udGFsLmRpc3RhbmNlfXB4ICsgMTBweCApYDtcclxuICAgICAgfVxyXG4gICAgICBmcm9tID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCAtNTAlLCAke2hvcml6b250YWxQb3NpdGlvbn0sIDAgKWAsXHJcbiAgICAgIH07XHJcbiAgICAgIHRvID0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKCAtNTAlLCAwLCAwICknLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERvbmVcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZyb20sXHJcbiAgICAgIHRvLFxyXG4gICAgfTtcclxuICB9LFxyXG59O1xyXG4iXX0=