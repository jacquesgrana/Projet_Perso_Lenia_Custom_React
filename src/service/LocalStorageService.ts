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
        const presetsToReturn: IPreset[] = [];
        let isErrorInLocalStorage = false;
        let presetsString = localStorage.getItem('userPresets');
        if (presetsString) {
            presets = JSON.parse(presetsString);
        
            // TODO tester les presets pour verifier qu'ils sont de type IPreset sinon on omet le preset concerné -> done
            // TODO améliorer -> refaire le local storage si il contient des erreurs si besoin -> done
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
        localStorage.setItem('userPresets', JSON.stringify(presets));
    }
}