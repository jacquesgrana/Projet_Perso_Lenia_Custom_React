export default class AppConfig {

    public static readonly APP_LOAD_COUNT_MAX = process.env.NODE_ENV === 'development' ? 2 : 1;
}