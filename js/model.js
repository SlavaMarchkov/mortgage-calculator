// исходные данные, вводимые пользователем
let data = {
    // выбранная при старте приложения программа ипотеки (base) и ставка по ней
    selectedProgram: 0.1,

    // стоимость недвижимости при старте приложения
    cost: 12_000_000,

    // мин. и макс. стоимость недвижимости
    minPrice: 375_000,
    maxPrice: 100_000_000,

    // мин. и макс. проценты и суммы первоначального взноса
    minPaymentPercent: 0.15,
    maxPaymentPercent: 0.9,
    paymentPercent: 0.5, // при старте приложения
    payment: 6_000_000, // cost * paymentPercent при старте приложения

    // допустимые суммы мин. и макс. первоначального платежа
    getMinPayment: function () {
        return this.cost * this.minPaymentPercent;
    },
    getMaxPayment: function () {
        return this.cost * this.maxPaymentPercent;
    },

    // срок ипотеки
    minYears: 1,
    maxYears: 30,
    time: 10, // стартовое значение 10 лет при старте приложения

    // ипотечные программы и ставки ипотеки по ним
    programs: {
        base: 0.1,
        it: 0.047,
        gov: 0.067,
        zero: 0.12,
    },
};

// рассчитываемые результаты в зависимости от данных, введённых или выбранных пользователем
let results = {
    rate: data.selectedProgram,
};

function getData() {
    return { ...data }; // копия объекта
}

function setData(newData) {
    // проверка выбранной ипотечной программы для изменения первоначального взноса
    if (newData.onUpdate === 'radioProgram') {
        data.minPaymentPercent = newData.id === 'zero-value' ? 0 : 0.15;
    }

    // проверка введённой стоимости в поле "Стоимость недвижимости" по флагу inputCost
    // или при сдвигании слайдера по флагу costSlider
    if (newData.onUpdate === 'inputCost' || newData.onUpdate === 'costSlider') {
        // если стоимость ниже мин. стоимости
        if (newData.cost < data.minPrice) {
            newData.cost = data.minPrice;
        }

        // если стоимость выше макс. стоимости
        if (newData.cost > data.maxPrice) {
            newData.cost = data.maxPrice;
        }

        // проверка суммы первоначального взноса в сравнении с выбранной стоимостью недвижимости
        if (data.payment > data.getMaxPayment()) {
            data.payment = data.getMaxPayment();
        }
        if (data.payment < data.getMinPayment()) {
            data.payment = data.getMinPayment();
        }

        // пересчитываем процент первоначального взноса
        data.paymentPercent = (data.payment * 100) / newData.cost / 100;
    }

    // проверка введённого значения в поле "Первоначальный взнос" по флагу inputPayment
    if (newData.onUpdate === 'inputPayment') {
        // пересчитываем проценты
        newData.paymentPercent = (newData.payment * 100) / data.cost / 100;

        // если процент больше 90%
        if (newData.paymentPercent > data.maxPaymentPercent) {
            newData.paymentPercent = data.maxPaymentPercent;
            newData.payment = data.getMaxPayment();
        }

        // если процент меньше 15%
        if (newData.paymentPercent < data.minPaymentPercent) {
            newData.paymentPercent = data.minPaymentPercent;
            newData.payment = data.getMinPayment();
        }
    }

    // проверка процента первоначального платежа при движении слайдера paymentSlider
    if (newData.onUpdate === 'paymentSlider') {
        newData.paymentPercent = newData.paymentPercent / 100;
        data.payment = data.cost * newData.paymentPercent;
    }

    // проверка введённого срока ипотеки на мин. и макс. значение
    if (newData.onUpdate === 'inputTime') {
        if (newData.maxYears > data.maxYears) {
            newData.maxYears = data.maxYears;
        }
        if (newData.minYears < data.minYears) {
            newData.minYears = data.minYears;
        }
    }

    data = {
        ...data,
        ...newData,
    };

    // расчет ипотеки
    const months = data.time * 12; // кол-во месяцев ипотеки
    const totalAmount = data.cost - data.payment; // общая стоимость кредита
    const monthlyRate = data.selectedProgram / 12; // месячная ставка
    const generalRate = (1 + monthlyRate) ** months; // общая ставка
    const monthlyPayment =
        (totalAmount * monthlyRate * generalRate) / (generalRate - 1); // ежемесячный платеж
    const overPayment = monthlyPayment * months - totalAmount;

    results = {
        rate: data.selectedProgram,
        totalAmount,
        monthlyPayment,
        overPayment,
    };
}

function getResults() {
    return { ...results };
}

export { getData, setData, getResults };
