// main.js

// Функция для проверки статуса входа пользователя
function checkLoginStatus() {
    fetch('/check-login')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById('loginLink').style.display = 'none';
                document.getElementById('userLink').style.display = 'block';
            } else {
                document.getElementById('loginLink').style.display = 'block';
                document.getElementById('userLink').style.display = 'none';
            }
        })
        .catch(error => console.error('Ошибка при проверке статуса входа:', error));
}

// Вызов функции для проверки статуса входа при загрузке страницы
window.addEventListener('load', checkLoginStatus);
