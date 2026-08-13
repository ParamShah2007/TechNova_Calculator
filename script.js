
const display = document.getElementById("display");

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForOperand = false;

function updateDisplay() {
    display.value = currentValue;
}

function inputNumber(number) {
    if (waitingForOperand) {
        currentValue = number;
        waitingForOperand = false;
    } else {
        currentValue = currentValue === "0"
            ? number
            : currentValue + number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (waitingForOperand) {
        currentValue = "0.";
        waitingForOperand = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    const inputValue = parseFloat(currentValue);

    if (operator && waitingForOperand) {
        operator = nextOperator;
        return;
    }

    if (previousValue === null) {
        previousValue = inputValue;
    } else if (operator) {
        const result = calculate(previousValue, inputValue, operator);

        currentValue = String(result);
        previousValue = result;
        updateDisplay();
    }

    operator = nextOperator;
    waitingForOperand = true;
}

function calculate(first, second, operation) {
    switch (operation) {
        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":
            return second === 0 ? "Error" : first / second;

        default:
            return second;
    }
}

function equals() {
    if (operator === null || previousValue === null) {
        return;
    }

    const inputValue = parseFloat(currentValue);
    const result = calculate(previousValue, inputValue, operator);

    currentValue = String(result);
    previousValue = null;
    operator = null;
    waitingForOperand = true;

    updateDisplay();
}

function clearCalculator() {
    currentValue = "0";
    previousValue = null;
    operator = null;
    waitingForOperand = false;

    updateDisplay();
}

function deleteLast() {
    if (waitingForOperand || currentValue === "Error") {
        return;
    }

    currentValue = currentValue.length > 1
        ? currentValue.slice(0, -1)
        : "0";

    updateDisplay();
}

function percent() {
    if (currentValue !== "Error") {
        currentValue = String(parseFloat(currentValue) / 100);
        updateDisplay();
    }
}

// Button input
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        if (button.dataset.number !== undefined) {
            inputNumber(button.dataset.number);
        }

        if (button.dataset.operator) {
            chooseOperator(button.dataset.operator);
        }

        switch (button.dataset.action) {
            case "decimal":
                inputDecimal();
                break;

            case "equals":
                equals();
                break;

            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteLast();
                break;

            case "percent":
                percent();
                break;
        }
    });
});

// Keyboard support
document.addEventListener("keydown", event => {
    const key = event.key;

    if (key >= "0" && key <= "9") {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        equals();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape" || key.toLowerCase() === "c") {
        clearCalculator();
    } else if (key === "%") {
        percent();
    }
});

updateDisplay();