"use strict";

const accounts = [
  {
    owner: "Robert Downey Jr",
    movements: [50000, 12000, -8000, 300000, -6500, -1300, 700, 13000],
    interestRate: 1.2,
    pin: 1111,
  },

  {
    owner: "Jennifer Lawrence",
    movements: [150000, 80000, -3000, -15000, -40000, -10000, 85000, -300],
    interestRate: 1.5,
    pin: 2222,
  },

  {
    owner: "Ryan Gosling",
    movements: [5000, -5000, 15000, -12000, -2000, 5000, 40000, -46000],
    interestRate: 0.7,
    pin: 3333,
  },

  {
    owner: "Ana de Armas",
    movements: [30000, 50000, 20000, 1000, 9000],
    interestRate: 1,
    pin: 4444,
  },
];

const domElements = {
  welcomeLabel: document.querySelector(".welcome"),
  dateLabel: document.querySelector(".date"),
  balanceLabel: document.querySelector(".balance__value"),
  sumInLabel: document.querySelector(".summary__value--in"),
  sumOutLabel: document.querySelector(".summary__value--out"),
  sumInterestLabel: document.querySelector(".summary__value--interest"),
  timerLabel: document.querySelector(".timer"),
  popupAlert: document.querySelector(".alert-popup"),

  appContainer: document.querySelector(".app"),
  tableContainer: document.querySelector(".table-container"),
  movementsContainer: document.querySelector(".movements"),
  loginContainer: document.querySelector(".login"),

  loginBtn: document.querySelector(".login__btn"),
  logoutBtn: document.querySelector(".logout__btn"),
  transferBtn: document.querySelector(".form__btn--transfer"),
  loanBtn: document.querySelector(".form__btn--loan"),
  closeBtn: document.querySelector(".form__btn--close"),
  sortBtn: document.querySelector(".btn--sort"),

  loginUsernameInput: document.querySelector(".login__input--user"),
  loginPinInput: document.querySelector(".login__input--pin"),
  transferToInput: document.querySelector(".form__input--to"),
  transferAmountInput: document.querySelector(".form__input--amount"),
  loanAmountInput: document.querySelector(".form__input--loan-amount"),
  closeUsernameInput: document.querySelector(".form__input--user"),
  closePinInput: document.querySelector(".form__input--pin"),
};

let timer;
let isSorted = false;
let currentAccount;
let date = new Date();

function displayDate() {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  domElements.dateLabel.textContent = new Intl.DateTimeFormat(
    "en-US",
    options
  ).format(new Date());
}

const handleAlert = (message) => {
  domElements.popupAlert.textContent = message;
  domElements.popupAlert.classList.remove("hidden");
  setTimeout(() => {
    domElements.popupAlert.classList.add("hidden");
  }, 3000);
};

const getFirstLetters = (owner) =>
  owner
    .toLowerCase()
    .split(" ")
    .map((word) => word[0])
    .join("");

const displayTable = () => {
  domElements.tableContainer.innerHTML = "";

  const tableRows = accounts
    .map(
      (acc) => `
        <tr>
          <td>${getFirstLetters(acc.owner)}</td>
          <td>${acc.pin}</td>
        </tr>
      `
    )
    .join("");

  const tableHtml = `
        <table class="table">
          <tr>
            <th>Username</th>
            <th>PIN</th>
          </tr>
          ${tableRows}
        </table>
      `;

  domElements.tableContainer.insertAdjacentHTML("afterbegin", tableHtml);
};

const handleLogout = () => {
  domElements.appContainer.classList.add("hidden");
  domElements.loginContainer.classList.remove("hidden");
  domElements.logoutBtn.classList.add("hidden");
  domElements.welcomeLabel.textContent = `Log in to get started`;
  domElements.tableContainer.classList.remove("hidden");
  isSorted = false;
  currentAccount = undefined;
  clearInterval(timer);
};

const logoutTimer = (isLogin) => {
  if (isLogin) {
    let time = 300;

    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    domElements.timerLabel.textContent = `${min}:${sec}`;

    timer = setInterval(() => {
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
      domElements.timerLabel.textContent = `${min}:${sec}`;

      if (time === 0) {
        clearInterval(timer);
        handleLogout();
      }

      time--;
    }, 1000);
  }
};

const displayMovements = (movements) => {
  domElements.movementsContainer.innerHTML = "";

  const currentMovements = movements || currentAccount.movements;

  currentMovements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;
    domElements.movementsContainer.insertAdjacentHTML("afterbegin", html);
  });
};

const displayBalance = () => {
  const balance = currentAccount.movements.reduce((acc, mov) => acc + mov, 0);
  domElements.balanceLabel.textContent = `${balance.toFixed(2)}€`;
};

const displaySummary = () => {
  const income = currentAccount.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outcome = currentAccount.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = currentAccount.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * currentAccount.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);

  domElements.sumInLabel.textContent = `${income.toFixed(2)}€`;
  domElements.sumOutLabel.textContent = `${Math.abs(outcome.toFixed(2))}€`;
  domElements.sumInterestLabel.textContent = `${interest.toFixed(2)}€`;
};

const handleDisplayUi = () => {
  displayMovements();
  displayBalance();
  displaySummary();
};

const handleTransfer = (e) => {
  e.preventDefault();
  const amount = Number(domElements.transferAmountInput.value);
  const receiverAccount = accounts.find(
    (acc) => getFirstLetters(acc.owner) === domElements.transferToInput.value
  );

  if (
    amount > 0 &&
    receiverAccount &&
    receiverAccount.owner !== currentAccount.owner &&
    currentAccount.movements.some((mov) => mov >= amount)
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    handleDisplayUi();
    domElements.transferAmountInput.value = "";
    domElements.transferToInput.value = "";
    domElements.transferAmountInput.blur();
    domElements.transferToInput.blur();
  } else {
    handleAlert("Invalid transfer");
    domElements.transferAmountInput.value = "";
    domElements.transferToInput.value = "";
    domElements.transferAmountInput.blur();
    domElements.transferToInput.blur();
  }
};

const handleRequestLoan = (e) => {
  e.preventDefault();
  const amount = Number(domElements.loanAmountInput.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    handleDisplayUi();
    domElements.loanAmountInput.value = "";
    domElements.loanAmountInput.blur();
  } else {
    handleAlert("Invalid loan request");
    domElements.loanAmountInput.value = "";
    domElements.loanAmountInput.blur();
  }
};

const handleCloseAccount = (e) => {
  e.preventDefault();
  const enteredUsername = domElements.closeUsernameInput.value;
  const enteredPin = Number(domElements.closePinInput.value);

  if (!enteredUsername || !enteredPin) {
    handleAlert("Please enter a valid username and pin");
    return;
  }

  const firstLettersOfAccounts = accounts.map((account) =>
    getFirstLetters(account.owner)
  );
  const matchedAccount = firstLettersOfAccounts.find(
    (acc) =>
      acc === enteredUsername && acc === getFirstLetters(currentAccount.owner)
  );

  if (matchedAccount) {
    const account = accounts.find(
      (acc) => getFirstLetters(acc.owner) === matchedAccount
    );

    if (account.pin === enteredPin) {
      const index = accounts.findIndex(
        (acc) => getFirstLetters(acc.owner) === matchedAccount
      );
      accounts.splice(index, 1);
      handleLogout();
      displayTable();
      domElements.closeUsernameInput.value = "";
      domElements.closePinInput.value = "";
      domElements.closePinInput.blur();
      domElements.closeUsernameInput.blur();
    } else {
      handleAlert("Wrong credentials");
    }
  } else {
    handleAlert("Wrong credentials");
  }
};

const handleLogin = (e) => {
  e.preventDefault();
  const enteredUsername = domElements.loginUsernameInput.value;
  const enteredPin = Number(domElements.loginPinInput.value);

  if (!enteredUsername || !enteredPin) {
    handleAlert("Please enter a valid username and pin");
    return;
  }

  const firstLettersOfAccounts = accounts.map((account) =>
    getFirstLetters(account.owner)
  );
  const matchedAccount = firstLettersOfAccounts.find(
    (acc) => acc === enteredUsername
  );

  if (matchedAccount) {
    const account = accounts.find(
      (acc) => getFirstLetters(acc.owner) === matchedAccount
    );

    if (account.pin === enteredPin) {
      logoutTimer(true);
      currentAccount = account;
      handleDisplayUi();
      domElements.popupAlert.classList.add("hidden");
      domElements.tableContainer.classList.add("hidden");
      domElements.loginContainer.classList.add("hidden");
      domElements.logoutBtn.classList.remove("hidden");
      domElements.welcomeLabel.textContent = `Welcome back, ${account.owner}`;
      domElements.appContainer.classList.remove("hidden");
      domElements.loginUsernameInput.value = "";
      domElements.loginPinInput.value = "";
      domElements.loginPinInput.blur();
      domElements.loginUsernameInput.blur();
    } else {
      handleAlert("Wrong credentials");
    }
  } else {
    handleAlert("Wrong credentials");
  }
};

domElements.sortBtn.textContent = "SORT";

const handleSort = () => {
  isSorted = !isSorted;
  displayMovements(
    isSorted
      ? currentAccount.movements.slice().sort((a, b) => a - b)
      : currentAccount.movements
  );
  domElements.sortBtn.textContent = isSorted ? "UNSORT" : "SORT";
};

domElements.sortBtn.addEventListener("click", handleSort);
domElements.loginBtn.addEventListener("click", handleLogin);
domElements.logoutBtn.addEventListener("click", handleLogout);
domElements.loanBtn.addEventListener("click", handleRequestLoan);
domElements.transferBtn.addEventListener("click", handleTransfer);
domElements.closeBtn.addEventListener("click", handleCloseAccount);

displayDate();
displayTable();
