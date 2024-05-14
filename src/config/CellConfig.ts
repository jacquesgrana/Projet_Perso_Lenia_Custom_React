export default class CellConfig {
    public static readonly CELL_SIZE = 10;
    public static readonly CELL_SIZE_MIN = 1;
    public static readonly CELL_SIZE_MAX = 16;
    public static readonly CELL_SIZE_STEP = 1;

    public static readonly CELL_BRUSH_SIZE = 32; // nombre pair !!!
    public static readonly CELL_BRUSH_SIZE_MIN = 8;
    public static readonly CELL_BRUSH_SIZE_MAX = 64;
    public static readonly CELL_BRUSH_SIZE_STEP = 2;

    public static readonly CELL_CONV_FILTER_RADIUS_RED = 7;
    public static readonly CELL_CONV_FILTER_RADIUS_GREEN = 7;
    public static readonly CELL_CONV_FILTER_RADIUS_BLUE = 7;
    public static readonly CELL_CONV_FILTER_RADIUS_MIN = 6;
    public static readonly CELL_CONV_FILTER_RADIUS_MAX = 16;
    public static readonly CELL_CONV_FILTER_RADIUS_STEP = 1;

    public static readonly CELL_CONV_FILTER_MU_RED = 0.5;
    public static readonly CELL_CONV_FILTER_MU_GREEN = 0.5;
    public static readonly CELL_CONV_FILTER_MU_BLUE = 0.5;
    public static readonly CELL_CONV_FILTER_MU_MIN = 0;
    public static readonly CELL_CONV_FILTER_MU_MAX = 1;
    public static readonly CELL_CONV_FILTER_MU_STEP = 0.01;

    public static readonly CELL_CONV_FILTER_SIGMA_RED = 0.25;
    public static readonly CELL_CONV_FILTER_SIGMA_GREEN = 0.3;
    public static readonly CELL_CONV_FILTER_SIGMA_BLUE = 0.35;
    public static readonly CELL_CONV_FILTER_SIGMA_MIN = 0.05;
    public static readonly CELL_CONV_FILTER_SIGMA_MAX = 0.5;
    public static readonly CELL_CONV_FILTER_SIGMA_STEP = 0.01;

    public static readonly CELL_GROWTH_MU = 0.15;
    public static readonly CELL_GROWTH_MU_MIN = 0.1;
    public static readonly CELL_GROWTH_MU_MAX = 0.2;
    public static readonly CELL_GROWTH_MU_STEP = 0.01;

    public static readonly CELL_GROWTH_SIGMA = 0.015;
    public static readonly CELL_GROWTH_SIGMA_MIN = 0.01;
    public static readonly CELL_GROWTH_SIGMA_MAX = 0.03;
    public static readonly CELL_GROWTH_SIGMA_STEP = 0.001;

    public static readonly CELL_EVOLUTION_DELTA_T = 0.05;
    public static readonly CELL_EVOLUTION_DELTA_T_MIN = 0.01;
    public static readonly CELL_EVOLUTION_DELTA_T_MAX = 0.125;
    public static readonly CELL_EVOLUTION_DELTA_T_STEP = 0.01;

    /*
    public static readonly CELL_FILTER_COUNT_FLOOR_RED = 1.0;
    public static readonly CELL_FILTER_COUNT_FLOOR_GREEN = 1.15;
    public static readonly CELL_FILTER_COUNT_FLOOR_BLUE = 1.3;
    public static readonly CELL_FILTER_COUNT_FLOOR_MIN = 0.5;
    public static readonly CELL_FILTER_COUNT_FLOOR_MAX = 1.5;
    public static readonly CELL_FILTER_COUNT_FLOOR_STEP = 0.05;
    */
    
    public static readonly CELL_FILTER_COUNT_FLOOR_RED = 0.2;
    public static readonly CELL_FILTER_COUNT_FLOOR_GREEN = 0.25;
    public static readonly CELL_FILTER_COUNT_FLOOR_BLUE = 0.3;
    public static readonly CELL_FILTER_COUNT_FLOOR_MIN = 0;
    public static readonly CELL_FILTER_COUNT_FLOOR_MAX = 1;
    public static readonly CELL_FILTER_COUNT_FLOOR_STEP = 0.01;
    

    public static readonly CELL_COLOR_SENSIBILITY_RED: [number, number, number] = [4,1,1];
    public static readonly CELL_COLOR_SENSIBILITY_GREEN: [number, number, number] = [1,4,1];
    public static readonly CELL_COLOR_SENSIBILITY_BLUE: [number, number, number] = [1,1,4];
    public static readonly CELL_COLOR_SENSIBILITY_MIN: number = 0;
    public static readonly CELL_COLOR_SENSIBILITY_MAX: number = 24;
    public static readonly CELL_COLOR_SENSIBILITY_STEP: number = 0.25;
}