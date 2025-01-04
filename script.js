document.addEventListener("DOMContentLoaded", function() {
    // 初始化變數
    const buyButtons = document.querySelectorAll('.buy-button');
    const purchasePopup = document.getElementById('purchase-popup');
    const confirmationPopup = document.getElementById('confirmation-popup');
    const cancelPurchaseButton = document.getElementById('cancel-purchase');
    const confirmPurchaseButton = document.getElementById('confirm-purchase');
    const closeConfirmationButton = document.getElementById('close-confirmation');
    const quantityInput = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('total-price');
    const copyAddressButton = document.createElement('button');
    const transactionHistory = []; // 用於存儲交易記錄
    let selectedNft = null;
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    const favoritesList = document.getElementById('favorites-list');
    const favorites = new Set(); // 使用 Set 避免重複收藏
    // Get all artist images
    const artistImages = document.querySelectorAll('.artist-image');
    const nftInventory = {
        '龍鳳雲韻': 10,
        '數位鳳凰重生': 5,
        '未來綠洲': 20,
        "星空之下": 25,
        "共生未來": 13,
        "變幻城市": 17,
        "幻境城市": 21,
        "自由之光": 12,
        "混沌之心": 3
    };

    // Get modal elements
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');

    // Event listener for clicking on artist image
    artistImages.forEach(image => {
        image.addEventListener('click', function() {
            const imageUrl = image.getAttribute('data-image');
            modalImage.src = imageUrl;
            modal.style.display = 'flex';  // Show the modal
        });
    });

    // Close modal when clicking on the close button
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';  // Hide the modal
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';  // Hide the modal
        }
    });

    // Handling image modal for NFT images
    const nftImages = document.querySelectorAll('.nft-image');

    nftImages.forEach(image => {
    image.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImage.src = image.getAttribute('data-image');
    });
    });

    closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    });

    // 複製支付地址按鈕
    copyAddressButton.textContent = '複製支付地址';
    copyAddressButton.style.marginTop = '10px';
    copyAddressButton.addEventListener('click', function () {
        navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
        alert("支付地址已複製！");
    });
    document.querySelector('.popup-content').appendChild(copyAddressButton);

    // 模擬錢包資料庫 (用戶的地址和餘額)
    const walletDatabase = {
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e": { balance: 50 },
        "0x5FbDB2315678afecb367f032d93F642f64180aa3": { balance: 30 },
        "0x60fAd71B509dB28Bd4bF8B4b116C5326A8c74f8f": { balance: 100 }
    };

    let walletConnected = false;
    let currentWalletAddress = null;

    const connectWalletButton = document.getElementById('connect-wallet');
    const walletBalanceSpan = document.getElementById('wallet-balance');

    // 虛擬連接錢包按鈕的點擊事件
    connectWalletButton.addEventListener('click', function() {
        if (walletConnected) {
            alert("已連接錢包！");
        } else {
            const walletAddresses = Object.keys(walletDatabase);
            currentWalletAddress = walletAddresses[Math.floor(Math.random() * walletAddresses.length)];
            walletConnected = true;

            connectWalletButton.textContent = "已連接錢包";
            const balance = walletDatabase[currentWalletAddress].balance;
            walletBalanceSpan.textContent = `餘額：${balance} MTC`;
            alert("錢包已成功連接！");
        }
    });

    // 更新總價與數量
    quantityInput.addEventListener('input', function () {
        const quantity = Math.min(parseInt(quantityInput.value) || 1, nftInventory[selectedNft.name]);
        const pricePerItem = parseFloat(selectedNft.price);
        const totalPrice = (pricePerItem * quantity).toFixed(2);
        quantityInput.value = quantity; // 限制數量
        totalPriceElement.textContent = `總價：${totalPrice} MTC`;
    });

    // 打開購買流程彈窗
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nftCard = button.closest('.nft-card');
            const nftName = nftCard.querySelector('h3').textContent;
            const nftPrice = nftCard.querySelector('p').textContent.split('：')[1]; // 取價格

            document.getElementById('nft-name').textContent = nftName;
            document.getElementById('nft-price').textContent = `價格：${nftPrice}`;
            document.getElementById('nft-stock').textContent = `庫存：${nftInventory[nftName]}`;

            purchasePopup.style.display = 'flex';
            selectedNft = { name: nftName, price: nftPrice };
        });
    });

    // 取消購買
    cancelPurchaseButton.addEventListener('click', function() {
        purchasePopup.style.display = 'none';
    });

    // 確認購買
confirmPurchaseButton.addEventListener('click', function () {
    // 如果尚未連接錢包，則自動連接錢包
    if (!walletConnected || !currentWalletAddress) {
        const walletAddresses = Object.keys(walletDatabase);
        currentWalletAddress = walletAddresses[Math.floor(Math.random() * walletAddresses.length)];
        walletConnected = true;

        connectWalletButton.textContent = "已連接錢包";
        const balance = walletDatabase[currentWalletAddress].balance;
        walletBalanceSpan.textContent = `餘額：${balance} MTC`;

        // 複製支付地址
        const paymentAddress = document.getElementById('payment-address');
        paymentAddress.value = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // 假設支付地址
        navigator.clipboard.writeText(paymentAddress.value); // 複製支付地址
        // 可以在頁面顯示提示 (不使用 alert)
        const copiedMessage = document.createElement('span');
        copiedMessage.textContent = "支付地址已自動複製！";
        copiedMessage.style.color = 'green';
        document.querySelector('.popup-content').appendChild(copiedMessage);

        setTimeout(() => copiedMessage.remove(), 2000); // 顯示2秒後移除訊息
    }

    const nftName = selectedNft.name;
    const quantity = parseInt(quantityInput.value) || 1;
    const totalPrice = (parseFloat(selectedNft.price) * quantity).toFixed(2);

    // 驗證支付地址
    const paymentAddressValue = document.getElementById('payment-address').value;
    if (!paymentAddressValue.startsWith("0x") || paymentAddressValue.length !== 42) {
        const errorMessage = document.createElement('span');
        errorMessage.textContent = "請輸入有效的支付地址！";
        errorMessage.style.color = 'red';
        document.querySelector('.popup-content').appendChild(errorMessage);

        setTimeout(() => errorMessage.remove(), 2000); // 顯示2秒後移除錯誤訊息
        return;
    }

    // 驗證餘額是否足夠
    const userBalance = walletDatabase[currentWalletAddress].balance;
    if (userBalance < totalPrice) {
        const errorMessage = document.createElement('span');
        errorMessage.textContent = "錢包餘額不足，無法完成購買！";
        errorMessage.style.color = 'red';
        document.querySelector('.popup-content').appendChild(errorMessage);

        setTimeout(() => errorMessage.remove(), 2000); // 顯示2秒後移除錯誤訊息
        return;
    }

    // 驗證庫存是否足夠
    if (quantity > nftInventory[nftName]) {
        const errorMessage = document.createElement('span');
        errorMessage.textContent = "購買數量超過庫存！";
        errorMessage.style.color = 'red';
        document.querySelector('.popup-content').appendChild(errorMessage);

        setTimeout(() => errorMessage.remove(), 2000); // 顯示2秒後移除錯誤訊息
        return;
    }

    // 更新錢包餘額和NFT庫存
    walletDatabase[currentWalletAddress].balance -= totalPrice;
    nftInventory[nftName] -= quantity;

    walletBalanceSpan.textContent = `餘額：${walletDatabase[currentWalletAddress].balance} MTC`;

    // 生成訂單編號
    const transactionID = Math.random().toString(36).substr(2, 9).toUpperCase();

    // 顯示訂單編號在確認彈窗
    const orderIdElement = document.getElementById('order-id');
    orderIdElement.textContent = `訂單編號: ${transactionID}`;

    purchasePopup.style.display = 'none';
    confirmationPopup.style.display = 'flex';

    // 顯示交易資訊
    displayTransactionInfo(transactionID, nftName, quantity, totalPrice, paymentAddressValue);

    // 更新交易記錄
    logTransaction(transactionID, nftName, quantity, totalPrice, paymentAddressValue);
});

    // 關閉訂單成功彈窗
    closeConfirmationButton.addEventListener('click', function() {
        confirmationPopup.style.display = 'none';
    });

    function displayTransactionInfo(transactionID, nftName, quantity, totalPrice, paymentAddress) {
        const transactionDetails = document.getElementById('transaction-details');
        transactionDetails.innerHTML = '';
        const infoHTML = `
            <div class="transaction-item">
                <p><strong>交易ID:</strong> ${transactionID}</p>
                <p><strong>購買NFT:</strong> ${nftName}</p>
                <p><strong>數量:</strong> ${quantity}</p>
                <p><strong>總價:</strong> ${totalPrice} MTC</p>
                <p><strong>支付地址:</strong> ${paymentAddress}</p>
            </div>
            <hr>
        `;
        transactionDetails.innerHTML = infoHTML;
    }

    function logTransaction(transactionID, nftName, quantity, totalPrice, paymentAddress) {
        transactionHistory.push({
            id: transactionID,
            name: nftName,
            quantity,
            price: totalPrice,
            address: paymentAddress,
            date: new Date().toLocaleString(), // 記錄交易的當前時間
        });
        updateTransactionHistoryUI(); // 更新交易紀錄 UI
    }
    
    function updateTransactionHistoryUI() {
        const historyContainer = document.getElementById('transaction-details');
        historyContainer.innerHTML = ''; // 清空交易記錄區域
    
        if (transactionHistory.length === 0) {
            historyContainer.innerHTML = '<p>目前尚無交易記錄。</p>';
            return;
        }
    
        // 顯示每一筆交易記錄
        transactionHistory.forEach(transaction => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <p><strong>交易ID:</strong> ${transaction.id}</p>
                <p><strong>購買NFT:</strong> ${transaction.name}</p>
                <p><strong>數量:</strong> ${transaction.quantity}</p>
                <p><strong>總價:</strong> ${transaction.price} MTC</p>
                <p><strong>支付地址:</strong> ${transaction.address}</p>
                <p><strong>時間:</strong> ${transaction.date}</p>
                <hr>
            `;
            historyContainer.appendChild(historyItem);
        });
    }
    
    // 收藏功能
favoriteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const nftCard = this.closest('.nft-card');
            const nftName = nftCard.querySelector('h3').textContent;
            const nftImage = nftCard.querySelector('img').src;
    
            if (favorites.has(nftName)) {
                // 已收藏 -> 取消收藏
                favorites.delete(nftName);
                this.textContent = '❤️ 收藏';
                updateFavoritesList();
            } else {
                // 未收藏 -> 添加收藏
                favorites.add(nftName);
                this.textContent = '💔 取消收藏';
    
                // 更新收藏區
                const favoriteCard = document.createElement('div');
                favoriteCard.className = 'favorite-card';
                favoriteCard.innerHTML = `
                    <img src="${nftImage}" alt="${nftName}" style="width:100px;height:auto;border-radius:5px;">
                    <p>${nftName}</p>
                `;
                favoritesList.appendChild(favoriteCard);
            }
    
            updateFavoritesList();
        });
    });

function updateFavoritesList() {
        favoritesList.innerHTML = ''; // 清空收藏區域
    
        if (favorites.size === 0) {
            favoritesList.innerHTML = '<p>尚無收藏，快去添加吧！</p>';
        } else {
            favorites.forEach(nftName => {
                let nftCard = null;
    
                // 遍歷所有NFT卡片，找到對應名稱的卡片
                document.querySelectorAll('.nft-card h3').forEach(h3 => {
                    if (h3.textContent === nftName) {
                        nftCard = h3.closest('.nft-card');
                    }
                });
    
                if (nftCard) {
                    const nftImage = nftCard.querySelector('img').src;
    
                    const favoriteCard = document.createElement('div');
                    favoriteCard.className = 'favorite-card';
                    favoriteCard.innerHTML = `
                        <img src="${nftImage}" alt="${nftName}" style="width:200px;height:auto;border-radius:5px;">
                        <p>${nftName}</p>
                    `;
                    favoritesList.appendChild(favoriteCard);
                }
            });
        }
    }
        // 獲取所有的內部跳轉連結
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    // 為每個內部連結添加點擊事件
    internalLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // 防止默認的跳轉行為

            // 獲取目標元素的ID
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // 使用 smooth 行為進行滾動
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // 滾動到元素頂部
                });
            }
        });
    });

// 引入 Chart.js 初始化圖表
const ctx = document.getElementById('nftPriceChart').getContext('2d');

// 初始化價格數據
const nftNames = ["NFT1", "NFT2", "NFT3"]; // 模擬三個 NFT
const initialDataCount = 10; // 初始時間點數量
const priceDatasets = nftNames.map((nft, index) => {
    return {
        label: `${nft} 即時價格 (MTC)`,
        data: Array.from({ length: initialDataCount }, () => (Math.random() * 10 + 5).toFixed(2)),
        borderColor: `rgba(${75 + index * 50}, ${192 - index * 50}, ${192}, 1)`, // 動態顏色
        backgroundColor: `rgba(${75 + index * 50}, ${192 - index * 50}, ${192}, 0.2)`,
        borderWidth: 2,
        tension: 0.4 // 平滑線條
    };
});

let labels = Array.from({ length: initialDataCount }, (_, i) => formatTime(new Date()));

// 配置圖表
const nftPriceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: priceDatasets
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const currentValue = context.raw;
                        const prevValue = context.dataset.data[context.dataIndex - 1] || currentValue;
                        const changePercent = (((currentValue - prevValue) / prevValue) * 100).toFixed(2);
                        return `${context.dataset.label}: ${currentValue} MTC (${changePercent}%${changePercent >= 0 ? '📈' : '📉'})`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: '時間',
                },
                ticks: {
                    callback: function (value, index, values) {
                        // 根據顯示範圍調整標籤顯示
                        return labels[index];
                    },
                    maxRotation: 0,
                    minRotation: 0
                }
            },
            y: {
                beginAtZero: false, // 自動調整數據範圍
                title: {
                    display: true,
                    text: '價格 (MTC)',
                }
            }
        }
    }
});

// 格式化當前時間為 HH:MM:SS
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// 模擬價格更新
const updateFrequency = 5000; // 更新頻率（毫秒）
let timeIndex = 0; // 時間索引

setInterval(() => {
    priceDatasets.forEach(dataset => {
        const newPrice = (Math.random() * 10 + 5).toFixed(2); // 新價格 5-15
        dataset.data.push(newPrice); // 添加新價格

        if (dataset.data.length > initialDataCount) {
            dataset.data.shift(); // 保持數據點不超過 initialDataCount
        }
    });

    const currentTime = new Date();
    labels.push(formatTime(currentTime)); // 使用當前時間更新標籤
    timeIndex++;

    if (labels.length > initialDataCount) {
        labels.shift(); // 刪除最早的時間標籤
    }

    nftPriceChart.update(); // 更新圖表
}, updateFrequency); // 每 updateFrequency 毫秒更新一次

    setInterval(() => {
        const nftCards = document.querySelectorAll('.nft-card');
        nftCards.forEach(card => {
            const priceElement = card.querySelector('.nft-price');
            const oldPrice = parseFloat(priceElement.textContent.split('：')[1]);
            const newPrice = (oldPrice * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2); // 上下浮動 10%
    
            // 更新價格並顯示變化樣式
            priceElement.textContent = `價格：${newPrice} MTC`;
            if (newPrice > oldPrice) {
                priceElement.classList.add('price-up');
                setTimeout(() => priceElement.classList.remove('price-up'), 1000);
            } else {
                priceElement.classList.add('price-down');
                setTimeout(() => priceElement.classList.remove('price-down'), 1000);
            }
        });
    }, 5000); // 每 10 秒更新一次
});
