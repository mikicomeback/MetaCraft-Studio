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
    const artistImages = document.querySelectorAll('.artist-image');
    const nftImages = document.querySelectorAll('.nft-image');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    const connectWalletButton = document.getElementById('connect-wallet');
    const walletBalanceSpan = document.getElementById('wallet-balance');
    const exchangeRateElement = document.getElementById('exchange-rate');
    const ownedNfts = {}; // 用戶擁有的NFT清單
    const marketplace = []; // 市場上的NFT清單
    let exchangeRate = 28.00; // 初始匯率
    let lastExchangeRate = exchangeRate;
    let trendFactor = 0; // 初始趨勢因子
    let walletConnected = false;
    let currentWalletAddress = null;

    // 創建通知區域
    const notificationArea = document.createElement('div');
    notificationArea.id = 'notification-area';
    notificationArea.style.position = 'fixed';
    notificationArea.style.top = '10px';
    notificationArea.style.right = '10px';
    notificationArea.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notificationArea.style.color = 'white';
    notificationArea.style.padding = '10px';
    notificationArea.style.borderRadius = '5px';
    notificationArea.style.zIndex = '1000';
    notificationArea.style.display = 'none';
    document.body.appendChild(notificationArea);

    // 顯示通知的函數
    function showNotification(message) {
        notificationArea.textContent = message;
        notificationArea.style.display = 'block';
        setTimeout(() => {
            notificationArea.style.display = 'none';
        }, 3000); // 3秒後消失
    }

    const nftInventory = {
        '龍鳳雲韻': Math.floor(Math.random() * 50) + 1, // 1到50之間的隨機數
        '數位鳳凰重生': Math.floor(Math.random() * 50) + 1,
        '未來綠洲': Math.floor(Math.random() * 50) + 1,
        "星空之下": Math.floor(Math.random() * 50) + 1,
        "共生未來": Math.floor(Math.random() * 50) + 1,
        "變幻城市": Math.floor(Math.random() * 50) + 1,
        "幻境城市": Math.floor(Math.random() * 50) + 1,
        "自由之光": Math.floor(Math.random() * 50) + 1,
        "混沌之心": Math.floor(Math.random() * 50) + 1
    };

    // 模擬錢包資料庫 (用戶的地址和餘額)
    const walletDatabase = {
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e": { balance: 50 },
        "0x5FbDB2315678afecb367f032d93F642f64180aa3": { balance: 30 },
        "0x60fAd71B509dB28Bd4bF8B4b116C5326A8c74f8f": { balance: 100 }
    };
    
    document.querySelector('.company-name').addEventListener('click', function(event) {
        event.preventDefault(); // 防止默認的跳轉行為
        window.scrollTo({
            top: 0, // 滾動到頁面的最頂部
            behavior: 'smooth' // 平滑滾動
        });
    });
    
    // 上架NFT
    document.getElementById('list-nft-button').addEventListener('click', function () {
        const nftName = document.getElementById('nft-name-input').value.trim();
        const quantity = parseInt(document.getElementById('nft-quantity-input').value, 10);
        const price = parseFloat(document.getElementById('nft-price-input').value);

        if (!nftName || quantity <= 0 || price <= 0) {
            showNotification('請填寫正確的NFT名稱、數量和價格！');
            return;
        }

        if (!ownedNfts[nftName]) {
            ownedNfts[nftName] = { quantity, price };
        } else {
            ownedNfts[nftName].quantity += quantity;
            ownedNfts[nftName].price = price; // 更新價格
        }

        showNotification(`${nftName} 已成功上架 ${quantity} 個！`);
        updateOwnedNftsDropdown();
    });

    // 出售NFT
    document.getElementById('sell-nft-button').addEventListener('click', function () {
        const nftName = document.getElementById('owned-nfts').value;
        const quantity = parseInt(document.getElementById('sell-quantity-input').value, 10);
        const price = parseFloat(document.getElementById('sell-price-input').value);

        if (!nftName || quantity <= 0 || price <= 0) {
            showNotification('請選擇NFT並填寫正確的數量和價格！');
            return;
        }

        if (ownedNfts[nftName].quantity < quantity) {
            showNotification('數量不足，無法出售！');
            return;
        }

        ownedNfts[nftName].quantity -= quantity;
        marketplace.push({ name: nftName, quantity, price });

        showNotification(`${quantity} 個 ${nftName} 已成功上架出售！`);
        updateOwnedNftsDropdown();
        updateMarketplace();
    });

    // 更新已擁有NFT的下拉選單
    function updateOwnedNftsDropdown() {
        const dropdown = document.getElementById('owned-nfts');
        dropdown.innerHTML = '';

        Object.keys(ownedNfts).forEach(nftName => {
            if (ownedNfts[nftName].quantity > 0) {
                const option = document.createElement('option');
                option.value = nftName;
                option.textContent = `${nftName} (${ownedNfts[nftName].quantity} 個)`;
                dropdown.appendChild(option);
            }
        });
    }

    // 更新市場顯示
    function updateMarketplace() {
        const marketplaceDiv = document.getElementById('marketplace');
        marketplaceDiv.innerHTML = '';

        marketplace.forEach((nft, index) => {
            const nftElement = document.createElement('div');
            nftElement.innerHTML = `
                <p><strong>${nft.name}</strong></p>
                <p>數量：${nft.quantity}</p>
                <p>價格：${nft.price} MTC</p>
                <button data-index="${index}" class="buy-marketplace-nft">購買</button>
            `;
            marketplaceDiv.appendChild(nftElement);
        });

        document.querySelectorAll('.buy-marketplace-nft').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                const nft = marketplace[index];

                const quantity = prompt(`請輸入購買的數量 (1-${nft.quantity})`);
                const quantityInt = parseInt(quantity, 10);

                if (quantityInt > 0 && quantityInt <= nft.quantity) {
                    nft.quantity -= quantityInt;
                    showNotification(`購買成功！獲得 ${quantityInt} 個 ${nft.name}`);

                    if (!ownedNfts[nft.name]) {
                        ownedNfts[nft.name] = { quantity: quantityInt, price: nft.price };
                    } else {
                        ownedNfts[nft.name].quantity += quantityInt;
                    }

                    if (nft.quantity === 0) {
                        marketplace.splice(index, 1); // 移除已售罄的NFT
                    }

                    updateOwnedNftsDropdown();
                    updateMarketplace();

                    // 影響匯率
                    updateExchangeRateAfterPurchase(quantityInt, parseFloat(nft.price));
                } else {
                    showNotification('輸入的數量無效！');
                }
            });
        });
    }

    // 更新總價與數量
    quantityInput.addEventListener('input', function () {
        const maxQuantity = nftInventory[selectedNft.name];
        let quantity = parseInt(quantityInput.value, 10) || 1;
    
        if (quantity > maxQuantity) {
            quantity = maxQuantity;
            quantityInput.value = maxQuantity;
        }
    
        const pricePerItemMTC = parseFloat(selectedNft.price) || 0;
        const totalPriceMTC = (pricePerItemMTC * quantity).toFixed(2);
        const totalPriceTWD = (totalPriceMTC * exchangeRate).toFixed(2);
    
        document.getElementById('total-price-mtc').textContent = `總價（MTC）：${totalPriceMTC} MTC`;
        document.getElementById('total-price-twd').textContent = `總價（TWD）：${totalPriceTWD > 0 ? totalPriceTWD : "0.00"} TWD`;
    });
    

    // 複製支付地址按鈕
    copyAddressButton.textContent = '複製支付地址';
    copyAddressButton.style.marginTop = '10px';
    copyAddressButton.addEventListener('click', function () {
        if (walletConnected && currentWalletAddress) {
            navigator.clipboard.writeText(currentWalletAddress);
            showNotification("支付地址已複製！");
        } else {
            showNotification("請先連接錢包！");
        }
    });
    document.querySelector('.popup-content').appendChild(copyAddressButton);

    connectWalletButton.addEventListener('click', function () {
        if (walletConnected) {
            showNotification("已連接錢包！");
        } else {
            const walletAddresses = Object.keys(walletDatabase);
            currentWalletAddress = walletAddresses[Math.floor(Math.random() * walletAddresses.length)];
            walletConnected = true;

            connectWalletButton.textContent = "已連接錢包";
            const balance = walletDatabase[currentWalletAddress].balance;
            walletBalanceSpan.textContent = `餘額：${balance} MTC`;
            showNotification("錢包已成功連接！支付地址已更新。");
        }
    });

    // 打開購買流程彈窗
    buyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const nftCard = button.closest('.nft-card');
            const nftName = nftCard.querySelector('h3').textContent;
            const nftPrice = nftCard.querySelector('p').textContent.split('：')[1]; // 取價格

            document.getElementById('nft-name').textContent = nftName;
            document.getElementById('nft-price').textContent = `價格：${nftPrice}`;
            document.getElementById('nft-stock').textContent = `庫存：${nftInventory[nftName]}`;
            quantityInput.value = 1; // 預設數量為1

            // 計算並更新初始總價
            const pricePerItemMTC = parseFloat(nftPrice) || 0;
            const initialTotalPriceMTC = (pricePerItemMTC * 1).toFixed(2); // 預設數量為1
            const initialTotalPriceTWD = (initialTotalPriceMTC * exchangeRate).toFixed(2);

            document.getElementById('total-price-mtc').textContent = `總價（MTC）：${initialTotalPriceMTC} MTC`;
            document.getElementById('total-price-twd').textContent = `總價（TWD）：${initialTotalPriceTWD > 0 ? initialTotalPriceTWD : "0.00"} TWD`;

            // 顯示彈窗
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
            showNotification("正在連接錢包，請稍候...");
            setTimeout(() => {
                const walletAddresses = Object.keys(walletDatabase);
                currentWalletAddress = walletAddresses[Math.floor(Math.random() * walletAddresses.length)];
                walletConnected = true;
                connectWalletButton.textContent = "已連接錢包";
                const balance = walletDatabase[currentWalletAddress].balance;
                walletBalanceSpan.textContent = `餘額：${balance} MTC`;
                showNotification("錢包已成功連接！");
            }, 1500);
            return;
        }

        const nftName = selectedNft.name;
        const quantity = parseInt(quantityInput.value) || 1;
        const totalPriceMTC = (parseFloat(selectedNft.price) * quantity).toFixed(2);
        const totalPriceTWD = (totalPriceMTC * exchangeRate).toFixed(2);

        // 驗證支付地址
        const paymentAddressValue = document.getElementById('payment-address').value;
        if (!paymentAddressValue.startsWith("0x") || paymentAddressValue.length !== 42) {
            showNotification("請輸入有效的支付地址！");
            return;
        }

        // 驗證餘額是否足夠
        if (walletDatabase[currentWalletAddress].balance < totalPriceMTC) {
            showNotification("錢包餘額不足，無法完成購買！");
            return;
        }

        // 驗證庫存是否足夠
        if (quantity > nftInventory[nftName]) {
            showNotification("購買數量超過庫存！");
            return;
        }

        // 扣除餘額和庫存
        walletDatabase[currentWalletAddress].balance = (walletDatabase[currentWalletAddress].balance - totalPriceMTC).toFixed(2);
        nftInventory[nftName] -= quantity;

        // 更新餘額顯示
        walletBalanceSpan.textContent = `餘額：${walletDatabase[currentWalletAddress].balance} MTC`;

        // 生成訂單編號
        const transactionID = Math.random().toString(36).substr(2, 9).toUpperCase();

        // 顯示訂單編號
        document.getElementById('order-id').textContent = `訂單編號: ${transactionID}`;

        // 顯示新台幣總價
        document.getElementById('total-price-twd').textContent = `總價：${totalPriceTWD} TWD`;

        purchasePopup.style.display = 'none';
        confirmationPopup.style.display = 'flex';

        // 顯示交易信息
        displayTransactionInfo(transactionID, nftName, quantity, totalPriceMTC, paymentAddressValue);

        // 更新交易記錄
        logTransaction(transactionID, nftName, quantity, totalPriceMTC, paymentAddressValue);
    
        // 影響匯率
        updateExchangeRateAfterPurchase(quantity, parseFloat(selectedNft.price));
    });

    // 關閉訂單成功彈窗
    closeConfirmationButton.addEventListener('click', function() {
        confirmationPopup.style.display = 'none';
    });

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
            } else {
                // 未收藏 -> 添加收藏
                favorites.add(nftName);
                this.textContent = '💔 取消收藏';

                // 更新收藏區
                const favoriteCard = document.createElement('div');
                favoriteCard.className = 'favorite-card';
                favoriteCard.innerHTML = `
                    <img src="${nftImage}" alt="${nftName}" style="width:200px;height:auto;border-radius:5px;">
                    <p>${nftName}</p>
                `;
                favoritesList.appendChild(favoriteCard);
            }

            // 清空並重新顯示收藏列表
            updateFavoritesList();
        });
    });

    // 更新收藏列表
    function updateFavoritesList() {
        favoritesList.innerHTML = ''; // 清空收藏區域

        if (favorites.size === 0) {
            favoritesList.innerHTML = '<p>尚無收藏，快去添加吧！</p>';
        } else {
            favorites.forEach(nftName => {
                const nftCard = Array.from(document.querySelectorAll('.nft-card')).find(card => card.querySelector('h3').textContent === nftName);
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

    // 顯示交易信息
    function displayTransactionInfo(transactionID, nftName, quantity, totalPrice, paymentAddress) {
        const transactionDetails = document.getElementById('transaction-details');
        transactionDetails.innerHTML = `
            <div class="transaction-item">
                <p><strong>交易ID:</strong> ${transactionID}</p>
                <p><strong>購買NFT:</strong> ${nftName}</p>
                <p><strong>數量:</strong> ${quantity}</p>
                <p><strong>總價:</strong> ${totalPrice} MTC</p>
                <p><strong>支付地址:</strong> ${paymentAddress}</p>
            </div>
            <hr>
        `;
    }

    // 更新交易記錄
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

    // 更新交易記錄 UI
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

    // 更新匯率時顯示變化
    function updateExchangeRateWithChange() {
        const rate = parseFloat(exchangeRate);
        const previousRate = parseFloat(lastExchangeRate);
        const changePercentage = (((rate - previousRate) / previousRate) * 100).toFixed(2);

        // 更新顯示文字，包含變化百分比和圖示
        exchangeRateElement.textContent = `1 TWD = ${rate} MTC (${changePercentage}% ${changePercentage >= 0 ? '🔼' : '🔽'})`;

        // 移除舊的動畫類別
        exchangeRateElement.classList.remove('price-up', 'price-down');

        // 添加新的動畫類別
        if (rate > previousRate) {
            exchangeRateElement.classList.add('price-up');
        } else {
            exchangeRateElement.classList.add('price-down');
        }

        // 等待動畫完成後移除動畫類別
        setTimeout(() => {
            exchangeRateElement.classList.remove('price-up', 'price-down');
        }, 3500); // 保持 3.5 秒後移除類別

        // 更新上一次的匯率
        lastExchangeRate = rate;
    }

    // 更新匯率並顯示變化
    setInterval(() => {
        fetchExchangeRate(); // 獲取最新匯率
        updateExchangeRateWithChange(); // 更新匯率顯示
        updateExchangeRateChart(); // 更新匯率圖表
    }, 3000); // 每 3 秒更新一次

    // 模擬獲取即時匯率
    function fetchExchangeRate() {
        // 設置波動範圍
        const fluctuationRange = 0.1; // 每次波動的最大幅度
        const randomFluctuation = (Math.random() * 2 - 1) * fluctuationRange; // 生成-0.1到0.1之間的隨機數
    
        // 暴漲或暴跌的最大幅度
        const extremeFluctuationRange = 1.0; // 暴漲或暴跌的最大幅度
        
        // 隨機設置暴漲或暴跌的機率在30%到60%之間
        const extremeFluctuationProbability = Math.random() * 0.3 + 0.3; // 生成介於 0.3 和 0.6 之間的隨機數
    
        if (Math.random() < extremeFluctuationProbability) {
            // 暴漲或暴跌
            if (Math.random() < 0.5) {
                // 暴漲
                exchangeRate += extremeFluctuationRange;
            } else {
                // 暴跌
                exchangeRate -= extremeFluctuationRange;
            }
        } else {
            // 正常波動
            exchangeRate += randomFluctuation;
        }
    
        exchangeRate = parseFloat(exchangeRate.toFixed(2));
    }    

    // 開啟圖片彈窗
    [artistImages, nftImages].forEach(imageGroup => {
        imageGroup.forEach(image => {
            image.addEventListener('click', function() {
                modalImage.src = image.getAttribute('data-image');
                modal.style.display = 'flex';  // 顯示彈窗
            });
        });
    });

    // 關閉圖片彈窗
    [closeModal, modal].forEach(closeItem => {
        closeItem.addEventListener('click', function(event) {
            if (event.target === modal || event.target === closeModal) {
                modal.style.display = 'none';  // 隱藏彈窗
            }
        });
    });

    // 內部跳轉連結
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
    const nftNames = ["NFT1", "NFT2", "NFT3"]; // 模擬三個 NFT
    const initialDataCount = 10; // 初始時間點數量
    const ctx = document.getElementById('nftPriceChart').getContext('2d');
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
                        text: '時間 (每5秒更新一次)',
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            return labels[index];
                        },
                        maxRotation: 0,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: '價格 (MTC)',
                    }
                }
            }
        }
    });

    // 模擬價格更新
    setInterval(() => {
        priceDatasets.forEach(dataset => {
            const newPrice = (Math.random() * 10 + 5).toFixed(2);
            dataset.data.push(newPrice);
            if (dataset.data.length > initialDataCount) {
                dataset.data.shift();
            }
        });

        const currentTime = new Date();
        labels.push(formatTime(currentTime));
        if (labels.length > initialDataCount) {
            labels.shift();
        }

        nftPriceChart.update();
    }, 5000); // 每 5 秒更新一次

    // 更新NFT價格
    setInterval(() => {
        const nftCards = document.querySelectorAll('.nft-card');
        nftCards.forEach(card => {
            const priceElement = card.querySelector('.nft-price');
            const oldPrice = parseFloat(priceElement.textContent.split('：')[1]);
            const newPrice = (oldPrice * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2);

            priceElement.textContent = `價格：${newPrice} MTC`;
            if (newPrice > oldPrice) {
                priceElement.classList.add('price-up');
            } else {
                priceElement.classList.add('price-down');
            }

            // 移除舊的動畫類別
            setTimeout(() => {
                priceElement.classList.remove('price-up', 'price-down');
            }, 3500); // 保持 3.5 秒後移除類別
        });
    }, 3000); // 每 5 秒更新一次

    // 影響匯率的函數
    function updateExchangeRateAfterPurchase(quantity, price) {
        // 根據購買的數量和價格來影響匯率
        const impactFactor = 0.02; // 影響因子，可以根據需要調整
        const priceImpact = price * impactFactor * quantity;

        // 隨機決定是漲還是跌
        if (Math.random() < 0.5) {
            exchangeRate += priceImpact;
        } else {
            exchangeRate -= priceImpact;
        }

        // 確保匯率至少大於 0
        if (exchangeRate <= 0) {
            exchangeRate = 0.01; // 設置一個很小的正數以避免負值
        }

        fetchExchangeRate(); // 更新匯率
        updateExchangeRateWithChange(); // 更新匯率顯示
        updateExchangeRateChart(); // 更新匯率圖表
    }

    // 初始化匯率圖表
    const ctxRate = document.getElementById('exchange-rate-chart').getContext('2d');
    const exchangeRateData = {
        labels: [],
        datasets: [{
            label: '匯率變動 (TWD to MTC)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: false,
        }]
    };

    const exchangeRateChart = new Chart(ctxRate, {
        type: 'line',
        data: exchangeRateData,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const currentValue = context.raw;
                            const prevValue = context.dataset.data[context.dataIndex - 1] || currentValue;
                            const changePercent = (((currentValue - prevValue) / prevValue) * 100).toFixed(2);
                            return `${context.dataset.label}: ${currentValue} (${changePercent}% ${changePercent >= 0 ? '📈' : '📉'})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '時間 (每3秒更新一次)'
                    },
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: '匯率 (MTC)'
                    }
                }
            }
        }
    });

    // 更新匯率圖表
    function updateExchangeRateChart() {
        const currentTime = new Date();
        exchangeRateData.labels.push(formatTime(currentTime));
        exchangeRateData.datasets[0].data.push(exchangeRate);

        if (exchangeRateData.labels.length > 50) {
            exchangeRateData.labels.shift();
            exchangeRateData.datasets[0].data.shift();
        }

        exchangeRateChart.update();
    }

    // 時間格式化
    function formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
});
