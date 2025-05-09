/**
 * Clase que representa un ingreso, hereda de Dato.
 * Asigna un ID único a cada ingreso.
 */
class Ingreso extends Dato{
    static contadorIngresos = 0;
    
    /**
     * @param {string} descripcion Descripción del ingreso.
     * @param {number} valor Valor del ingreso.
     * @param {string} month Mes del ingreso.
     */
    constructor(descripcion, valor, month){
        super(descripcion, valor, month);
        this._id = ++Ingreso.contadorIngresos;
    }

    /**
     * Obtiene el ID único del ingreso.
     * @returns {number}
     */
    get id(){
        return this._id;
    }
}