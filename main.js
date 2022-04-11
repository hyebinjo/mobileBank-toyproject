const today = new Date("2021-09-30");
const labels = ["주유비", "건강관리비", "외식비", "장보기", "상점"];
let totalExpense;
fetch(
  "https://gist.githubusercontent.com/hyebinjo/910c88016597b5fd3df83e99c8e1f7cc/raw/56a7fe7d5f03349a09c473a3f620871b750ce706/bank.json"
)
  .then((res) => res.json())
  .then((obj) => obj.bankList)
  .then((bankList) => bankList.reverse())
  .then((bankList) => LoadTransactionList(bankList))
  .then((classifiedExpense) => addClassifiedExpense(classifiedExpense, labels));

function LoadTransactionList(bankList) {
  let sum;
  for (let i = 0; i < bankList.length; i++) {
    if (i <= 0 || bankList[i].date !== bankList[i - 1].date) {
      sum = 0;
      addTransactionDay(bankList[i], today);
    }
    sum = addTransactionItem(bankList[i], sum);
    classifyExpense(bankList[i]);
    if (i >= bankList.length - 1 || bankList[i].date !== bankList[i + 1].date) {
      document.querySelector(
        `#total${bankList[i].date}`
      ).textContent = `${sum}원 지출`;
      addDailyExpense(bankList[i].date, sum);
    }
  }
  return classifiedExpense;
}

function addTransactionDay(obj, today) {
  const accountDetail = document.querySelector(".account-detail");
  const transaction = document.createElement("div");
  transaction.setAttribute("class", `transaction`);
  accountDetail.appendChild(transaction);
  transaction.innerHTML = `
  <div class="transaction-status">
    <h3 class="transaction-date"></h3>
    <span class="transaction-total" id='total${obj.date}'>원 지출</span>
  </div>
  <ul class="transaction__list" id='list${obj.date}'>
  </ul>
  `;
  const h3 = transaction.querySelector("h3");
  const date = new Date(obj.date);
  const gap = (today - date) / 1000 / 60 / 60 / 24;
  if (gap === 0) {
    h3.innerText = "오늘";
  } else if (gap === 1) {
    h3.innerText = "어제";
  } else {
    h3.innerText = `${obj.date}`;
  }
}

function addTransactionItem(obj, sum) {
  const transactionList = document.querySelector(`#list${obj.date}`);
  const transactionItem = document.createElement("li");
  transactionItem.setAttribute("class", "transaction__item");
  transactionItem.innerHTML = `
  <span class="transaction__content">${obj.history}</span>
  <span class="transaction__amount">${obj.price}</span>
  `;
  const amount = transactionItem.querySelector(".transaction__amount");
  if (obj.income === "in") {
    amount.classList.add("income");
    const text = amount.textContent;
    amount.textContent = `+${text}`;
  } else if (obj.income === "out") {
    amount.classList.add("outcome");
    sum += Number(amount.textContent);
  }
  transactionList.appendChild(transactionItem);
  return sum;
}

// 월간지출패턴 분류
let classifiedExpense = [0, 0, 0, 0, 0];
function classifyExpense(listItem) {
  if (listItem.income === "in") return;
  switch (listItem.classify) {
    case "oiling":
      classifiedExpense[0] += Number(listItem.price);
      break;
    case "health":
      classifiedExpense[1] += Number(listItem.price);
      break;
    case "eatout":
      classifiedExpense[2] += Number(listItem.price);
      break;
    case "mart":
      classifiedExpense[3] += Number(listItem.price);
      break;
    case "shopping":
      classifiedExpense[4] += Number(listItem.price);
      break;
    default:
      break;
  }
}

//월 지출패턴 리스트 추가
function addClassifiedExpense(classifiedExpense, labels) {
  const ul = document.querySelector(".monthly-report__list");
  for (let i = 0; i < labels.length; i++) {
    const li = document.createElement("li");
    li.setAttribute("class", "monthly-report__item");
    ul.appendChild(li);
    li.innerHTML = `
    <span class="monthly-report__content">${labels[i]}</span>
    <span class="monthly-report__amount">${classifiedExpense[i]}원</span>
  `;
  }
  return (totalExpense = classifiedExpense.reduce((a, b) => a + b, 0));
}

//일간 지출내역
let dailyExpense = new Array(31);
function addDailyExpense(date, sum) {
  const day = new Date(date).getDate() - 1;
  dailyExpense[day] = sum;
}

// 계좌상세공간 슬라이드
const bar = document.querySelector(".horizontal-bar");
bar.addEventListener("touchmove", (e) => {
  e.preventDefault();
  e.target.parentNode.style.top = `${e.touches[0].clientY}px`;
});
bar.addEventListener("touchend", (e) => {
  e.preventDefault();
  if(e.target.getBoundingClientRect().top >= 56 && e.target.getBoundingClientRect().top <= 352) return;
  else if (e.target.getBoundingClientRect().top < 56) e.target.parentNode.style.top = '56px';
  else e.target.parentNode.style.top = '352px';
});

// 지출관리 화면 열기
const graphBtn = document.querySelector(".link-graph");
graphBtn.addEventListener("click", (e) => {
  const expensePage = document.querySelector(".expense-management");
  expensePage.style.display = "block";
});

//지출관리 화면 닫기
const closeBtn = document.querySelector(".expense-management__closeBtn");
closeBtn.addEventListener("click", (e) => {
  const expensePage = document.querySelector(".expense-management");
  expensePage.style.display = "none";
});

//지출관리 일간리포트
const dailyData = {
  labels: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ],
  datasets: [
    {
      backgroundColor: "#38C976",
      data: dailyExpense,
    },
  ],
};

const dailyConfig = {
  type: "bar",
  data: dailyData,
  options: {
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};

const dailyChart = new Chart(
  document.getElementById("dailyBarChart"),
  dailyConfig
);

//지출관리 월 지출패턴
const monthlyData = {
  datasets: [
    {
      data: classifiedExpense,
      backgroundColor: ["#BD5B00", "#0057BD", "#00BDB2", "#FEC229", "#C4C4C4"],
      weight: "40",
    },
  ],
  labels: labels,
};

const monthlyConfig = {
  type: "doughnut",
  data: monthlyData,
  options: {
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "80%",
  },
  plugins: [
    {
      id: "text",
      beforeDraw: function (chart) {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;

        const text = `${totalExpense}원`;
        ctx.font = "24" + "px " + "Noto Sans CJK KR";
        ctx.fillStyle = "#000000";

        const textX = width / 2 - ctx.measureText(text).width / 2;
        const textY = height / 2 + 12;

        ctx.fillText(text, textX, textY);
      },
    },
  ],
};

const monthlyChart = new Chart(
  document.getElementById("monthlyDoughnutChart"),
  monthlyConfig
);
