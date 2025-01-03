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
    let selectedNft = null;
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    const favoritesList = document.getElementById('favorites-list');
    
    const favorites = new Set(); // 使用 Set 避免重複收藏
    
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
    
    // 更新收藏區顯示
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

    
    function initializePrices() {
        const nftCards = document.querySelectorAll('.nft-card');
        nftCards.forEach(card => {
            const priceElement = card.querySelector('.nft-price');
            const randomPrice = (Math.random() * 10 + 5).toFixed(2); // 隨機生成 5-15 的價格
            priceElement.textContent = `價格：${randomPrice} MTC`;
        });
    }

    // 呼叫價格初始化
    initializePrices();
    
    // Get all artist images
    const artistImages = document.querySelectorAll('.artist-image');
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
            // 模擬一個隨機錢包地址（用戶連接錢包）
            const walletAddresses = Object.keys(walletDatabase);
            currentWalletAddress = walletAddresses[Math.floor(Math.random() * walletAddresses.length)];
            walletConnected = true;

            // 更新按鈕文字和顯示餘額
            connectWalletButton.textContent = "已連接錢包";
            const balance = walletDatabase[currentWalletAddress].balance;

            // 顯示當前餘額
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

            // 顯示NFT名稱、價格與庫存
            document.getElementById('nft-name').textContent = nftName;
            document.getElementById('nft-price').textContent = `價格：${nftPrice}`;
            document.getElementById('nft-stock').textContent = `庫存：${nftInventory[nftName]}`;

            // 顯示購買彈窗
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
        if (!walletConnected || !currentWalletAddress) {
            alert("請先連接錢包！");
            return;
        }

        const quantity = parseInt(quantityInput.value);
        const pricePerItem = parseFloat(selectedNft.price);
        const totalPrice = pricePerItem * quantity;
        const userBalance = walletDatabase[currentWalletAddress].balance;

        // 驗證支付地址
        const paymentAddress = document.getElementById('payment-address').value;
        if (!paymentAddress.startsWith("0x") || paymentAddress.length !== 42) {
            alert("請輸入有效的支付地址！");
            return;
        }

        // 驗證餘額是否足夠
        if (userBalance < totalPrice) {
            alert("錢包餘額不足，無法完成購買！");
            return;
        }

        // 驗證庫存是否足夠
        if (quantity > nftInventory[selectedNft.name]) {
            alert("購買數量超過庫存！");
            return;
        }

        // 更新錢包餘額和NFT庫存
        walletDatabase[currentWalletAddress].balance -= totalPrice;
        nftInventory[selectedNft.name] -= quantity;

        // 更新顯示的餘額
        walletBalanceSpan.textContent = `餘額：${walletDatabase[currentWalletAddress].balance} MTC`;

        // 模擬交易ID
        const transactionID = Math.random().toString(36).substr(2, 9).toUpperCase();

        // 顯示訂單確認彈窗
        purchasePopup.style.display = 'none';
        confirmationPopup.style.display = 'flex';

        // 打印交易資訊
        console.log(`交易ID: ${transactionID}`);
        console.log(`購買NFT: ${selectedNft.name}`);
        console.log(`數量: ${quantity}`);
        console.log(`總價: ${totalPrice} MTC`);
        console.log(`支付地址: ${paymentAddress}`);
    });

    // 關閉訂單成功彈窗
    closeConfirmationButton.addEventListener('click', function() {
        confirmationPopup.style.display = 'none';
    });

    // 切換NFT卡片介紹顯示
    const nftCards = document.querySelectorAll('.nft-card');  // 獲取所有NFT卡片
    nftCards.forEach(card => {
        const nftImage = card.querySelector('img');
        const nftDescription = card.querySelector('.nft-description'); // 假設你的介紹區域是這樣設置的
        nftImage.addEventListener('mouseenter', function() {
            nftDescription.style.display = 'block'; // 顯示介紹
        });
        nftImage.addEventListener('mouseleave', function() {
            nftDescription.style.display = 'none'; // 隱藏介紹
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

    let labels = Array.from({ length: initialDataCount }, (_, i) => formatTime(i));

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

    // 格式化時間，將時間轉換為分鐘:秒的形式
    function formatTime(timeIndex) {
        const minutes = Math.floor(timeIndex / 60);
        const seconds = timeIndex % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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

        labels.push(formatTime(timeIndex));
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
