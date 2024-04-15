'use strict';

const header = document.querySelector('h1');
const calculateButton = document.querySelector('.calculate');
const values = document.querySelector('.values');
const uncertainities = document.querySelector('.uncertainities');

let valuesArray = [];
let uncerArray = [];

let ceilPrecisions = [];

// debug
values.value = '26231, 0.3794';
uncertainities.value = '1932, 0.05186';

calculateButton.addEventListener('click', () => {
    if (values.value == '' || uncertainities.value == '') {
        header.classList.add('error');
        header.textContent = 'Błąd: jedno z pól jest puste';
    } else {
        if (header.classList.contains('error')) {
            header.classList.remove('error');
            header.textContent = 'Zaokrąglanie';
        }

        valuesArray = values.value.replaceAll(' ', '').split(',');
        uncerArray = uncertainities.value.replaceAll(' ', '').split(',');

        valuesArray.forEach((e, i) => {
            valuesArray[i] = parseFloat(e);
        });

        uncerArray.forEach((e, i) => {
            uncerArray[i] = parseFloat(e);
        });

        // TODO: sprawdzanie czy jest tyle samo wartości i niepewności

        // zaokrąglanie do dwóch liczb znaczących
        uncerArray.forEach((e, i) => {
            uncerArray[i] = parseFloat(e.toPrecision(2));
        });

        // zaokrąglanie do jednej liczby znaczącej DO GÓRY
        let ceilUncers = [...uncerArray];

        ceilUncers.forEach((e, i) => {
            let strE = String(e);
            let result = undefined;

            // szukanie zer i przecinków...
            for (let j = 0; j < strE.length; j++) {
                if (strE[j] !== '0' && strE[j] !== '.') {
                    let temp;
                    if (!strE.includes('.')) {
                        temp =
                            e *
                            Math.pow(
                                10,
                                (strE.replace('.', '').length - j) * -1
                            );

                        result =
                            Math.ceil(temp) *
                            Math.pow(10, strE.replace('.', '').length - j);
                        ceilPrecisions[i] = 2;
                    } else {
                        temp = e * Math.pow(10, j - 2);
                        result = Math.ceil(temp) * Math.pow(10, -1 * (j - 2));
                        /*ceilPrecisions[i] = String(
                            parseFloat(
                                String(result).slice(
                                    String(result).indexOf('.'),
                                    String(result).length
                                )
                            )
                        ).length;*/
                    }
                }
            }

            ceilUncers[i] = parseFloat(result);
        });

        ceilUncers.forEach((e, i) => {
            if ((e - uncerArray[i]) / uncerArray[i] < 0.1) {
                uncerArray[i] = e;
            }

            if (String(uncerArray[i]).includes('.')) {
                // WTF????
                ceilPrecisions[i] = String(uncerArray[i]).slice(
                    String(uncerArray[i]).indexOf('.'),
                    String(uncerArray[i]).length - 1
                ).length;
            }
        });

        for (let i = 0; i < valuesArray.length; i++) {
            valuesArray[i] = parseFloat(
                valuesArray[i].toPrecision(ceilPrecisions[i])
            );
        }

        console.log(valuesArray, uncerArray);
    }
});
