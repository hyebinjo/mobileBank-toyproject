export default class TransactionList {
  constructor(data, listContainer) {
    this.data = data;
    this.dayExpense;
    this.classifiedExpense = [0, 0, 0, 0, 0];
    this.listContainer = listContainer;
  }

  getDay(obj) {
    const today = new Date("2021-09-30");
    const date = new Date(obj.date);
    const gap = (today - date) / 1000 / 60 / 60 / 24;
    if (gap === 0) {
      return "오늘";
    } else if (gap === 1) {
      return "어제";
    } else {
      return `${obj.date}`;
    }
  }

  setDayExpense() {
    let prevDate;
    this.data.forEach((item) => {
      if (item.income === "in") return;
      if (item.date !== prevDate) {
        prevDate = item.date;
        this.dayExpense = { ...this.dayExpense, [item.date]: item.price };
      } else {
        this.dayExpense[item.date] += item.price;
      }
    });
  }

  renderDays() {
    this.setDayExpense();
    let prevDate = null;
    this.data.forEach((item) => {
      if (item.date !== prevDate) {
        prevDate = item.date;
        this.listContainer.innerHTML += `
        <div class="transaction">
          <div class="transaction-status">
            <h3 class="transaction-date">${this.getDay(item)}</h3>
            <span class="transaction-total" id="total${item.date}">
              ${Number(this.dayExpense[item.date]).toLocaleString()}원 지출
            </span>
          </div>
          <ul class="transaction__list" id="list${item.date}"></ul>
        </div>`;
      }
    });
  }

  renderItems() {
    let prevDate;
    let transactionList;
    this.data.forEach((item) => {
      if (item.date !== prevDate) {
        transactionList = document.querySelector(`#list${item.date}`);
        prevDate = item.date;
      }
      transactionList.innerHTML += `
      <li class="transaction__item">
        <span class="transaction__content">${item.history}</span>
        <span class="transaction__amount ${item.income}">${
        item.income === "in"
          ? "+" + item.price.toLocaleString()
          : item.price.toLocaleString()
      }</span>
      </li>`;
    });
  }

  addDragEventListener() {
    const bar = this.listContainer.querySelector(".horizontal-bar");
    bar.addEventListener("touchmove", (e) => {
      e.preventDefault();
      e.target.parentNode.style.top = `${e.touches[0].clientY}px`;
    });
    bar.addEventListener("touchend", (e) => {
      e.preventDefault();
      if (
        e.target.getBoundingClientRect().top >= 56 &&
        e.target.getBoundingClientRect().top <= 352
      )
        return;
      else if (e.target.getBoundingClientRect().top < 56)
        e.target.parentNode.style.top = "56px";
      else e.target.parentNode.style.top = "352px";
    });
  }

  getDailyExpenseData() {
    const dailyExpenseArr = new Array(31);
    for (let i = 0; i < dailyExpenseArr.length; i++) {
      dailyExpenseArr[i] = 0;
    }
    this.data.reverse().forEach((item) => {
      if (item.income === "in") return;
      dailyExpenseArr[new Date(item.date).getDate() - 1] += item.price;
    });
    return dailyExpenseArr;
  }

  classifyExpense(item) {
    if (item.income === "in") return;
    switch (item.classify) {
      case "oiling":
        this.classifiedExpense[0] += Number(item.price);
        break;
      case "health":
        this.classifiedExpense[1] += Number(item.price);
        break;
      case "eatout":
        this.classifiedExpense[2] += Number(item.price);
        break;
      case "mart":
        this.classifiedExpense[3] += Number(item.price);
        break;
      case "shopping":
        this.classifiedExpense[4] += Number(item.price);
        break;
      default:
        break;
    }
  }

  getClassifiedExpenseData() {
    this.data.forEach((item) => this.classifyExpense(item));
    return this.classifiedExpense;
  }
}
