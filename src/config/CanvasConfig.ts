export default class CanvasConfig {
    public static readonly CANVAS_PADDING = 40;
    public static readonly CANVAS_WIDTH = window.innerWidth > 1200 ? 1200 : window.innerWidth - this.CANVAS_PADDING * 2;
    public static readonly CANVAS_HEIGHT = 800;
    //public static readonly CANVAS_DELAY = 0;
    public static readonly BRUSH_STROKE_WIDTH = 4;
    public static readonly BRUSH_STROKE_LARGE_WIDTH = 6;
    public static readonly BRUSH_STROKE_LARGE_COLOR = "rgb(0, 0, 0)";
}