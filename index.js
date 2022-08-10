require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();

        switch (opt) {

            case 1:
                //Mostrar mensaje pantall
                const busqueda = await leerInput('ciudad: ');

                //Buscar lugares
                const lugares = await busquedas.ciudad(busqueda);

                //Selecciona lugar
                const idSeleccion = await listarLugares(lugares);

                if(idSeleccion === '0' ) continue;

                const lugarSeleccionado = lugares.find(l => l.id === idSeleccion);

                 //Guardar en archivo
                 busquedas.agregarHistorial(lugarSeleccionado.nombre);

                //datos de clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.long);

                //mostrar resultados
                console.clear();
                console.log('\n informacion de la ciudad \n'.green);
                console.log('ciudad:', lugarSeleccionado.nombre.green)
                console.log('Lat:', lugarSeleccionado.lat)
                console.log('Lonitud:', lugarSeleccionado.long)
                console.log('Descripcion:',clima.desc.green)
                console.log('Temperatura:',clima.temp)
                console.log('Minima:',clima.min)
                console.log('Maxima:',clima.max)

                break;

                case 2:

                busquedas.historialCapitalizado.forEach(( lugar, i )=>{
                    const idx = `${i+1}`.green;
                    console.log(`${idx} ${lugar}`);
                });
                
                break;

        }

        if (opt !== 0) await pausa();

    } while (opt != 0);

}

main();