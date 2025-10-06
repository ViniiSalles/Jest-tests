class Calculadora {
    sumar(num1, num2) {
        return num1 + num2;
    }

    restar(num1, num2) {
        return num1 - num2;
    }

    dividir(num1, num2) {
        return num1 / num2;
    }

    multiplicar(num1, num2) {
        return num1 * num2;
    }
}

// Exportar para Node.js se module estiver disponível
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculadora;
} 