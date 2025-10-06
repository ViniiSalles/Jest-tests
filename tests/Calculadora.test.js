const Calculadora = require('../Calculadora');

describe('Calculadora', () => {
    let calculadora;

    beforeEach(() => {
        calculadora = new Calculadora();
    });

    describe('Operação de Soma', () => {
        test('deve somar dois números positivos corretamente', () => {
            expect(calculadora.sumar(2, 3)).toBe(5);
        });

        test('deve somar números negativos corretamente', () => {
            expect(calculadora.sumar(-2, -3)).toBe(-5);
        });

        test('deve somar número positivo com negativo corretamente', () => {
            expect(calculadora.sumar(5, -3)).toBe(2);
        });

        test('deve somar números decimais corretamente', () => {
            expect(calculadora.sumar(2.5, 3.7)).toBeCloseTo(6.2);
        });

        test('deve somar zero corretamente', () => {
            expect(calculadora.sumar(5, 0)).toBe(5);
            expect(calculadora.sumar(0, 0)).toBe(0);
        });
    });

    describe('Operação de Subtração', () => {
        test('deve subtrair dois números positivos corretamente', () => {
            expect(calculadora.restar(5, 3)).toBe(2);
        });

        test('deve subtrair números negativos corretamente', () => {
            expect(calculadora.restar(-2, -3)).toBe(1);
        });

        test('deve subtrair resultando em número negativo', () => {
            expect(calculadora.restar(3, 5)).toBe(-2);
        });

        test('deve subtrair números decimais corretamente', () => {
            expect(calculadora.restar(5.7, 2.3)).toBeCloseTo(3.4);
        });

        test('deve subtrair zero corretamente', () => {
            expect(calculadora.restar(5, 0)).toBe(5);
            expect(calculadora.restar(0, 5)).toBe(-5);
        });
    });

    describe('Operação de Multiplicação', () => {
        test('deve multiplicar dois números positivos corretamente', () => {
            expect(calculadora.multiplicar(4, 5)).toBe(20);
        });

        test('deve multiplicar números negativos corretamente', () => {
            expect(calculadora.multiplicar(-2, -3)).toBe(6);
        });

        test('deve multiplicar positivo com negativo corretamente', () => {
            expect(calculadora.multiplicar(4, -3)).toBe(-12);
        });

        test('deve multiplicar números decimais corretamente', () => {
            expect(calculadora.multiplicar(2.5, 4)).toBeCloseTo(10);
        });

        test('deve multiplicar por zero corretamente', () => {
            expect(calculadora.multiplicar(5, 0)).toBe(0);
            expect(calculadora.multiplicar(0, 5)).toBe(0);
        });

        test('deve multiplicar por um corretamente', () => {
            expect(calculadora.multiplicar(7, 1)).toBe(7);
            expect(calculadora.multiplicar(1, 7)).toBe(7);
        });
    });

    describe('Operação de Divisão', () => {
        test('deve dividir dois números positivos corretamente', () => {
            expect(calculadora.dividir(10, 2)).toBe(5);
        });

        test('deve dividir números negativos corretamente', () => {
            expect(calculadora.dividir(-10, -2)).toBe(5);
        });

        test('deve dividir positivo por negativo corretamente', () => {
            expect(calculadora.dividir(10, -2)).toBe(-5);
        });

        test('deve dividir números decimais corretamente', () => {
            expect(calculadora.dividir(7.5, 2.5)).toBeCloseTo(3);
        });

        test('deve dividir por um corretamente', () => {
            expect(calculadora.dividir(8, 1)).toBe(8);
        });

        test('deve retornar infinito ao dividir por zero', () => {
            expect(calculadora.dividir(5, 0)).toBe(Infinity);
            expect(calculadora.dividir(-5, 0)).toBe(-Infinity);
        });

        test('deve retornar NaN ao dividir zero por zero', () => {
            expect(calculadora.dividir(0, 0)).toBeNaN();
        });

        test('deve dividir zero por número diferente de zero', () => {
            expect(calculadora.dividir(0, 5)).toBe(0);
        });
    });

    describe('Casos Extremos', () => {
        test('deve lidar com números muito grandes', () => {
            const grande1 = 999999999999999;
            const grande2 = 999999999999999;
            expect(calculadora.sumar(grande1, grande2)).toBe(1999999999999998);
        });

        test('deve lidar com números muito pequenos', () => {
            const pequeno1 = 0.000000001;
            const pequeno2 = 0.000000002;
            expect(calculadora.sumar(pequeno1, pequeno2)).toBeCloseTo(0.000000003);
        });
    });
});