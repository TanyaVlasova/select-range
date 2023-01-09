const selectRangeForm = document.forms.selectRangeForm;
const widget = selectRangeForm.querySelector('.js-widget');
const selectedRange = selectRangeForm.querySelector('.js-selected-range');
let density;

const start = {
    minValue: 0,
    maxValue: null,
    currentValue: 0,
    input: selectRangeForm.valueStart,
    controller: selectRangeForm.querySelector('.js-controller-start'),
    setControllerValue() {
        this.controller.style.left = Math.round(this.currentValue / density) + 'px';
    },
    setInputValue() {
        this.input.value = this.currentValue;
    },
    setSelectedRange() {
        selectedRange.style.left = Math.round(this.currentValue / density) + 'px';
    },
    setTopController() {
        end.controller.classList.remove('top');
        this.controller.classList.add('top');
    },
}

const end = {
    minValue: null,
    maxValue: 1000,
    currentValue: 1000,
    input: selectRangeForm.valueEnd,
    controller: selectRangeForm.querySelector('.js-controller-end'),
    setControllerValue() {
        this.controller.style.left = Math.round(this.currentValue / density) + 'px';
    },
    setInputValue() {
        this.input.value = this.currentValue;
    },
    setSelectedRange() {
        selectedRange.style.right = widget.offsetWidth - Math.round(this.currentValue / density) + 'px';
    },
    setTopController() {
        start.controller.classList.remove('top');
        this.controller.classList.add('top');
    },
}

document.addEventListener('DOMContentLoaded', setAllValues);
window.addEventListener('resize', setAllValues);

start.input.addEventListener('change', changeValueFromInput.bind(start));
end.input.addEventListener('change', changeValueFromInput.bind(end));

start.controller.addEventListener('pointerdown', changeValueFromController.bind(start));
end.controller.addEventListener('pointerdown', changeValueFromController.bind(end));

selectRangeForm.addEventListener('submit', event => {
    event.preventDefault();
});

function setAllValues() {
    density = (end.maxValue - start.minValue) / widget.offsetWidth;

    start.setInputValue();
    start.setControllerValue();
    start.setSelectedRange();
    end.setInputValue();
    end.setControllerValue();
    end.setSelectedRange();
    
    setMinMaxValues();
}

function setMinMaxValues() {
    start.maxValue = +end.input.value;
    end.minValue = +start.input.value;     
}

function changeValueFromInput() {
    setMinMaxValues();

    this.currentValue = clamp(this.minValue, this.input.value, this.maxValue);

    this.setInputValue();
    this.setControllerValue();
    this.setSelectedRange();
    this.setTopController();
}

function changeValueFromController() {
    const startControllerBind = startController.bind(this);
    document.addEventListener('pointermove', startControllerBind);
    document.addEventListener('pointerup', stopController);

    function startController(event) {
        event.preventDefault();

        setMinMaxValues();

        const value = Math.round((event.pageX - widget.offsetLeft) * density);
        this.currentValue = clamp(this.minValue, value, this.maxValue);

        this.setInputValue();
        this.setControllerValue();
        this.setSelectedRange();
        this.setTopController();
    }

    function stopController() {
        document.removeEventListener('pointermove', startControllerBind);
    }
}

function clamp(min, val, max) {
    return Math.max(min, Math.min(val, max));
}