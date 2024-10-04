async function obtenerDatosNutricionales(item) {
    try {
        const response = await fetch(`https://api.nutritionix.com/v1_1/search/${item}?results=0:1&fields=item_name,nf_calories&appId=f3942694&appKey=4197e34594a59e6c78ad9ce583cf93fa`);
        const data = await response.json();
        return data.hits[0].fields; 
    } catch (error) {
        console.error("Error al obtener datos de la API", error);
    }
}

function calcularCalorias(peso, altura, edad, actividad) {
    const bmr = (peso * 10) + (altura * 6.25) - (edad * 5) + 5; 
    return bmr * actividad;
}

function calcularAgua(peso) {    
    const aguaEnLitros = peso * 0.03; 
    return aguaEnLitros;
}

function generarGrafico(caloriasTotales, caloriasBMR, caloriasActividad) {
    const ctx = document.getElementById('graficoCalorias').getContext('2d');
    const datos = {
        labels: ['Calorías Totales', 'BMR', 'Actividad'],
        datasets: [{
            label: 'Calorías Diarias',
            data: [caloriasTotales, caloriasBMR, caloriasActividad],
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1
        }]
    };
    const config = {
        type: 'bar',
        data: datos,
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    };
    new Chart(ctx, config);
}

function validarEntrada(peso, altura, edad, actividad) {
    if (isNaN(peso) || isNaN(altura) || isNaN(edad) || isNaN(actividad)) {
        return "Por favor, ingresa valores válidos.";
    }
    return null;
}

document.getElementById('calcular').addEventListener('click', async () => {
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const edad = parseInt(document.getElementById('edad').value);
    const actividad = parseFloat(document.getElementById('actividad').value);

    // Validar la entrada
    const errorMensaje = validarEntrada(peso, altura, edad, actividad);
    if (errorMensaje) {
        document.getElementById('resultados').innerText = errorMensaje;
        return;
    }

    const caloriasTotales = calcularCalorias(peso, altura, edad, actividad);
    const caloriasBMR = (peso * 10) + (altura * 6.25) - (edad * 5) + 5;
    const caloriasActividad = caloriasBMR * actividad;

    document.getElementById('resultados').innerText = `Calorías Diarias: ${Math.round(caloriasTotales)}`;

    const aguaRecomendada = calcularAgua(peso);
    document.getElementById('aguaRecomendada').innerText = `Ingesta de agua recomendada: ${aguaRecomendada.toFixed(2)} litros`;

    const datosNutricionales = await obtenerDatosNutricionales('apple');
    if (datosNutricionales) {
        const { nf_calories } = datosNutricionales; // Usando destructuring
        document.getElementById('resultados').innerHTML += `<br>Calorías de una manzana: ${nf_calories}`;
    }

    generarGrafico(Math.round(caloriasTotales), Math.round(caloriasBMR), Math.round(caloriasActividad));
});

function evaluarSalud(sueño, estres, actividadFisica) {
    let mensaje = "Tu evaluación de salud es: ";

    const evaluaciones = [
        { condicion: sueño < 7, mensaje: "- Intenta dormir al menos 7 horas para mejorar tu salud." },
        { condicion: sueño >= 7, mensaje: "- Buen trabajo! Estás durmiendo lo suficiente." },
        { condicion: estres > 7, mensaje: "- Considera técnicas de relajación para manejar el estrés." },
        { condicion: estres <= 7, mensaje: "- Mantén tu nivel de estrés bajo control." },
        { condicion: actividadFisica < 3, mensaje: "- Intenta hacer ejercicio al menos 3 días a la semana." },
        { condicion: actividadFisica >= 3, mensaje: "- ¡Excelente! Estás manteniendo una buena rutina de ejercicio." },
    ];

    evaluaciones.forEach(e => {
        if (e.condicion) {
            mensaje += `<br>${e.mensaje}`;
        }
    });

    return mensaje;
}

document.getElementById('evaluarSalud').addEventListener('click', () => {
    const sueño = parseInt(document.getElementById('sueño').value);
    const estres = parseInt(document.getElementById('estres').value);
    const actividadFisica = parseInt(document.getElementById('actividadFisica').value);

    // Validar la entrada
    const errorMensaje = validarEntrada(sueño, estres, actividadFisica, 0); // Usamos 0 para actividad como dummy
    if (errorMensaje) {
        document.getElementById('resultadoEvaluacion').innerText = errorMensaje;
        return;
    }

    // Evaluar salud y mostrar el resultado
    const resultado = evaluarSalud(sueño, estres, actividadFisica);
    document.getElementById('resultadoEvaluacion').innerHTML = resultado;
});

