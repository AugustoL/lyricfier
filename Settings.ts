import storage = require('electron-json-storage');


interface SettingsValues {
    alwaysOnTop: boolean;
    theme: 'dark'|'light';
}


export class Settings {

    protected raw: SettingsValues = <SettingsValues>{};

    getRaw() {
        return this.raw;
    }

    protected setDefaults(settings: SettingsValues) {
        settings.alwaysOnTop = false;
        settings.theme = 'light';
    }

    load(ready) {
        this.setDefaults(this.raw);
        storage.get('settings', (err, savedSettings: SettingsValues) => {
            if (err) savedSettings = <SettingsValues>{};
            for (let attr in this.raw) {
                if ((attr in savedSettings) === false) {
                    savedSettings[attr] = this.raw[attr];
                }
            }
            this.raw = savedSettings;
            ready();
        });
    }

    save(newSettings, ready?) {
        let oldSettings = {};
        for (let attr in newSettings) {
            oldSettings[attr] = this.raw[attr];
        }
        if (JSON.stringify(newSettings) === JSON.stringify(oldSettings)) {
            console.log('no modifications')
        } else {
            console.log('modified settings!')
            for (let attr in newSettings) {
                this.raw[attr] = newSettings[attr];
            }
            this.persist();
        }
        ready && ready();
    }

    persist(ready?) {
        storage.set('settings', this.raw, (err) => {
            if (err) console.log('Err persisting settings', err);
            ready && ready(err);
        });
    }

    set(key, value) {
        this.raw[key] = value;
        this.persist();
    }

    get(key) {
        return this.raw[key];
    }


}