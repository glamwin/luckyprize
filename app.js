const prizes = [
  { label: '+50 ₽', amount: 50, color: '#4de0ff' },
  { label: '+100 ₽', amount: 100, color: '#65ffcb' },
  { label: '+0 ₽', amount: 0, color: '#6b7ea8' },
  { label: '+250 ₽', amount: 250, color: '#ff9d5c' },
  { label: '+500 ₽', amount: 500, color: '#ffd86a' },
  { label: '+0 ₽', amount: 0, color: '#7f6fff' },
  { label: '+150 ₽', amount: 150, color: '#ff85c2' },
  { label: '+50 ₽', amount: 50, color: '#98ff7a' }
];

const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spinButton');
const result = document.getElementById('result');
const balanceNode = document.getElementById('balance');
const prizesList = document.getElementById('prizesList');

let balance = 1000;
let currentRotation = 0;

function renderWheel() {
  const sectorSize = 360 / prizes.length;
  const sectors = prizes
    .map((prize, index) => {
      const start = index * sectorSize;
      const end = (index + 1) * sectorSize;
      return `${prize.color} ${start}deg ${end}deg`;
    })
    .join(', ');

  wheel.style.background = `conic-gradient(${sectors})`;
}

function renderLegend() {
  prizesList.innerHTML = '';
  prizes.forEach((prize) => {
    const item = document.createElement('li');
    item.textContent = `${prize.label} — ${prize.amount > 0 ? 'зачисление на баланс' : 'без выигрыша'}`;
    prizesList.appendChild(item);
  });
}

function updateBalance() {
  balanceNode.textContent = `${balance.toLocaleString('ru-RU')} ₽`;
}

function spin() {
  spinButton.disabled = true;
  result.textContent = 'Колесо крутится...';

  const winnerIndex = Math.floor(Math.random() * prizes.length);
  const sectorSize = 360 / prizes.length;

  const winnerCenterAngle = winnerIndex * sectorSize + sectorSize / 2;
  const targetAngle = 360 - winnerCenterAngle;
  const extraTurns = 6 * 360;

  currentRotation += extraTurns + targetAngle + Math.random() * (sectorSize / 2);
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    const wonPrize = prizes[winnerIndex];
    balance += wonPrize.amount;
    updateBalance();

    result.textContent =
      wonPrize.amount > 0
        ? `Выпало ${wonPrize.label}. Баланс пополнен! 🎉`
        : 'В этот раз без выигрыша. Попробуй снова!';

    spinButton.disabled = false;
  }, 5200);
}

spinButton.addEventListener('click', spin);
renderWheel();
renderLegend();
updateBalance();
