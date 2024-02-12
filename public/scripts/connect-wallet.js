document.addEventListener('DOMContentLoaded', function () {
    const connectWalletButton = document.getElementById('connectWalletButton');
    const disconnectWalletButton = document.getElementById('disconnectWalletButton');
    const walletStatus = document.getElementById('walletStatus');

    let web3;
    let connectedAddress;

    // Пытаемся загрузить данные из localStorage
    const storedAddress = localStorage.getItem('connectedAddress');
    if (storedAddress) {
        connectedAddress = storedAddress;
        walletStatus.innerText = `Connected to Wallet: ${connectedAddress}`;
        connectWalletButton.style.display = 'none';
        disconnectWalletButton.style.display = 'block';
    }

    connectWalletButton.addEventListener('click', async function () {
        try {
            if (!web3) {
                if (window.ethereum) {
                    web3 = new Web3(window.ethereum);
                    await window.ethereum.enable();
                } else if (window.web3) {
                    web3 = new Web3(web3.currentProvider);
                } else {
                    alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
                    return;
                }

                const accounts = await web3.eth.getAccounts();
                connectedAddress = accounts[0];

                // Сохраняем адрес в localStorage
                localStorage.setItem('connectedAddress', connectedAddress);

                walletStatus.innerText = `Connected to Wallet: ${connectedAddress}`;
                connectWalletButton.style.display = 'none';
                disconnectWalletButton.style.display = 'block';
            } else {
                console.log('Wallet is already connected');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            walletStatus.innerText = 'Error connecting wallet';
        }
    });

    disconnectWalletButton.addEventListener('click', function () {
        // Очищаем данные при отключении кошелька
        web3 = undefined;
        connectedAddress = undefined;

        // Удаляем адрес из localStorage
        localStorage.removeItem('connectedAddress');

        walletStatus.innerText = 'Wallet disconnected';
        connectWalletButton.style.display = 'block';
        disconnectWalletButton.style.display = 'none';
    });
});
