document.addEventListener('DOMContentLoaded', function () {
    // Здесь вы можете использовать AJAX или fetch для получения данных профиля с сервера

    // Пример данных профиля (замените их своими реальными данными)
    const userProfileData = {
        avatar: '/images/avatar.jpg',
        address: '',  // Добавим поле для адреса кошелька
        tokens: {
            erc20: 100,
            erc721: [1, 2, 3],
        },
        friends: [], // Замените этот массив реальными данными друзей пользователя
        connectRequests: [], // Замените этот массив реальными данными запросов на добавление в друзья
    };

    // Получаем адрес кошелька из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const walletAddress = urlParams.get('walletAddress');

    // Если адрес кошелька получен, используем его
    if (walletAddress) {
        userProfileData.address = walletAddress;
    }

    // Заполняем элементы страницы данными из профиля
    document.getElementById('avatar').innerHTML = `<img src="${userProfileData.avatar}" alt="Avatar">`;
    document.getElementById('address').innerText = `Address: ${userProfileData.address}`;
    updateProfileData(userProfileData);

    // Показываем кнопку "Add to Friend/Connect" только если другой пользователь посещает эту страницу
    // (в реальном проекте вы должны проверять, залогинен ли пользователь и соответствуют ли адреса)
    const addFriendButton = document.getElementById('addFriendButton');
    if (otherUserIsViewingProfile()) {
        addFriendButton.style.display = 'block';
    }

    // Обработка нажатия кнопки "Add to Friend/Connect"
    addFriendButton.addEventListener('click', function () {
        // Здесь вы можете использовать AJAX или fetch для отправки запроса на добавление в друзья на сервер
        alert('Friend request sent!');
    });

    // Отображение запросов на добавление в друзья
    const connectRequestsContainer = document.getElementById('connectRequests');
    userProfileData.connectRequests.forEach(requesterAddress => {
        const requestElement = document.createElement('div');
        requestElement.innerText = `Friend request from: ${requesterAddress}`;
        connectRequestsContainer.appendChild(requestElement);
    });

    // В реальном проекте вам нужно использовать асинхронные запросы к серверу для получения этих данных
    // и динамическое обновление страницы при изменении данных профиля

    // Добавляем обработчик для кнопки "Connect Wallet"
    const connectWalletButton = document.getElementById('connectWalletButton');
    connectWalletButton.addEventListener('click', function () {
        // Здесь вы можете реализовать переход на страницу "connect-wallet.html"
        window.location.href = 'connect-wallet.html';
    });

    // Функция для обновления данных профиля
    function updateProfileData(data) {
        document.getElementById('erc20').innerText = data.tokens.erc20;
        document.getElementById('erc721').innerText = data.tokens.erc721.length;
    }

    // Функция для проверки, просматривает ли другой пользователь этот профиль
    function otherUserIsViewingProfile() {
        // Здесь вы должны реализовать логику определения, просматривает ли другой пользователь этот профиль
        // Например, проверка, залогинен ли пользователь и соответствуют ли адреса
        // Замените этот код своей логикой
        return true;
    }

    // Проверяем наличие данных в localStorage при загрузке страницы
    const storedAddress = localStorage.getItem('connectedAddress');
    if (storedAddress) {
        const storedData = {
            address: storedAddress,
            tokens: {
                erc20: localStorage.getItem('connectedERC20') || '0',
                erc721: localStorage.getItem('connectedERC721') ? JSON.parse(localStorage.getItem('connectedERC721')) : [],
            },
        };

        updateProfileData(storedData);
    }
    // Функция для выхода из аккаунта
    function logout() {
        fetch('/logout', {
            method: 'POST',
        })
        .then(response => {
            if (response.ok) {
                // После успешного выхода перенаправляем пользователя на главную страницу
                window.location.href = 'main.html';
            } else {
                console.error('Ошибка при выходе из аккаунта');
            }
        })
        .catch(error => console.error('Ошибка при выходе из аккаунта:', error));
    }

    // Добавляем обработчик для кнопки "Выйти с аккаунта"
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function () {
        logout();
    });
});
