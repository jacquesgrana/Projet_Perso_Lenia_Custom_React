import IPreset from "../interface/IPreset";

/**
 * Service en pattern singleton
 */
export default class LocalStorageService {
    private static _instance: LocalStorageService | null = null;

    private constructor() {}

    public static async getInstance(): Promise<LocalStorageService> {
        if (this._instance === null) {
            this._instance = new LocalStorageService();
            //await this._instance.init();
        }
        return this._instance;
    }

    /*
    private async init() {
        
    }
    */

    /**
     * Retourne les presets de l'utilisateur depuis le local storage en vérifiant leur type
     * Remplace le local storage en enlevant les presets non valides
     */
    public async getUserPresets(): Promise<IPreset[]> {
        let presets: IPreset[] = [];
        const presetsToReturn: IPreset[] = [];
        let isErrorInLocalStorage = false;
        let presetsString = localStorage.getItem('userPresets');
        if (presetsString) {
            presets = JSON.parse(presetsString);
            presets.forEach((preset: any) => {
                if(preset && (preset as IPreset)) {
                    presetsToReturn.push(preset);
                }
                else {
                    isErrorInLocalStorage = true
                }
            });

            if(isErrorInLocalStorage) {
                await this.setUserPresets(presetsToReturn);
            }
        }
        return presetsToReturn;
    }

    public async setUserPresets(presets: IPreset[]): Promise<void> {
        await localStorage.setItem('userPresets', JSON.stringify(presets));
    }
}