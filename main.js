fetch("https://raw.githubusercontent.com/maddrake220/team_toyproject/main/bankData.json")
  .then(res => res.json())
  .then(obj => obj.bankList)
  .then(bankList => bankList.reverse())
  .then(bankList => LoadTransactionList(bankList));
  

const today = new Date('2021-10-03');

function LoadTransactionList(bankList) {
  let sum;
  for (let i = 0; i < bankList.length; i++) {
    if(i<=0 || bankList[i].date !== bankList[i-1].date) {
      sum=0;
      addTransactionDay(bankList[i],today);
    }
    sum = addTransactionItem(bankList[i],sum);
    if(i>=bankList.length-1 || bankList[i].date !== bankList[i+1].date) {
      document.querySelector(`#total${bankList[i].date}`).textContent = `${sum}원 지출`;
    }
  }
}


function addTransactionDay(obj,today) {
  const accountDetail = document.querySelector('.account-detail');
  const transaction = document.createElement('div');
  transaction.setAttribute('class', `transaction`);
  accountDetail.appendChild(transaction);
  transaction.innerHTML = `
  <div class="transaction-status">
    <h3 class="transaction-date"></h3>
    <span class="transaction-total" id='total${obj.date}'>원 지출</span>
  </div>
  <ul class="transaction__list" id='list${obj.date}'>
  </ul>
  `;
  const h3 = transaction.querySelector('h3');
  const date = new Date(obj.date);
  const gap = (today-date)/1000/60/60/24;
  if(gap === 0) {
    h3.innerText = '오늘';
  } else if(gap === 1) {
    h3.innerText = '어제';
  } else{
    h3.innerText = `${gap}일 전`;
  }
}


function addTransactionItem(obj,sum) {
  const transactionList = document.querySelector(`#list${obj.date}`);
  const transactionItem = document.createElement('li');
  transactionItem.setAttribute('class', 'transaction__item');
  transactionItem.innerHTML = `
  <span class="transaction__content">${obj.history}</span>
  <span class="transaction__amount">${obj.price}</span>
  `;
  const amount = transactionItem.querySelector('.transaction__amount');
  if(obj.income === 'in') {
    amount.classList.add('income');
    const text = amount.textContent;
    amount.textContent = `+${text}`
  } else if(obj.income === 'out') {
    amount.classList.add('outcome');
    sum += Number(amount.textContent);
  }
  transactionList.appendChild(transactionItem);
  return sum;
}

// 계좌상세공간 슬라이드
const bar = document.querySelector('.horizontal-bar');
bar.addEventListener('touchmove', e => {
  e.preventDefault();
  e.target.parentNode.style.top = `${e.touches[0].clientY}px`;
})