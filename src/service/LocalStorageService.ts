import IPreset from "../interface/IPreset";

export default class LocalStorageService {
    private static _instance: LocalStorageService | null = null;

    private constructor() {}

    public static async getInstance(): Promise<LocalStorageService> {
        if (this._instance === null) {
            this._instance = new LocalStorageService();
            await this._instance.init();
        }
        return this._instance;
    }

    private async init() {
        
    }

    public async getUserPresets(): Promise<IPreset[]> {
        let presets: IPreset[] = [];
        let presetsString = localStorage.getItem('userPresets');
        if (presetsString) {
            presets = JSON.parse(presetsString);
        }
        return presets;
    }

    public async setUserPresets(presets: IPreset[]): Promise<void> {
        localStorage.setItem('userPresets', JSON.stringify(presets));
    }
}