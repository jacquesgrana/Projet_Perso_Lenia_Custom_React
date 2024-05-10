export default class CellConfig {
    public static readonly CELL_SIZE = 8;

    public static readonly CELL_BRUSH_SIZE = 32; // nombre pair !!!

    public static readonly CELL_CONV_FILTER_RADIUS = 13;
    public static readonly CELL_CONV_FILTER_MU = 0.5;
    public static readonly CELL_CONV_FILTER_SIGMA = 0.15;

    public static readonly CELL_GROWTH_MU = 0.15;
    public static readonly CELL_GROWTH_SIGMA = 0.015;

    public static readonly CELL_GENERATION_DELTA_T = 0.05;

    public static readonly CELL_FILTER_COUNT_FLOOR_RED = 0.1;
    public static readonly CELL_FILTER_COUNT_FLOOR_GREEN = 0.15;
    public static readonly CELL_FILTER_COUNT_FLOOR_BLUE = 0.2;

    public static readonly CELL_COLOR_SENSIBILITY_RED: [number, number, number] = [4,1,1];
    public static readonly CELL_COLOR_SENSIBILITY_GREEN: [number, number, number] = [1,4,1];
    public static readonly CELL_COLOR_SENSIBILITY_BLUE: [number, number, number] = [1,1,4];
}