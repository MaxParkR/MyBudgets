/**
 * Clase base para representar un dato financiero con descripción y valor.
 */
class Dato{
    /**
     * @param {string} descripcion La descripción del dato.
     * @param {number} valor El valor numérico del dato.
     */
    constructor(descripcion, valor){
        this._descripcion = descripcion;
        this._valor = valor;
    }

    /**
     * Obtiene la descripción.
     * @returns {string}
     */
    get descripcion(){
        return this._descripcion;
    }

    /**
     * Establece la descripción.
     * @param {string} descripcion
     */
    set descripcion(descripcion){
        this._descripcion = descripcion;
    }

    /**
     * Obtiene el valor.
     * @returns {number}
     */
    get valor(){
        return this._valor;
    }

    /**
     * Establece el valor.
     * @param {number} valor
     */
    set valor(valor){
        this._valor = valor;
    }
}