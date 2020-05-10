import "./style.css";

const ADDITION_ID = "js-addition";
const BACK_ID = "js-back";
const CLEAR_ID = "js-clear";
const CANCEL_ID = "js-cancel";
const COMMA_ID = "js-comma";
const DISPLAY_ID = "js-display";
const DIVIDE_ID = "js-divide";
const EQUAL_ID = "js-equal";
const FRACTION_ID = "js-fraction";
const INVERT_ID = "js-invertion";
const MEMORY_ADD_ID = "js-M+";
const MEMORY_CLEAR_ID = "js-MC";
const MEMORY_MINUS_ID = "js-M-";
const MEMORY_READ_ID = "js-MR";
const MEMORY_SET_ID = "js-MS";
const MULTIPLY_ID = "js-multiply";
const NUMBER_CLASS_SELECTOR = ".calculator__button--is-number";
const NUMBER_OF_NUMBERS_IN_KEYBOARD = 10;
const PERCENT_ID = "js-percent";
const POWER_ID = "js-power";
const SUBTRACTION_ID = "js-subtraction";
const SQUARE_ID = "js-square";

class Calculator {
	constructor() {
		this.memoryValue = 0;
		this.displayValue = "0";
		this.selectedFunction = null;
		this.isFunctionDone = false;
		this.previousValue = 0;
		this.repeatedValue = 0;
		this.wasEqualClicked = false;
		this.wasSpecialFunctionClicked = false;

		this.bindToDisplay();
		this.bindToNumbers();
		this.bindToButtons();
	}

	bindToDisplay() {
		const display = document.getElementById(DISPLAY_ID);

		if (!display) {
			throw "Nie znaleziono elementu dla modułu wyświetlacza";
		}

		display.textContent = this.displayValue;
		this.display = display;
	}

	bindToNumbers() {
		const numbers = document.querySelectorAll(NUMBER_CLASS_SELECTOR);

		if (numbers.length !== NUMBER_OF_NUMBERS_IN_KEYBOARD) {
			console.warn("W klawiaturze brakuje cyfr");
		}

		numbers.forEach((number) =>
			number.addEventListener("click", (event) =>
				this.concatenateNumber(event)
			)
		);
	}

	bindToButtons() {
		this.bindFunctionToButton(MEMORY_CLEAR_ID, () => this.memoryClear());
		this.bindFunctionToButton(MEMORY_READ_ID, () => this.memoryRead());
		this.bindFunctionToButton(MEMORY_ADD_ID, () => this.memoryAdd());
		this.bindFunctionToButton(MEMORY_MINUS_ID, () => this.memoryMinus());
		this.bindFunctionToButton(MEMORY_SET_ID, () => this.memorySet());
		this.bindFunctionToButton(CLEAR_ID, () => this.clear());
        this.bindFunctionToButton(CANCEL_ID, () => this.cancel());
        this.bindFunctionToButton(ADDITION_ID, () => this.addition());
        this.bindFunctionToButton(SUBTRACTION_ID, () => this.subtraction());
	}

	bindFunctionToButton(elementId, callback) {
		const element = document.getElementById(elementId);

		if (!elementId) {
			console.warn(`Nie znaleziono elementu o id ${elementId}`);
			return;
		}
		element.addEventListener("click", () => callback());
	}

	concatenateNumber(event) {
		this.displayValue =
			this.displayValue === null ||
			this.displayValue === "0" ||
			this.wasSpecialFunctionClicked
				? event.target.textContent
				: this.displayValue + event.target.textContent;

		if (this.wasEqualClicked) {
			this.previosValue = 0;
			this.repeatedValue = 0;
			this.wasEqualClicked = false;
		}

		this.wasSpecialFunctionClicked = false;
		this.isFunctionDone = false;
		this.display.textContent = this.displayValue;
	}

	memoryClear() {
		this.wasSpecialFunctionClicked = true;
		this.memoryValue = 0;
	}

	memoryRead() {
		this.wasSpecialFunctionClicked = true;
		this.changeDisplayValue(this.memoryValue);
	}

	memoryAdd() {
		this.wasSpecialFunctionClicked = true;
		this.memoryValue = this.memoryValue + Number(this.displayValue);
	}

	memoryMinus() {
		this.wasSpecialFunctionClicked = true;
		this.memoryValue = this.memoryValue - Number(this.displayValue);
	}

	memorySet() {
		this.wasSpecialFunctionClicked = true;
		this.memoryValue = Number(this.displayValue);
	}

	clear() {
		this.previosValue = 0;
		this.selectedFunction = null;
		this.changeDisplayValue(null);
	}

	cancel() {
		this.changeDisplayValue(null);
	}

	addition(hasRepeatedValue) {
        if (this.selectedFunction !== this.addition && this.selectedFunction) {
            this.selectedFunction(hasRepeatedValue);
        }

		this.selectedFunction = this.addition;
		if (this.isFunctionDone) {
			this.repeatedValue = Number(this.previousValue);
			this.displayValue = "0";
			this.wasEqualClicked = false;

			return;
		}

		const displayValue = Number(this.display.textContent);
		const previousValue = hasRepeatedValue
			? this.repeatedValue
			: Number(this.previousValue);
		const newValue = displayValue + previousValue;

		this.isFunctionDone = true;
		this.repeatedValue = hasRepeatedValue
			? this.repeatedValue
            : this.wasEqualClicked
                ? newValue
                : Number(this.display.textContent);

        this.wasEqualClicked = false;
        this.previousValue = newValue;
        this.displayValue = null;
        this.display.textContent = newValue;

    }
    
    subtraction(hasRepeatedValue) {
        if (this.selectedFunction !== this.subtraction && this.selectedFunction) {
            this.selectedFunction(hasRepeatedValue);
        }

        this.selectedFunction = this.subtraction;
        if(this.isFunctionDone) {
            this.repeatedValue = Number(this.previousValue);
            this.displayValue = "0";
           this.wasEqualClicked = false;

            return;
        }        

        const displayValue = Number(this.display.textContent);
		const previousValue = hasRepeatedValue
			? this.repeatedValue
            : Number(this.previousValue);
        let newValue;

        if (this.previousValue !== null) {
            newValue= hasRepeatedValue
                ? displayValue - this.repeatedValue
                : previousValue - displayValue;

                    
            this.repeatedValue = hasRepeatedValue
                ? this.repeatedValue
                : this.wasEqualClicked
                    ? newValue
                    : Number(this.display.textContent);
        }

        this.isFunctionDone = true;
        this.wasEqualClicked = false;
        this.displayValue = null;
        this.display.textContent = this.previousValue !== null ? newValue : this.display.textContent;
        this.previousValue = this.previousValue !== null ? newValue : this.display.textContent;
    }

	changeDisplayValue(value) {
		this.displayValue = value;
		this.display.textContent = value === null ? "0" : value.toString();
	}
}

new Calculator();
