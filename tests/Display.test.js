/**
 * @jest-environment jsdom
 */

const Display = require('../Display');

describe('Display', () => {
    let display;
    let mockDisplayValorAnterior;
    let mockDisplayValorActual;

    beforeEach(() => {
        // Criar elementos DOM mockados
        document.body.innerHTML = `
            <div id="valor-anterior"></div>
            <div id="valor-actual"></div>
        `;

        mockDisplayValorAnterior = document.getElementById('valor-anterior');
        mockDisplayValorActual = document.getElementById('valor-actual');
        
        display = new Display(mockDisplayValorAnterior, mockDisplayValorActual);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('Inicialização', () => {
        test('deve inicializar com valores vazios', () => {
            expect(display.valorActual).toBe('');
            expect(display.valorAnterior).toBe('');
            expect(display.tipoOperacion).toBeUndefined();
        });

        test('deve ter os signos das operações corretos', () => {
            expect(display.signos.sumar).toBe('+');
            expect(display.signos.restar).toBe('-');
            expect(display.signos.multiplicar).toBe('x');
            expect(display.signos.dividir).toBe('%');
        });

        test('deve ter uma instância da calculadora', () => {
            expect(display.calculador).toBeDefined();
        });
    });

    describe('Adicionar Números', () => {
        test('deve adicionar um número ao valor atual', () => {
            display.agregarNumero('5');
            expect(display.valorActual).toBe('5');
        });

        test('deve concatenar múltiplos números', () => {
            display.agregarNumero('1');
            display.agregarNumero('2');
            display.agregarNumero('3');
            expect(display.valorActual).toBe('123');
        });

        test('deve adicionar ponto decimal', () => {
            display.agregarNumero('5');
            display.agregarNumero('.');
            display.agregarNumero('2');
            expect(display.valorActual).toBe('5.2');
        });

        test('não deve adicionar segundo ponto decimal', () => {
            display.agregarNumero('5');
            display.agregarNumero('.');
            display.agregarNumero('2');
            display.agregarNumero('.'); // Este ponto não deve ser adicionado
            display.agregarNumero('3');
            expect(display.valorActual).toBe('5.23');
        });

        test('deve atualizar o display após adicionar número', () => {
            display.agregarNumero('7');
            expect(mockDisplayValorActual.textContent).toBe('7');
        });
    });

    describe('Operações', () => {
        test('deve definir tipo de operação', () => {
            display.valorActual = '5';
            display.computar('sumar');
            expect(display.tipoOperacion).toBe('sumar');
        });

        test('deve mover valor atual para anterior ao definir operação', () => {
            display.valorActual = '5';
            display.computar('sumar');
            expect(display.valorAnterior).toBe('5');
            expect(display.valorActual).toBe('');
        });

        test('deve atualizar display com operação', () => {
            display.valorActual = '5';
            display.computar('sumar');
            expect(mockDisplayValorAnterior.textContent).toBe('5 +');
        });

        test('deve calcular operação existente antes de definir nova', () => {
            display.valorActual = '5';
            display.computar('sumar');
            display.valorActual = '3';
            display.computar('multiplicar');
            
            expect(display.valorAnterior).toBe(8); // 5 + 3 = 8 (resultado é número)
            expect(display.tipoOperacion).toBe('multiplicar');
        });
    });

    describe('Cálculos', () => {
        test('deve calcular soma corretamente', () => {
            display.valorAnterior = '5';
            display.valorActual = '3';
            display.tipoOperacion = 'sumar';
            display.calcular();
            expect(display.valorActual).toBe(8);
        });

        test('deve calcular subtração corretamente', () => {
            display.valorAnterior = '10';
            display.valorActual = '4';
            display.tipoOperacion = 'restar';
            display.calcular();
            expect(display.valorActual).toBe(6);
        });

        test('deve calcular multiplicação corretamente', () => {
            display.valorAnterior = '6';
            display.valorActual = '7';
            display.tipoOperacion = 'multiplicar';
            display.calcular();
            expect(display.valorActual).toBe(42);
        });

        test('deve calcular divisão corretamente', () => {
            display.valorAnterior = '15';
            display.valorActual = '3';
            display.tipoOperacion = 'dividir';
            display.calcular();
            expect(display.valorActual).toBe(5);
        });

        test('não deve calcular com valores inválidos', () => {
            display.valorAnterior = 'abc';
            display.valorActual = '5';
            display.tipoOperacion = 'sumar';
            const valorOriginal = display.valorActual;
            display.calcular();
            expect(display.valorActual).toBe(valorOriginal);
        });
    });

    describe('Operação Igual', () => {
        test('deve executar cálculo ao pressionar igual', () => {
            display.valorAnterior = '8';
            display.valorActual = '2';
            display.tipoOperacion = 'dividir';
            display.computar('igual');
            expect(display.valorAnterior).toBe(4); // O resultado fica em valorAnterior
            expect(display.valorActual).toBe(''); // valorActual é limpo
        });

        test('não deve calcular novamente se operação já for igual', () => {
            display.valorAnterior = '5';
            display.valorActual = '3';
            display.tipoOperacion = 'igual';
            display.computar('igual');
            // Ao computar 'igual', valorActual sempre é limpo, independente da operação anterior
            expect(display.valorActual).toBe('');
            expect(display.valorAnterior).toBe('3'); // valorAnterior recebe o valorActual
        });
    });

    describe('Funcionalidades de Limpeza', () => {
        test('deve apagar último dígito', () => {
            display.valorActual = '123';
            display.borrar();
            expect(display.valorActual).toBe('12');
        });

        test('deve lidar com valor vazio ao apagar', () => {
            display.valorActual = '';
            display.borrar();
            expect(display.valorActual).toBe('');
        });

        test('deve apagar um caractere de valor com um dígito', () => {
            display.valorActual = '5';
            display.borrar();
            expect(display.valorActual).toBe('');
        });

        test('deve limpar tudo com borrarTodo', () => {
            display.valorActual = '123';
            display.valorAnterior = '456';
            display.tipoOperacion = 'sumar';
            display.borrarTodo();
            
            expect(display.valorActual).toBe('');
            expect(display.valorAnterior).toBe('');
            expect(display.tipoOperacion).toBeUndefined();
        });

        test('deve atualizar display após limpar tudo', () => {
            display.valorActual = '123';
            display.borrarTodo();
            expect(mockDisplayValorActual.textContent).toBe('');
            expect(mockDisplayValorAnterior.textContent).toBe(' ');
        });
    });

    describe('Atualização do Display', () => {
        test('deve imprimir valores no display corretamente', () => {
            display.valorActual = '42';
            display.valorAnterior = '7';
            display.tipoOperacion = 'multiplicar';
            display.imprimirValores();
            
            expect(mockDisplayValorActual.textContent).toBe('42');
            expect(mockDisplayValorAnterior.textContent).toBe('7 x');
        });

        test('deve mostrar display vazio quando não há operação', () => {
            display.valorActual = '42';
            display.valorAnterior = '7';
            display.tipoOperacion = undefined;
            display.imprimirValores();
            
            expect(mockDisplayValorActual.textContent).toBe('42');
            expect(mockDisplayValorAnterior.textContent).toBe('7 ');
        });
    });

    describe('Cenários Complexos', () => {
        test('deve executar sequência de operações corretamente', () => {
            // Simular: 2 + 3 * 4 = 20 (não 14, porque calculadora resolve da esquerda para direita)
            display.agregarNumero('2');
            display.computar('sumar');
            display.agregarNumero('3');
            display.computar('multiplicar'); // Aqui deve calcular 2+3=5
            display.agregarNumero('4');
            display.computar('igual'); // Aqui deve calcular 5*4=20
            
            // Após computar 'igual', o resultado fica em valorAnterior e valorActual é limpo
            expect(display.valorAnterior).toBe(20);
            expect(display.valorActual).toBe('');
        });

        test('deve lidar com operação seguida de igual', () => {
            display.agregarNumero('10');
            display.computar('dividir');
            display.agregarNumero('2');
            display.computar('igual');
            
            // Após igual, resultado fica em valorAnterior e valorActual é limpo
            expect(display.valorAnterior).toBe(5);
            expect(display.valorActual).toBe('');
            expect(display.tipoOperacion).toBe('igual');
        });
    });
});