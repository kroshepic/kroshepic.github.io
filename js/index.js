const searchBlock = document.querySelector('.input-block'); // Блок с поиском
const searchUl = createElement('ul', 'input-block_results');
const input = document.querySelector('.input-block_input');
const resultBlock = document.querySelector('#result'); // Блок с добавленными элементами


// Fetch
async function getRepositories(searchText) {
    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${searchText}:in:name`);

        if (response.ok) {

            // Вывод 5 первых результатов поиска
            const res = await response.json();
            searchUl.innerHTML = ''; // Чистим перед добавлением
            if (input.value.length > 0) {
                res.items.forEach((repository, count = 0) => {
                    count++;
                    if (count <= 5) {

                        searchUl.insertAdjacentHTML('beforeend', `
                    <li class="input-block_results-item" id="${repository.id}">
                        <p class="input-block_results-text">${repository.name}</p>
                    </li>
                `);
                    }
                });
            }

            searchBlock.append(searchUl);

            // Все 5 элементов результатов
            const resultItems = searchBlock.querySelectorAll('.input-block_results-item')

            if(resultItems) {
                resultItems.forEach(resultItem => {

                    resultItem.addEventListener('click', () => {

                        // Меняем цвет для выбранного элемента
                        resultItem.classList.add('active');
                        setTimeout(() => {
                            resultItem.classList.remove('active');
                        }, 200);

                        // Создание выбранных элементов в блоке ниже:
                        res.items.forEach(resItem => {
                            if (resItem.id === Number(resultItem.id)) {

                                createSearchResultItem(resItem.name, resItem.owner.login, resItem.stargazers_count);

                                // Почистим поля после выбора
                                input.value = '';
                                if (input.value.length === 0) {
                                    searchUl.remove();
                                }
                            }
                        });

                        // Удаление выбранных элементов в блоке ниже:
                        const appendItems = resultBlock.querySelectorAll('.results-block_item');

                        appendItems.forEach(item => {
                            const deleteBtn = item.querySelector('.results-block_btn--delete')
                            deleteBtn.addEventListener('click', () => {
                                item.classList.add('remove');
                                setTimeout(() => {
                                    item.remove()
                                }, 100);
                            })
                        });


                    });
                });
            }

        } else {
            console.log('Error, not response!')
        }
    }
    catch (err) {
        console.error(`Error! ${err.message}`)
    }
}

// Общий конструктор элементов
function createElement (tagName, className) {
    const element = document.createElement(`${tagName}`);
    if (className) element.classList.add(`${className}`);
    return element;
}


// Конструкторы элементов результатов поиска (добавленные пользователем элементы)
function createSearchResultItem (name, owner, stars) {

    // Создание структуры:
    const resItemBlock = createElement('div', 'results-block_item');
    const resItemUl = createElement('ul', 'results-block_info');

    // Сборка:
    resItemUl.insertAdjacentHTML('afterbegin', `
        <li>Name: <span class="results-block_name">${name}</span></li>
        <li>Owner: <span class="results-block_owner">${owner}</span></li>
        <li>Stars: <span class="results-block_stars">${stars}</span></li>
    `);
    resItemBlock.append(resItemUl);

    // Кнопка
    resItemBlock.insertAdjacentHTML('beforeend', `
        <button class="results-block_btn--delete">
            <img src="img/icons/Vector_3.svg" alt="" class="results-block_img">
            <img src="img/icons/Vector_1.svg" alt="" class="results-block_img">
        </button>
    `)

    return resultBlock.append(resItemBlock);
}

// Ф-я для задержки коллбека
const debounce = (fn, debounceTime) => {
    let timer;
    function wrapper () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, debounceTime);
    }
    return wrapper;
};

// Main
document.addEventListener('DOMContentLoaded',  () => {
    const debouncedGetRepositories = debounce(value => {
        getRepositories(value);
    }, 1000);


    input.addEventListener('keyup', () => {
        debouncedGetRepositories(input.value);
    })

});
