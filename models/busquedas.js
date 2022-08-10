const fs = require('fs');

const axios = require("axios");


class Busquedas {

    historial = [];
    filePath = './Files/Lugares.json';

    constructor() {
        this.leerFile();
    }

    get historialCapitalizado() {

        return this.historial.map(texto => {
            let palabras = texto.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_TOKEN,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_TOKEN,
            'units': 'metric',
            'lang': 'es',
        }
    }

    async ciudad(lugar = '') {

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                long: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch {

            console.log(' =error== ');

            return [];
        }


    }

    async climaLugar(lat, lon) {
        try {

            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { ... this.paramsOpenWeather, lat, lon }
            });

            const response = await instance.get();
            const { weather, main } = response.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };

        } catch (err) {
            console.log(Error);
        }
    }

    agregarHistorial(lugar = '') {

        //Se validan duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) return;

        this.historial = this.historial.splice(0,9);
        
        this.historial.unshift(lugar.toLocaleLowerCase());

        //guarda en archivo
        this.guardarFile();
    }

    guardarFile() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.filePath, JSON.stringify(payload));

    }

    leerFile() {

        if (!fs.existsSync(this.filePath)) return;

        const info = fs.readFileSync(this.filePath, { encoding: 'utf-8' });
        const data = JSON.parse(info);

        this.historial = data.historial;

    }
}

module.exports = Busquedas;