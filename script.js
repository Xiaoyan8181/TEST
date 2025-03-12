// 侍靈資料
let rare = [
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0
];
let name = [
    "瑞", "焱", "阿豪", "九尾", "騰蛇",
    "玄武", "麒麟", "諦聽", "白澤", "蒼龍",
    "金烏", "夔牛", "鯤鵬", "月靈", "魯魯",
    "阿樂", "玥兒", "琉璃", "梟梟", "蠻蠻",
    "佑佑", "鴨鴨", "阿猛", "白狐", "喬喬",
    "阿琢", "康康", "阿賀", "元元", "阿先",
    "奇奇", "大桶", "雪人"
];
let dice = [
    [4, 4, 4, 5, 5, 5], [3, 3, 5, 5, 6, 6], [0, 2, 4, 4, 8, 10], [3, 3, 5, 5, 6, 6], [4, 4, 6, 6, 8, 8],
    [1, 3, 3, 6, 9, 9], [4, 4, 4, 5, 5, 5], [2, 2, 4, 4, 7, 7], [4, 4, 4, 5, 5, 5], [4, 4, 4, 5, 5, 5],
    [0, 2, 4, 4, 8, 10], [4, 4, 4, 5, 5, 5], [4, 4, 4, 5, 5, 5], [4, 4, 4, 5, 5, 5],
    [1, 2, 2, 6, 6, 6], [1, 3, 3, 4, 5, 6], [2, 3, 3, 4, 5, 5], [2, 2, 3, 5, 5, 6], [3, 3, 3, 3, 5, 5],
    [2, 4, 4, 4, 4, 6], [2, 2, 4, 4, 4, 6], [0, 2, 3, 4, 5, 10], [2, 2, 3, 3, 6, 8], [3, 3, 3, 4, 4, 4],
    [3, 3, 3, 4, 4, 4], [0, 2, 3, 4, 5, 10], [0, 2, 3, 4, 5, 10], [0, 2, 3, 4, 5, 10], [3, 3, 3, 4, 4, 4],
    [3, 3, 3, 4, 4, 4], [3, 3, 3, 4, 4, 4], [1, 2, 3, 4, 5, 6], [0, 1, 4, 4, 6, 6]
];

// 已選擇的侍靈
let selectedSpirits = [];
let totalSimulations = 100000;

// 聲音
const rjjdcAudio = new Audio('audio/RJJDC.mp3');

// 目錄按鈕事件
document.getElementById('start').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('selection').style.display = 'block';
    loadSpiritList();
});

document.getElementById('instructions').addEventListener('click', () => {
    alert('使用說明：選擇至多4個侍靈，然後每個侍靈填入6種道具的數值，計算勝率。');
});

document.getElementById('author').addEventListener('click', () => {
    alert('作者：黑鷺鷺');
});

document.getElementById('settings').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('settings-page').style.display = 'block';
    document.getElementById('sample-size').value = totalSimulations;
    updateCustomSpiritList();
});

document.getElementById('exit').addEventListener('click', () => {
    window.close();
});

// 選擇侍靈頁面 - 回到目錄
document.getElementById('back-to-menu-from-selection').addEventListener('click', () => {
    document.getElementById('selection').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    selectedSpirits = [];
    updateSelectedList();
});

// 為圖片添加點擊播放音頻的事件
document.getElementById('rjjdc-image').addEventListener('click', () => {
    rjjdcAudio.play().catch(error => {
        console.error('錯誤', error);
    });
});

// 設定頁面 - 保存並返回
document.getElementById('save-settings').addEventListener('click', () => {
    const newSampleSize = parseInt(document.getElementById('sample-size').value);
    if (newSampleSize >= 1000) {
        totalSimulations = newSampleSize;
        document.getElementById('settings-page').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
    } else {
        alert('樣本數不能小於1000');
    }
});

// 新增自訂侍靈
document.getElementById('add-custom-spirit').addEventListener('click', () => {
    const form = document.getElementById('custom-spirit-form');
    form.style.display = 'block';
    form.innerHTML = `
        <div>
            <input type="text" name="spirit-name" placeholder="名稱" required>
            <input type="number" name="dice1" min="0" max="10" placeholder="點數1" required>
            <input type="number" name="dice2" min="0" max="10" placeholder="點數2" required>
            <input type="number" name="dice3" min="0" max="10" placeholder="點數3" required>
            <input type="number" name="dice4" min="0" max="10" placeholder="點數4" required>
            <input type="number" name="dice5" min="0" max="10" placeholder="點數5" required>
            <input type="number" name="dice6" min="0" max="10" placeholder="點數6" required>
            <button id="confirm-custom-spirit">確定新增侍靈</button>
        </div>
    `;

    document.getElementById('confirm-custom-spirit').addEventListener('click', () => {
        const spiritName = form.querySelector('input[name="spirit-name"]').value;
        const diceValues = [
            parseInt(form.querySelector('input[name="dice1"]').value),
            parseInt(form.querySelector('input[name="dice2"]').value),
            parseInt(form.querySelector('input[name="dice3"]').value),
            parseInt(form.querySelector('input[name="dice4"]').value),
            parseInt(form.querySelector('input[name="dice5"]').value),
            parseInt(form.querySelector('input[name="dice6"]').value)
        ];

        if (spiritName && diceValues.every(val => !isNaN(val) && val >= 0 && val <= 100)) {
            name.push(spiritName);
            dice.push(diceValues);
            rare.push(1); // 默認稀有度為 1
            form.style.display = 'none';
            updateCustomSpiritList();
            loadSpiritList();
        } else {
            alert('請輸入名稱和至多100的點數');
        }
    });
});

// 更新自訂侍靈列表
function updateCustomSpiritList() {
    const customList = document.getElementById('custom-spirit-list');
    customList.innerHTML = '';
    const customStartIndex = 33; // 原始侍靈數量為 33（0-32）
    for (let i = customStartIndex; i < name.length; i++) {
        const entry = document.createElement('div');
        entry.classList.add('custom-spirit-entry');
        entry.innerHTML = `
            <span>${name[i]} ${dice[i].join(' ')}</span>
            <button class="delete-custom-spirit" data-index="${i}">刪除侍靈</button>
        `;
        customList.appendChild(entry);
    }

    document.querySelectorAll('.delete-custom-spirit').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            name.splice(index, 1);
            dice.splice(index, 1);
            rare.splice(index, 1);
            selectedSpirits = selectedSpirits.filter(id => id !== index).map(id => id > index ? id - 1 : id);
            updateCustomSpiritList();
            loadSpiritList();
        });
    });
}

// 加載侍靈列表
function loadSpiritList() {
    const spiritList = document.getElementById('spirit-list');
    spiritList.innerHTML = '';
    name.forEach((spiritName, index) => {
        const spiritDiv = document.createElement('div');
        spiritDiv.textContent = spiritName;
        spiritDiv.classList.add('spirit');
        if (index >= 33) spiritDiv.classList.add('custom'); // 自訂侍靈添加 custom 類別
        else if (rare[index] === 2) spiritDiv.classList.add('epic');
        else if (rare[index] === 1) spiritDiv.classList.add('rare');
        else spiritDiv.classList.add('common');
        spiritDiv.style.backgroundImage = `url('images/${String(index + 1).padStart(3, '0')}.png')`;
        spiritDiv.addEventListener('click', () => selectSpirit(index));
        spiritList.appendChild(spiritDiv);
    });
}

// 選擇侍靈
function selectSpirit(index) {
    if (selectedSpirits.includes(index)) {
        selectedSpirits = selectedSpirits.filter(i => i !== index);
    } else if (selectedSpirits.length < 4) {
        selectedSpirits.push(index);
    } else {
        alert('最多只能選擇4個侍靈！');
        return;
    }
    updateSelectedList();
}

// 更新已選擇列表
function updateSelectedList() {
    const selectedList = document.getElementById('selected-list');
    selectedList.innerHTML = '';
    const propLabels = ['+0~2', '-0~2', '+2~4', '-2~4', '骰子+1', '點數=1'];

    selectedSpirits.forEach(index => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('selected-item');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name[index];
        nameSpan.classList.add('spirit');
        if (index >= 33) nameSpan.classList.add('custom'); // 自訂侍靈添加 custom 類別
        else if (rare[index] === 2) nameSpan.classList.add('epic');
        else if (rare[index] === 1) nameSpan.classList.add('rare');
        else nameSpan.classList.add('common');
        nameSpan.style.backgroundImage = `url('images/${String(index + 1).padStart(3, '0')}.png')`;
        nameSpan.addEventListener('click', () => {
            selectedSpirits = selectedSpirits.filter(i => i !== index);
            updateSelectedList();
        });
        itemDiv.appendChild(nameSpan);

        const row1 = document.createElement('div');
        row1.classList.add('prop-row');
        [0, 2, 4].forEach(i => {
            const inputWrapper = document.createElement('div');
            inputWrapper.classList.add('input-wrapper');

            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.value = '0';
            input.classList.add('prop-input');

            const label = document.createElement('span');
            label.textContent = propLabels[i];
            label.classList.add('prop-label');

            inputWrapper.appendChild(input);
            inputWrapper.appendChild(label);
            row1.appendChild(inputWrapper);
        });
        itemDiv.appendChild(row1);

        const row2 = document.createElement('div');
        row2.classList.add('prop-row');
        [1, 3, 5].forEach(i => {
            const inputWrapper = document.createElement('div');
            inputWrapper.classList.add('input-wrapper');

            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.value = '0';
            input.classList.add('prop-input');

            const label = document.createElement('span');
            label.textContent = propLabels[i];
            label.classList.add('prop-label');

            inputWrapper.appendChild(input);
            inputWrapper.appendChild(label);
            row2.appendChild(inputWrapper);
        });
        itemDiv.appendChild(row2);

        selectedList.appendChild(itemDiv);
    });
}

// 確認選擇並開始計算
document.getElementById('confirm').addEventListener('click', () => {
    if (selectedSpirits.length === 0) {
        alert('請至少選擇一個侍靈！');
        return;
    }
    calculateWinRate();
});

// 計算勝率
function calculateWinRate() {
    const props = selectedSpirits.map((spiritIndex, i) => {
        const inputs = document.querySelectorAll('#selected-list .selected-item')[i].querySelectorAll('input');
        return Array.from(inputs).map(input => parseInt(input.value) || 0);
    });

    const wins = new Array(selectedSpirits.length).fill(0);

    for (let sim = 0; sim < totalSimulations; sim++) {
        let scores = new Array(selectedSpirits.length).fill(0);
        let propsCopy = props.map(row => [...row]);

        while (true) {
            for (let i = 0; i < selectedSpirits.length; i++) {
                const diceRoll = dice[selectedSpirits[i]][Math.floor(Math.random() * 6)];
                let adjustedRoll = diceRoll;

                const totalProps = propsCopy[i].reduce((sum, val) => sum + val, 0);
                if (totalProps > 0) {
                    const rand = Math.random() * totalProps;
                    let cumulative = 0;
                    let propIndex = -1;

                    for (let j = 0; j < propsCopy[i].length; j++) {
                        cumulative += propsCopy[i][j];
                        if (rand <= cumulative) {
                            propIndex = j;
                            break;
                        }
                    }

                    propsCopy[i][propIndex]--;

                    switch (propIndex) {
                        case 0: adjustedRoll += Math.floor(Math.random() * 3); break;       // +0~2
                        case 1: adjustedRoll += 2 + Math.floor(Math.random() * 3); break;   // +2~4
                        case 2: adjustedRoll += dice[selectedSpirits[i]][Math.floor(Math.random() * 6)]; break; // 骰子+1
                        case 3: adjustedRoll -= Math.floor(Math.random() * 3); break;       // -0~2
                        case 4: adjustedRoll -= 2 + Math.floor(Math.random() * 3); break;   // -2~4
                        case 5: adjustedRoll = 1; break;                                   // 點數=1
                    }
                    if (adjustedRoll < 0) adjustedRoll = 0;
                }

                scores[i] += adjustedRoll;
            }

            const maxScore = Math.max(...scores);
            if (maxScore > 120) {
                const winners = scores.filter(score => score === maxScore);
                if (winners.length === 1) {
                    const winnerIndex = scores.indexOf(maxScore);
                    wins[winnerIndex]++;
                    break;
                }
            }
        }
    }

    displayResults(wins, totalSimulations);
}

// 顯示結果
function displayResults(wins, totalSimulations) {
    document.getElementById('selection').style.display = 'none';
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('container');
    
    const title = document.createElement('h1');
    title.textContent = '勝率計算結果';
    resultDiv.appendChild(title);

    const sampleSize = document.createElement('div');
    sampleSize.classList.add('sample-size-text');
    sampleSize.textContent = `本次樣本數: ${totalSimulations}`;
    resultDiv.appendChild(sampleSize);

    const resultTable = document.createElement('div');
    resultTable.classList.add('result-table');

    selectedSpirits.forEach((spiritIndex, i) => {
        const winRate = (wins[i] / totalSimulations * 100).toFixed(2);
        const row = document.createElement('div');
        row.classList.add('result-row');

        const spiritName = document.createElement('span');
        spiritName.classList.add('spirit');
        if (spiritIndex >= 33) spiritName.classList.add('custom'); // 自訂侍靈添加 custom 類別
        else if (rare[spiritIndex] === 2) spiritName.classList.add('epic');
        else if (rare[spiritIndex] === 1) spiritName.classList.add('rare');
        else spiritName.classList.add('common');
        spiritName.style.backgroundImage = `url('images/${String(spiritIndex + 1).padStart(3, '0')}.png')`;
        spiritName.textContent = name[spiritIndex];
        row.appendChild(spiritName);

        const winRateSpan = document.createElement('span');
        winRateSpan.classList.add('win-rate');
        winRateSpan.textContent = `${winRate}% (${wins[i]} 次勝利)`;
        row.appendChild(winRateSpan);

        resultTable.appendChild(row);
    });

    resultDiv.appendChild(resultTable);

    const backToSelectionButton = document.createElement('button');
    backToSelectionButton.textContent = '返回選擇';
    backToSelectionButton.addEventListener('click', () => {
        resultDiv.remove();
        document.getElementById('selection').style.display = 'block';
    });
    resultDiv.appendChild(backToSelectionButton);

    const backToMenuButton = document.createElement('button');
    backToMenuButton.textContent = '回到目錄';
    backToMenuButton.addEventListener('click', () => {
        resultDiv.remove();
        document.getElementById('menu').style.display = 'block';
        selectedSpirits = [];
        updateSelectedList();
    });
    resultDiv.appendChild(backToMenuButton);

    document.body.appendChild(resultDiv);
}
