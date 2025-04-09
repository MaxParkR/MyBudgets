// Arreglos iniciales con datos de ejemplo
const ingresos = [
    new Ingreso('Sueldo',2600.00),
    new Ingreso('venta coche', 1500)
];

const egresos = [
    new Egreso('Cuota Apartamento',1000),
    new Egreso('Ropa', 400)
]

/**
 * Función principal que se ejecuta al cargar la página.
 * Inicializa la carga del cabecero y las listas de ingresos/egresos.
 */
let cargarApp = ()=>{
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
}

/**
 * Calcula la suma total de los valores de todos los ingresos.
 * @returns {number} El total de ingresos.
 */
let totalIngresos = () =>{
    let totalIngreso = 0;
    for(let ingreso of ingresos){
        totalIngreso += ingreso.valor;
    }
    return totalIngreso;
}

/**
 * Calcula la suma total de los valores de todos los egresos.
 * @returns {number} El total de egresos.
 */
let totalEgresos = () =>{
    let totalEgreso = 0;
    for(let egreso of egresos){
        totalEgreso += egreso.valor;
    }
    return totalEgreso;
} 

/**
 * Actualiza los elementos del cabecero en el DOM con los valores calculados.
 * (Presupuesto total, total ingresos, total egresos, porcentaje de egreso).
 */
let cargarCabecero = () =>{
    let presupuesto = totalIngresos() - totalEgresos();
    // Manejar división por cero si no hay ingresos
    let porcentajeEgreso = totalIngresos() !== 0 ? totalEgresos()/totalIngresos() : 0;
    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(porcentajeEgreso);
    document.getElementById('ingresos').innerHTML = formatoMoneda(totalIngresos());
    document.getElementById('egresos').innerHTML = formatoMoneda(totalEgresos());
}

/**
 * Formatea un valor numérico como moneda (Peso Colombiano COP).
 * @param {number} valor El valor a formatear.
 * @returns {string} El valor formateado como moneda.
 */
const formatoMoneda = (valor)=>{
    // Asegurar que minimunFractionDigits se escriba correctamente
    return valor.toLocaleString('es-CO', {style:'currency', currency:'COP', minimumFractionDigits:0});
}

/**
 * Formatea un valor numérico como porcentaje.
 * @param {number} valor El valor a formatear (ej. 0.5 para 50%).
 * @returns {string} El valor formateado como porcentaje.
 */
const formatoPorcentaje = (valor)=>{
    // Asegurar que minimunFractionDigits se escriba correctamente
    return valor.toLocaleString('en-US',{style:'percent', minimumFractionDigits:2});
}

/**
 * Genera el HTML para la lista de ingresos y la inserta en el DOM.
 */
const cargarIngresos = ()=>{
    let ingresosHTML = '';
    for(let ingreso of ingresos){
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresosHTML;
}

/**
 * Crea el fragmento HTML para un único ingreso.
 * @param {Ingreso} ingreso El objeto Ingreso.
 * @returns {string} El HTML del elemento de la lista.
 */
const crearIngresoHTML =(ingreso)=>{
    let ingresoHTML = `
    <div class="elemento limpiarEstilos">
                    <div class="elemento_descripcion">${ingreso.descripcion}</div>
                    <div class="derecha limpiarEstilos">
                        <div class="elemento_valor">+ ${formatoMoneda(ingreso.valor)}</div>
                        <div class="elemento_eliminar">
                            <button class="elemento_eliminar--btn">
                                <ion-icon name="trash-outline"
                                onclick ='eliminarIngreso(${ingreso.id})'></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
    `;
    return ingresoHTML;
}

/**
 * Elimina un ingreso del arreglo 'ingresos' basado en su ID.
 * Actualiza el cabecero y la lista de ingresos.
 * @param {number} id El ID del ingreso a eliminar.
 */
const eliminarIngreso = (id) =>{
    let indiceEliminar = ingresos.findIndex( ingreso => ingreso.id === id);
    // Verificar si se encontró el índice antes de eliminar
    if (indiceEliminar !== -1) {
        ingresos.splice(indiceEliminar, 1);
        cargarCabecero();
        cargarIngresos();
    }
}

/**
 * Genera el HTML para la lista de egresos y la inserta en el DOM.
 */
const cargarEgresos = ()=>{
    let egresosHTML = '';
    for(let egreso of egresos){
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML;
}

/**
 * Crea el fragmento HTML para un único egreso.
 * @param {Egreso} egreso El objeto Egreso.
 * @returns {string} El HTML del elemento de la lista.
 */
const crearEgresoHTML =(egreso)=>{
    // Manejar división por cero si no hay egresos totales
    const porcentaje = totalEgresos() !== 0 ? formatoPorcentaje(egreso.valor/totalEgresos()) : formatoPorcentaje(0);
    let egresoHTML = `
    <div class="elemento limpiarEstilos">
                    <div class="elemento_descripcion">${egreso.descripcion}</div>
                    <div class="derecha limpiarEstilos">
                        <div class="elemento_valor">- ${formatoMoneda(egreso.valor)}</div>
                        <div class="elemento_porcentaje">${porcentaje}</div>
                        <div class="elemento_eliminar">
                            <button class = "elemento_eliminar--btn">
                                <ion-icon name="trash-outline"
                                onclick ='eliminarEgreso(${egreso.id})'></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
    `;
    return egresoHTML;
}

/**
 * Elimina un egreso del arreglo 'egresos' basado en su ID.
 * Actualiza el cabecero y la lista de egresos.
 * @param {number} id El ID del egreso a eliminar.
 */
const eliminarEgreso = (id) =>{
    let indiceEliminar = egresos.findIndex(egreso => egreso.id === id);
    // Verificar si se encontró el índice antes de eliminar
    if (indiceEliminar !== -1) {
        egresos.splice(indiceEliminar,1);
        cargarCabecero();
        cargarEgresos();
    }
}

/**
 * Obtiene los datos del formulario, crea un nuevo Ingreso o Egreso,
 * lo añade al arreglo correspondiente y actualiza la interfaz.
 */
const agregarDato = ()=>{
 let forma = document.forms['forma'];
 let tipo = forma['tipo'];
 let descripcion = forma['descripcion'];
 let valor = forma['valor'];
 // Validar que los campos no estén vacíos
 if(descripcion.value.trim() !== '' && valor.value.trim() !== ''){
    // Convertir valor a número
    const valorNumerico = parseFloat(valor.value);
    // Validar que el valor sea un número positivo
    if (!isNaN(valorNumerico) && valorNumerico > 0) {
        if(tipo.value === 'ingreso'){
            ingresos.push(new Ingreso(descripcion.value, valorNumerico));
            cargarCabecero();
            cargarIngresos();
        }
        else if(tipo.value === 'egreso'){
            egresos.push(new Egreso(descripcion.value, valorNumerico));
            cargarCabecero();
            cargarEgresos();
        }
        // Limpiar formulario
        descripcion.value = '';
        valor.value = '';
    } else {
        alert('Por favor, ingresa un valor numérico positivo.');
    }
 } else {
    alert('Por favor, completa todos los campos.');
 }
}
