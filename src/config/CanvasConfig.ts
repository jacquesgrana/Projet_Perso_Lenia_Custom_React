export default class CanvasConfig {
    public static readonly CANVAS_PADDING = 40;
    public static readonly CANVAS_WIDTH = window.innerWidth > 1200 ? 1200 : window.innerWidth - this.CANVAS_PADDING * 2;
    public static readonly CANVAS_HEIGHT = 800;
    //public static readonly CANVAS_DELAY = 0;
}