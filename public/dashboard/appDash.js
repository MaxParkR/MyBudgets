// ==================== DATOS INICIALES (CON MES) ==================== 
const ingresos = [
    new Ingreso('Sueldo', 2600.00, 'Ene'),
    new Ingreso('Venta coche', 1500, 'Feb'),
    new Ingreso('Bonificación', 500, 'Mar'),
    new Ingreso('Sueldo', 2600.00, 'Abr'),
    new Ingreso('Otros', 300, 'Abr')
];

const egresos = [
    new Egreso('Cuota Apartamento', 1000, 'Ene'),
    new Egreso('Ropa', 400, 'Feb'),
    new Egreso('Supermercado', 600, 'Mar'),
    new Egreso('Servicios', 350, 'Mar'),
    new Egreso('Transporte', 150, 'Abr')
];

// Variables globales para las instancias de los gráficos
let incomeMonthChartInstance = null;
let incomeExpenseChartInstance = null;
let categoryChartInstance = null;

// ==================== FUNCIONES PRINCIPALES ==================== 
/**
 * Función principal que se ejecuta al cargar la página.
 * Inicializa la carga del cabecero, listas y gráficos.
 */
const cargarApp = () => {
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
    renderCharts(); // Nueva función para renderizar todos los gráficos
    setupHeaderScroll(); // Configurar el efecto scroll del header
    setupMobileMenu(); // Llamar a la configuración del menú móvil
}

/**
 * Configura el listener para el efecto de scroll en el header.
 */
const setupHeaderScroll = () => {
    const header = document.querySelector('.header');
    // Asegurarse de que el listener no se añada múltiples veces si cargarApp se llama de nuevo
    if (header && !header.dataset.scrollListenerAttached) {
        // Forzar estado inicial sin scroll
        header.classList.remove("scrolled"); 
        
        window.addEventListener("scroll", () => {
            // Añadida verificación por si el header no existiera
            if (!header) return;
            const scrollY = window.scrollY;
            scrollY > 50
                ? header.classList.add("scrolled")
                : header.classList.remove("scrolled");
        });
        header.dataset.scrollListenerAttached = 'true';
    }
}


// ==================== CÁLCULOS Y FORMATO ==================== 
/**
 * Calcula la suma total de los valores de todos los ingresos.
 * @returns {number} El total de ingresos.
 */
const totalIngresos = () => {
    return ingresos.reduce((total, ingreso) => total + ingreso.valor, 0);
}

/**
 * Calcula la suma total de los valores de todos los egresos.
 * @returns {number} El total de egresos.
 */
const totalEgresos = () => {
    return egresos.reduce((total, egreso) => total + egreso.valor, 0);
}

/**
 * Actualiza los elementos del cabecero en el DOM con los valores calculados.
 */
const cargarCabecero = () => {
    const presupuestoTotal = totalIngresos() - totalEgresos();
    const totalIng = totalIngresos();
    const totalEgr = totalEgresos();
    const porcentajeEgreso = totalIng !== 0 ? totalEgr / totalIng : 0;

    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuestoTotal);
    document.getElementById('ingresos').innerHTML = formatoMoneda(totalIng);
    document.getElementById('egresos').innerHTML = formatoMoneda(totalEgr);
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(porcentajeEgreso);
}

/**
 * Formatea un valor numérico como moneda (COP).
 * @param {number} valor El valor a formatear.
 * @returns {string} El valor formateado como moneda.
 */
const formatoMoneda = (valor) => {
    return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
}

/**
 * Formatea un valor numérico como porcentaje.
 * @param {number} valor El valor a formatear (ej. 0.5 para 50%).
 * @returns {string} El valor formateado como porcentaje.
 */
const formatoPorcentaje = (valor) => {
    return valor.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 1 }); // Ajustado a 1 decimal
}

// ==================== MANEJO DE LISTAS (INGRESOS/EGRESOS) ==================== 
/**
 * Genera el HTML para la lista de ingresos y la inserta en el DOM.
 */
const cargarIngresos = () => {
    let ingresosHTML = '';
    for (let ingreso of ingresos) {
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresosHTML || '<p class="empty-list">No hay ingresos registrados.</p>';
}

/**
 * Crea el fragmento HTML para un único ingreso.
 * @param {Ingreso} ingreso El objeto Ingreso.
 * @returns {string} El HTML del elemento de la lista.
 */
const crearIngresoHTML = (ingreso) => {
    // Añadido el mes al lado de la descripción
    return `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${ingreso.descripcion} <span class="elemento_mes">(${ingreso.month})</span></div>
                        <div class="elemento_eliminar">
            <button class="elemento_eliminar--btn" onclick='eliminarIngreso(${ingreso.id})'>
                <ion-icon name="trash-outline"></ion-icon>
                            </button>
                        </div>
        <div class="elemento_valor">+ ${formatoMoneda(ingreso.valor)}</div>
                </div>
    `;
}

/**
 * Elimina un ingreso del arreglo 'ingresos' basado en su ID.
 * Actualiza el cabecero, la lista de ingresos y los gráficos.
 * @param {number} id El ID del ingreso a eliminar.
 */
const eliminarIngreso = (id) => {
    const indiceEliminar = ingresos.findIndex(ingreso => ingreso.id === id);
    if (indiceEliminar !== -1) {
    ingresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarIngresos();
        renderCharts(); // Actualizar gráficos
    }
}

/**
 * Genera el HTML para la lista de egresos y la inserta en el DOM.
 */
const cargarEgresos = () => {
    let egresosHTML = '';
    for (let egreso of egresos) {
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML || '<p class="empty-list">No hay egresos registrados.</p>';
}

/**
 * Crea el fragmento HTML para un único egreso.
 * @param {Egreso} egreso El objeto Egreso.
 * @returns {string} El HTML del elemento de la lista.
 */
const crearEgresoHTML = (egreso) => {
    // Nota: El porcentaje individual por egreso puede ser menos útil aquí, se quita de la lista.
    // Se podría calcular si se necesita.
    return `
    <div class="elemento limpiarEstilos">
         <div class="elemento_descripcion">${egreso.descripcion} <span class="elemento_mes">(${egreso.month})</span></div>
                        <div class="elemento_eliminar">
            <button class="elemento_eliminar--btn" onclick='eliminarEgreso(${egreso.id})'>
                <ion-icon name="trash-outline"></ion-icon>
                            </button>
                        </div>
        <div class="elemento_valor">- ${formatoMoneda(egreso.valor)}</div>
                </div>
    `;
}

/**
 * Elimina un egreso del arreglo 'egresos' basado en su ID.
 * Actualiza el cabecero, la lista de egresos y los gráficos.
 * @param {number} id El ID del egreso a eliminar.
 */
const eliminarEgreso = (id) => {
    const indiceEliminar = egresos.findIndex(egreso => egreso.id === id);
    if (indiceEliminar !== -1) {
        egresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarEgresos();
        renderCharts(); // Actualizar gráficos
    }
}

/**
 * Obtiene los datos del formulario, crea un nuevo Ingreso o Egreso,
 * lo añade al arreglo correspondiente y actualiza la interfaz.
 */
const agregarDato = () => {
    const forma = document.forms['forma'];
    const tipo = forma['tipo'].value;
    const descripcion = forma['descripcion'].value;
    const valor = forma['valor'].value;
    const mes = forma['mes'].value; // Obtener valor del mes

    // Validar que los campos no estén vacíos (incluyendo mes)
    if (descripcion.trim() !== '' && valor.trim() !== '' && mes.trim() !== '') {
        const valorNumerico = parseFloat(valor);
        // Validar que el valor sea un número positivo
        if (!isNaN(valorNumerico) && valorNumerico > 0) {
            if (tipo === 'ingreso') {
                ingresos.push(new Ingreso(descripcion, valorNumerico, mes)); // Añadir mes
        cargarCabecero();
        cargarIngresos();
            } else if (tipo === 'egreso') {
                egresos.push(new Egreso(descripcion, valorNumerico, mes)); // Añadir mes
        cargarCabecero();
        cargarEgresos();
    }
            // Limpiar formulario
            forma['descripcion'].value = '';
            forma['valor'].value = '';
            forma['mes'].value = ''; // Resetear select de mes
            renderCharts(); // Actualizar gráficos después de añadir
        } else {
            alert('Por favor, ingresa un valor numérico positivo.');
        }
    } else {
        alert('Por favor, completa todos los campos, incluyendo el mes.');
    }
}

// ==================== LÓGICA DE GRÁFICOS (Chart.js) ==================== 

/**
 * Renderiza o actualiza todos los gráficos.
 */
const renderCharts = () => {
    renderIncomeMonthChart();
    renderIncomeExpenseChart();
    renderCategoryChart();
}

/**
 * Prepara datos y renderiza/actualiza el gráfico de Ingresos por Mes.
 */
const renderIncomeMonthChart = () => {
    const ctx = document.getElementById('incomeMonthChart').getContext('2d');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const incomeByMonth = months.map(month => {
        return ingresos
            .filter(inc => inc.month === month)
            .reduce((sum, inc) => sum + inc.valor, 0);
    });

    const data = {
        labels: months,
        datasets: [{
            label: 'Ingresos por Mes',
            data: incomeByMonth,
            backgroundColor: 'rgba(123, 67, 151, 0.6)', // Color morado
            borderColor: 'rgba(123, 67, 151, 1)',
            borderWidth: 1
        }]
    };

    // Destruir gráfico anterior si existe para evitar duplicados
    if (incomeMonthChartInstance) {
        incomeMonthChartInstance.destroy();
    }

    incomeMonthChartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false // Ocultar leyenda para este gráfico
                }
            }
        }
    });
}

/**
 * Prepara datos y renderiza/actualiza el gráfico de Ingresos vs Egresos.
 */
const renderIncomeExpenseChart = () => {
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
    // Simplificación: Usaremos los meses donde hay *algún* dato
    const allMonths = [...new Set([...ingresos, ...egresos].map(d => d.month))];
    // Ordenar meses (simple, puede necesitar mejora para año completo)
    const monthOrder = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    allMonths.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)); 

    const incomeData = allMonths.map(month => ingresos.filter(i => i.month === month).reduce((sum, i) => sum + i.valor, 0));
    const expenseData = allMonths.map(month => egresos.filter(e => e.month === month).reduce((sum, e) => sum + e.valor, 0));

    const data = {
        labels: allMonths,
        datasets: [
            {
                label: 'Ingresos',
                data: incomeData,
                borderColor: 'rgb(75, 192, 192)', // Color verde/azul
                tension: 0.1
            },
            {
                label: 'Egresos',
                data: expenseData,
                borderColor: 'rgb(255, 99, 132)', // Color rojo
                tension: 0.1
            }
        ]
    };

    if (incomeExpenseChartInstance) {
        incomeExpenseChartInstance.destroy();
    }

    incomeExpenseChartInstance = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
             plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

/**
 * Prepara datos y renderiza/actualiza el gráfico de Categorías de Gasto.
 */
const renderCategoryChart = () => {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    // Agrupar egresos por descripción (simplificación, idealmente sería por categoría real)
    const expenseByCategory = egresos.reduce((acc, egreso) => {
        acc[egreso.descripcion] = (acc[egreso.descripcion] || 0) + egreso.valor;
        return acc;
    }, {});

    const labels = Object.keys(expenseByCategory);
    const dataValues = Object.values(expenseByCategory);

    const data = {
        labels: labels,
        datasets: [{
            label: 'Gastos por Categoría',
            data: dataValues,
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
            ],
            hoverOffset: 4
        }]
    };

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut', // Gráfico de dona
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom', // Leyenda abajo
                }
            }
        }
    });
}

// ==================== LÓGICA MENÚ MÓVIL ==================== 

const setupMobileMenu = () => {
    const navTrigger = document.getElementById('navTrigger');
    const navCloseBtn = document.getElementById('navCloseBtn');
    const nav = document.getElementById('nav');

    if (navTrigger && navCloseBtn && nav) {
        navTrigger.addEventListener('click', () => {
            nav.classList.add('is-open');
        });

        navCloseBtn.addEventListener('click', () => {
            nav.classList.remove('is-open');
        });

        // Opcional: Cerrar el menú si se hace clic fuera de él (en el overlay)
        // document.addEventListener('click', (event) => {
        //     if (!nav.contains(event.target) && !navTrigger.contains(event.target) && nav.classList.contains('is-open')) {
        //         nav.classList.remove('is-open');
        //     }
        // });
    }
};

// ==================== INICIALIZACIÓN ==================== 

// Asegurarse de que el DOM esté completamente cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', () => {
    cargarApp(); 
    setupMobileMenu(); // Llamar a la configuración del menú móvil
});

// Si cargarApp se llama en algún otro lugar (ej. inline script), 
// asegurar que setupMobileMenu también se llame o integrar la llamada dentro de cargarApp.
// Modifiqué cargarApp para llamar setupHeaderScroll, podríamos hacer lo mismo con setupMobileMenu
// O mantenerlo separado en DOMContentLoaded como está ahora.
