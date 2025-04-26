/**
 * Clase que representa un egreso, hereda de Dato.
 * Asigna un ID único a cada egreso.
 */
class Egreso extends Dato{
    static contadorEgresos = 0;

    /**
     * @param {string} descripcion Descripción del egreso.
     * @param {number} valor Valor del egreso.
     * @param {string} month Mes del egreso.
     */
    constructor(descripcion, valor, month){
        super(descripcion, valor, month);
        this._id = ++Egreso.contadorEgresos;
    }

    /**
     * Obtiene el ID único del egreso.
     * @returns {number}
     */
    get id(){
        return this._id;
    }
}