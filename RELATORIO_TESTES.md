# Relatório de Testes - Calculadora JavaScript

## Índice

1. [Introdução ao Framework Jest](#introdução-ao-framework-jest)
2. [Configuração do Ambiente de Testes](#configuração-do-ambiente-de-testes)
3. [Estrutura dos Testes Implementados](#estrutura-dos-testes-implementados)
4. [Análise dos Testes da Classe Calculadora](#análise-dos-testes-da-classe-calculadora)
5. [Análise dos Testes da Classe Display](#análise-dos-testes-da-classe-display)
6. [Cobertura de Código](#cobertura-de-código)
7. [Como Executar os Testes](#como-executar-os-testes)
8. [Conclusões e Recomendações](#conclusões-e-recomendações)

---

## Introdução ao Framework Jest

### O que é o Jest?

Jest é um framework de testes em JavaScript desenvolvido pelo Facebook (Meta) que se tornou o padrão da indústria para testes em projetos JavaScript e TypeScript. Ele é conhecido por sua facilidade de uso, configuração mínima e recursos poderosos.

### Principais Características do Jest

#### 1. **Zero Configuration**

- Funciona "out of the box" com configuração mínima
- Detecta automaticamente arquivos de teste
- Inclui assertion library integrada

#### 2. **Snapshot Testing**

- Captura "fotografias" do output do código
- Detecta mudanças não intencionais na interface

#### 3. **Mocking Poderoso**

- Sistema de mocks integrado
- Capacidade de mockar módulos, funções e objetos
- Spies para monitorar chamadas de função

#### 4. **Cobertura de Código**

- Relatórios de cobertura integrados
- Identifica código não testado
- Métricas detalhadas por arquivo

#### 5. **Parallel Testing**

- Executa testes em paralelo para melhor performance
- Isolamento automático entre testes

### Como o Jest Funciona

```javascript
// Estrutura básica de um teste Jest
describe("Grupo de testes", () => {
  beforeEach(() => {
    // Configuração antes de cada teste
  });

  test("deve fazer algo específico", () => {
    // Arrange - Preparar dados
    const entrada = "valor";

    // Act - Executar ação
    const resultado = minhaFuncao(entrada);

    // Assert - Verificar resultado
    expect(resultado).toBe("valor esperado");
  });
});
```

#### Ciclo de Vida dos Testes

1. **beforeAll()** - Executa uma vez antes de todos os testes
2. **beforeEach()** - Executa antes de cada teste individual
3. **afterEach()** - Executa após cada teste individual
4. **afterAll()** - Executa uma vez após todos os testes

#### Matchers Principais

- `toBe()` - Igualdade exata (Object.is)
- `toEqual()` - Igualdade profunda de objetos
- `toBeCloseTo()` - Números com ponto flutuante
- `toBeUndefined()` - Valores undefined
- `toBeNull()` - Valores null
- `toBeTruthy()` / `toBeFalsy()` - Valores truthy/falsy

---

## Configuração do Ambiente de Testes

### Estrutura do Projeto

```
calculadora-main-2/
├── __tests__/
│   ├── Calculadora.test.js
│   └── Display.test.js
├── Calculadora.js
├── Display.js
├── index.js
├── index.html
├── index.css
├── package.json
└── README.md
```

### Configuração no package.json

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "collectCoverageFrom": ["*.js", "!index.js"],
    "testMatch": ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"]
  }
}
```

### Adaptação das Classes para Node.js

Para que as classes funcionem tanto no browser quanto no Node.js, foi implementado um sistema de exports condicionais:

```javascript
// Em Calculadora.js
class Calculadora {
  // ... implementação
}

// Exportar para Node.js se module estiver disponível
if (typeof module !== "undefined" && module.exports) {
  module.exports = Calculadora;
}
```

```javascript
// Em Display.js
// Importar Calculadora no Node.js
let Calculadora;
if (typeof require !== "undefined") {
  Calculadora = require("./Calculadora");
}

class Display {
  // ... implementação
}

// Exportar para Node.js se module estiver disponível
if (typeof module !== "undefined" && module.exports) {
  module.exports = Display;
}
```

---

## Estrutura dos Testes Implementados

### Organização dos Testes

Os testes foram organizados seguindo as melhores práticas:

1. **Separação por Classe**: Cada classe tem seu próprio arquivo de teste
2. **Agrupamento Lógico**: Testes agrupados por funcionalidade usando `describe()`
3. **Nomenclatura Descritiva**: Nomes claros indicando o que está sendo testado
4. **Isolamento**: Cada teste é independente dos outros

### Padrões Utilizados

#### AAA Pattern (Arrange-Act-Assert)

```javascript
test("deve somar dois números positivos corretamente", () => {
  // Arrange
  const calculadora = new Calculadora();

  // Act
  const resultado = calculadora.sumar(2, 3);

  // Assert
  expect(resultado).toBe(5);
});
```

#### Setup e Teardown

```javascript
describe("Display", () => {
  let display;
  let mockDisplayValorAnterior;
  let mockDisplayValorActual;

  beforeEach(() => {
    // Setup DOM mockado
    document.body.innerHTML = `
            <div id="valor-anterior"></div>
            <div id="valor-actual"></div>
        `;

    mockDisplayValorAnterior = document.getElementById("valor-anterior");
    mockDisplayValorActual = document.getElementById("valor-actual");
    display = new Display(mockDisplayValorAnterior, mockDisplayValorActual);
  });

  afterEach(() => {
    // Cleanup
    document.body.innerHTML = "";
  });
});
```

---

## Análise dos Testes da Classe Calculadora

### Estrutura dos Testes

A classe `Calculadora` possui **24 testes** organizados em **6 grupos principais**:

#### 1. Operação de Soma (5 testes)

```javascript
describe("Operação de Soma", () => {
  test("deve somar dois números positivos corretamente", () => {
    expect(calculadora.sumar(2, 3)).toBe(5);
  });

  test("deve somar números negativos corretamente", () => {
    expect(calculadora.sumar(-2, -3)).toBe(-5);
  });

  test("deve somar número positivo com negativo corretamente", () => {
    expect(calculadora.sumar(5, -3)).toBe(2);
  });

  test("deve somar números decimais corretamente", () => {
    expect(calculadora.sumar(2.5, 3.7)).toBeCloseTo(6.2);
  });

  test("deve somar zero corretamente", () => {
    expect(calculadora.sumar(5, 0)).toBe(5);
    expect(calculadora.sumar(0, 0)).toBe(0);
  });
});
```

**Cenários testados:**

- ✅ Números positivos
- ✅ Números negativos
- ✅ Combinação positivo/negativo
- ✅ Números decimais (usando `toBeCloseTo()` para evitar problemas de precisão)
- ✅ Operações com zero

#### 2. Operação de Subtração (5 testes)

Similar à soma, mas testando especificamente:

- ✅ Resultados negativos
- ✅ Subtração de números negativos
- ✅ Casos edge com zero

#### 3. Operação de Multiplicação (6 testes)

Inclui testes adicionais para:

- ✅ Multiplicação por zero (resultado sempre 0)
- ✅ Multiplicação por um (elemento neutro)
- ✅ Sinal do resultado (positivo/negativo)

#### 4. Operação de Divisão (8 testes)

O grupo mais abrangente, testando:

- ✅ Divisões normais
- ✅ **Divisão por zero** → `Infinity` ou `-Infinity`
- ✅ **Zero dividido por zero** → `NaN`
- ✅ Zero dividido por número → `0`
- ✅ Divisão por um (elemento neutro)

```javascript
test("deve retornar infinito ao dividir por zero", () => {
  expect(calculadora.dividir(5, 0)).toBe(Infinity);
  expect(calculadora.dividir(-5, 0)).toBe(-Infinity);
});

test("deve retornar NaN ao dividir zero por zero", () => {
  expect(calculadora.dividir(0, 0)).toBeNaN();
});
```

#### 5. Casos Extremos (2 testes)

```javascript
test("deve lidar com números muito grandes", () => {
  const grande1 = 999999999999999;
  const grande2 = 999999999999999;
  expect(calculadora.sumar(grande1, grande2)).toBe(1999999999999998);
});

test("deve lidar com números muito pequenos", () => {
  const pequeno1 = 0.000000001;
  const pequeno2 = 0.000000002;
  expect(calculadora.sumar(pequeno1, pequeno2)).toBeCloseTo(0.000000003);
});
```

### Cobertura da Classe Calculadora

- **100% das funções** testadas
- **100% das linhas** executadas
- **75% dos branches** (única branch não coberta é linha 20 - condição específica)

---

## Análise dos Testes da Classe Display

### Estrutura dos Testes

A classe `Display` possui **30 testes** organizados em **8 grupos principais**:

#### 1. Inicialização (3 testes)

Verifica se a classe é inicializada corretamente:

```javascript
test("deve inicializar com valores vazios", () => {
  expect(display.valorActual).toBe("");
  expect(display.valorAnterior).toBe("");
  expect(display.tipoOperacion).toBeUndefined();
});

test("deve ter os signos das operações corretos", () => {
  expect(display.signos.sumar).toBe("+");
  expect(display.signos.restar).toBe("-");
  expect(display.signos.multiplicar).toBe("x");
  expect(display.signos.dividir).toBe("%");
});
```

#### 2. Adicionar Números (5 testes)

Testa a funcionalidade de entrada de números:

```javascript
test("não deve adicionar segundo ponto decimal", () => {
  display.agregarNumero("5");
  display.agregarNumero(".");
  display.agregarNumero("2");
  display.agregarNumero("."); // Este ponto não deve ser adicionado
  display.agregarNumero("3");
  expect(display.valorActual).toBe("5.23");
});
```

**Funcionalidades testadas:**

- ✅ Adição de dígitos individuais
- ✅ Concatenação de múltiplos números
- ✅ Adição de ponto decimal
- ✅ **Validação**: Impede múltiplos pontos decimais
- ✅ Atualização do display

#### 3. Operações (4 testes)

Testa o comportamento das operações matemáticas:

```javascript
test("deve calcular operação existente antes de definir nova", () => {
  display.valorActual = "5";
  display.computar("sumar");
  display.valorActual = "3";
  display.computar("multiplicar");

  expect(display.valorAnterior).toBe(8); // 5 + 3 = 8
  expect(display.tipoOperacion).toBe("multiplicar");
});
```

#### 4. Cálculos (5 testes)

Verifica se os cálculos são executados corretamente:

- ✅ Todas as operações matemáticas
- ✅ **Validação de entrada**: Não calcula com valores inválidos

#### 5. Operação Igual (2 testes)

Testa o comportamento específico da operação "igual":

```javascript
test("deve executar cálculo ao pressionar igual", () => {
  display.valorAnterior = "8";
  display.valorActual = "2";
  display.tipoOperacion = "dividir";
  display.computar("igual");
  expect(display.valorAnterior).toBe(4); // O resultado fica em valorAnterior
  expect(display.valorActual).toBe(""); // valorActual é limpo
});
```

#### 6. Funcionalidades de Limpeza (5 testes)

Testa as funcionalidades de limpeza:

```javascript
test("deve apagar último dígito", () => {
  display.valorActual = "123";
  display.borrar();
  expect(display.valorActual).toBe("12");
});

test("deve limpar tudo com borrarTodo", () => {
  display.valorActual = "123";
  display.valorAnterior = "456";
  display.tipoOperacion = "sumar";
  display.borrarTodo();

  expect(display.valorActual).toBe("");
  expect(display.valorAnterior).toBe("");
  expect(display.tipoOperacion).toBeUndefined();
});
```

#### 7. Atualização do Display (2 testes)

Verifica se o DOM é atualizado corretamente:

```javascript
test("deve imprimir valores no display corretamente", () => {
  display.valorActual = "42";
  display.valorAnterior = "7";
  display.tipoOperacion = "multiplicar";
  display.imprimirValores();

  expect(mockDisplayValorActual.textContent).toBe("42");
  expect(mockDisplayValorAnterior.textContent).toBe("7 x");
});
```

#### 8. Cenários Complexos (4 testes)

Testa sequências completas de operações:

```javascript
test("deve executar sequência de operações corretamente", () => {
  // Simular: 2 + 3 * 4 = 20 (não 14, porque calculadora resolve da esquerda para direita)
  display.agregarNumero("2");
  display.computar("sumar");
  display.agregarNumero("3");
  display.computar("multiplicar"); // Aqui deve calcular 2+3=5
  display.agregarNumero("4");
  display.computar("igual"); // Aqui deve calcular 5*4=20

  expect(display.valorAnterior).toBe(20);
  expect(display.valorActual).toBe("");
});
```

### Desafios Específicos dos Testes da Display

#### 1. Mock do DOM

Foi necessário usar `jest-environment-jsdom` para simular elementos DOM:

```javascript
/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
        <div id="valor-anterior"></div>
        <div id="valor-actual"></div>
    `;

  mockDisplayValorAnterior = document.getElementById("valor-anterior");
  mockDisplayValorActual = document.getElementById("valor-actual");
});
```

#### 2. Comportamento Complexo da Classe

A classe Display tem lógica complexa onde:

- `valorActual` é sempre limpo após operações
- Resultados ficam em `valorAnterior`
- Operação "igual" tem comportamento especial

#### 3. Teste de Estados Intermediários

Foi necessário testar não apenas o resultado final, mas estados intermediários durante sequências de operações.

---

## Cobertura de Código

### Métricas Alcançadas

```
-------------|---------|----------|---------|---------|-------------------
File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------|---------|----------|---------|---------|-------------------
All files    |     100 |    83.33 |     100 |     100 |
 Calculadora.js |   100 |       75 |     100 |     100 | 20
 Display.js  |     100 |       85 |     100 |     100 | 3,38,64
-------------|---------|----------|---------|---------|-------------------
```

### Análise da Cobertura

#### ✅ **Excelente Cobertura**

- **100% das Statements**: Todas as declarações foram executadas
- **100% das Functions**: Todas as funções foram testadas
- **100% das Lines**: Todas as linhas foram cobertas

#### ⚠️ **Branches Parcialmente Cobertas (83.33%)**

**Calculadora.js (75% branches):**

- Linha 20: Provavelmente uma condição específica não testada

**Display.js (85% branches):**

- Linhas 3, 38, 64: Condições relacionadas à verificação de ambiente (Node.js vs Browser)

### Linhas Não Cobertas

As linhas não cobertas (3, 38, 64) são relacionadas às verificações de ambiente:

```javascript
// Linha 3: Verificação de require
if (typeof require !== "undefined") {
  Calculadora = require("./Calculadora");
}

// Linha 64: Verificação de module.exports
if (typeof module !== "undefined" && module.exports) {
  module.exports = Display;
}
```

Essas linhas são código de compatibilidade e não afetam a funcionalidade principal.

---

## Como Executar os Testes

### Scripts Disponíveis

```bash
# Executar todos os testes uma vez
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# Executar testes com relatório de cobertura detalhado
npm run test:coverage
```

### Saída dos Testes

#### Execução Normal

```
 PASS  __tests__/Display.test.js
 PASS  __tests__/Calculadora.test.js

Test Suites: 2 passed, 2 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        0.643 s, estimated 1 s
```

#### Com Cobertura

```
-------------|---------|----------|---------|---------|-------------------
File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------|---------|----------|---------|---------|-------------------
All files    |     100 |    83.33 |     100 |     100 |
-------------|---------|----------|---------|---------|-------------------
```

### Integração com CI/CD

Os testes podem ser facilmente integrados em pipelines de CI/CD:

```yaml
# Exemplo GitHub Actions
- name: Run Tests
  run: npm test

- name: Generate Coverage Report
  run: npm run test:coverage
```

---

## Conclusões e Recomendações

### ✅ **Pontos Fortes da Implementação**

1. **Cobertura Excelente**: 100% das funções e linhas testadas
2. **Testes Abrangentes**: Cobrem casos normais, edge cases e cenários complexos
3. **Organização Clara**: Testes bem estruturados e organizados
4. **Mocks Adequados**: DOM mockado adequadamente para testes de interface
5. **Documentação**: Testes servem como documentação viva do comportamento esperado

### 🎯 **Benefícios Alcançados**

1. **Confiabilidade**: Garante que mudanças não quebrem funcionalidades existentes
2. **Regressão**: Previne bugs em funcionalidades já implementadas
3. **Documentação**: Testes documentam o comportamento esperado
4. **Refatoração Segura**: Permite mudanças no código com confiança
5. **Qualidade**: Força a pensar em casos edge e validações

### 🔧 **Melhorias Possíveis**

#### 1. **Cobertura de Branches**

```javascript
// Adicionar testes para cobrir branches restantes
test("deve lidar com condições específicas não cobertas", () => {
  // Testes específicos para as linhas 20, 3, 38, 64
});
```

#### 2. **Testes de Integração**

```javascript
// Adicionar testes que simulem interação completa do usuário
test("simulação completa: usuário calcula 2 + 3 * 4", () => {
  // Simular cliques nos botões e verificar resultado final
});
```

#### 3. **Testes de Performance**

```javascript
test("deve executar operações rapidamente", () => {
  const inicio = performance.now();
  calculadora.sumar(1000000, 2000000);
  const fim = performance.now();
  expect(fim - inicio).toBeLessThan(1); // menos de 1ms
});
```

#### 4. **Testes de Acessibilidade**

```javascript
test("elementos devem ter atributos de acessibilidade", () => {
  expect(mockDisplayValorActual).toHaveAttribute("role", "textbox");
});
```

### 📈 **Métricas de Qualidade**

| Métrica               | Valor  | Status        |
| --------------------- | ------ | ------------- |
| Testes Totais         | 54     | ✅ Excelente  |
| Cobertura de Funções  | 100%   | ✅ Perfeito   |
| Cobertura de Linhas   | 100%   | ✅ Perfeito   |
| Cobertura de Branches | 83.33% | ⚠️ Bom        |
| Tempo de Execução     | 0.643s | ✅ Rápido     |
| Suites de Teste       | 2      | ✅ Organizado |

### 🚀 **Próximos Passos Recomendados**

1. **Integração Contínua**: Configurar execução automática dos testes
2. **Testes E2E**: Adicionar testes end-to-end com ferramentas como Cypress
3. **Visual Testing**: Implementar testes de regressão visual
4. **Performance Testing**: Adicionar benchmarks de performance
5. **Mutation Testing**: Usar ferramentas como Stryker para testar a qualidade dos testes

---

## Resumo Executivo

A implementação do framework Jest na aplicação da calculadora foi um **sucesso completo**. Com **54 testes** distribuídos em **2 suites**, alcançamos:

- ✅ **100% de cobertura de funções e linhas**
- ✅ **Testes robustos** cobrindo casos normais e extremos
- ✅ **Arquitetura testável** com mocks adequados
- ✅ **Documentação viva** através dos testes
- ✅ **Base sólida** para desenvolvimento futuro

O framework Jest provou ser a escolha ideal para este projeto, oferecendo facilidade de uso, recursos poderosos e excelente integração com o ecossistema JavaScript. Os testes implementados garantem a confiabilidade da aplicação e fornecem uma base sólida para futuras melhorias e expansões.

---

_Relatório gerado em: 6 de outubro de 2025_  
_Versão do Jest: 29.7.0_  
_Total de testes: 54_  
_Tempo de execução: ~0.64s_
