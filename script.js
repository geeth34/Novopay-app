'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: 
  [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-04-27T17:01:17.194Z',
    '2024-04-28T23:36:17.929Z',
    '2024-04-29T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: 
  [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: 
  [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'hi-IN', 
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: 
  [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

// Elements 
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin'); 
const introBox = document.querySelector('.details');
const errorMsg = document.querySelector('.error');
let currentLoggedAcc, timer;
let sorted = false;

// FUNCTIONS 

// format movement dates in the accounts
const formatMovementDate = (date, locale) =>
{
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  // number of days passed between the current and movement date
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  // display the transfer date
  if(daysPassed === 0)
    return 'Today';
  if(daysPassed === 1)
    return 'Yesterday';
  if(daysPassed <= 7)
    return `${daysPassed} days ago`;
  else 
    return new Intl.DateTimeFormat(locale).format(date);
};

// format amount and currency based on the locale of each account 
// this is a generic function to format numbers 
const formatAmount = (value, locale, currency) =>
{
  return new Intl.NumberFormat(locale, 
  {
    style: 'currency',
    currency: currency,
  }).format(value);
};  

// display transactions 
const displayMovements = function(acc, sort = false)
{
  containerMovements.innerHTML = '';

  // if sort = true, sort movements in descending order of the amounts
  const movemts = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movemts.forEach(function(mov, i)
  {
    // movement type  
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMovement = formatAmount(mov, acc.locale, acc.currency);

    const html = 
    `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovement}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
console.log(containerMovements.innerHTML);

const calcDisplayBalance = acc =>
{
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = formatAmount(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = acc =>
{
  // total deposits : IN 
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatAmount(incomes, acc.locale, acc.currency);

  // total withdrawals : OUT
  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatAmount(Math.abs(out), acc.locale, acc.currency);

  // total interest amount : INTEREST
  // for every deposit >= 1, 1.2% of it is paid out as interest 
  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate).filter(deposit => deposit >= 1).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatAmount(interest, acc.locale, acc.currency);
};

// computing usernames for each account owner
const createUsername = accs => 
{
  accs.forEach(acc => 
  {
    // say, owner = 'Sarah Smith', username = 'ss' 
    acc.username = acc.owner.toLowerCase().split(' ').map(item => item[0]).join('');
  });
};

createUsername(accounts);
console.log(accounts);

const updateUI = (acc) =>
// 'acc' refers to an entire account 
{
  // display movements, balance, transaction summary
  displayMovements(acc);
  calcDisplayBalance(acc); 
  calcDisplaySummary(acc); 
};

// creating a logout timer 
// the app will log out users after some time of inactivity on the account
const startLogoutTimer = () =>
{
  let time = 600;

  const tick = () => 
  {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // display the time that is remaining 
    labelTimer.textContent = `${min}:${sec}`;

    // timer expires at '0' 
    if(time === 0)
    {  
      clearInterval(timer);

      // updating the UI 
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    };

    time--;
  };
  tick();

  // call the timer every second 
  const timer = setInterval(tick, 1000);
  console.log(timer);

  return timer;
};

// EVENT HANDLERS :

// implement login feature 
btnLogin.addEventListener('click', e => 
{
  e.preventDefault(); 

  // retrieve the account logged in
  currentLoggedAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentLoggedAcc);

  // checking PIN 
  if(currentLoggedAcc?.pin === Number(inputLoginPin.value))
  {
    // update UI
    introBox.classList.add('hidden');
    errorMsg.classList.add('hidden');

    // display login messsage and app data
    labelWelcome.textContent = `Welcome back, ${currentLoggedAcc.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // creating current date and time
    const now = new Date();  // generates the date user has logged in
    const options =
    {
      hour : 'numeric',
      minute : 'numeric',
      day : 'numeric',
      month : 'numeric',
      year : 'numeric',
    }; 

    // display current date, time and account balance using Internationalisation API 
    labelDate.textContent = new Intl.DateTimeFormat(currentLoggedAcc.locale, options).format(now);

    // clear input fields after log in 
    inputLoginUsername.value = inputLoginPin.value = '';

    // remove focus from the input field
    inputLoginPin.blur();  

    if(timer)
      clearInterval(timer);
    // restart the timer
    timer = startLogoutTimer();

    updateUI(currentLoggedAcc);
  }
  else
  // for wrong login credentials 
    errorMsg.classList.remove('hidden');
});

// implementing 'Transfer money' functionality 
btnTransfer.addEventListener('click', e => 
{
  e.preventDefault();

  // amount to be transferred 
  const amount = +(inputTransferAmount.value);

  // account receiving the transfer
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && receiverAcc && currentLoggedAcc.balance >= amount && receiverAcc.username !== currentLoggedAcc.username)
  {  
    // update the transfering and receiving accounts
    currentLoggedAcc.movements.push(-amount); 
    receiverAcc.movements.push(amount);

    // add transfer dates 
    currentLoggedAcc.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentLoggedAcc);

    // reset the timer 
    clearInterval(timer);
    timer = startLogoutTimer();
  };
});

// implementing 'Request loan' functionality 
btnLoan.addEventListener('click', (e) =>
{
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  // loan is only granted if there's atleast one deposit >= 10% of the requested amount 
  if(amount > 0 && currentLoggedAcc.movements.some(mov => mov >= 0.1 * amount)) // 10% = 0.1
    
  // setting time span for loan approval
    setTimeout(() =>
    {
      currentLoggedAcc.movements.push(amount);
      currentLoggedAcc.movementsDates.push(new Date().toISOString());

      updateUI(currentLoggedAcc);
      inputLoanAmount.value = '';

      clearInterval(timer);
      timer = startLogoutTimer();
    }, 8000);
});

// implementing 'Close account' functionality 

// deletes the current logged in account 
// users can request to close only their own account 

btnClose.addEventListener('click', (e) =>
{
  e.preventDefault();

  if(inputCloseUsername.value === currentLoggedAcc.username && +(inputClosePin.value) === currentLoggedAcc.pin)
  {
    const index = accounts.findIndex(acc => acc.username === currentLoggedAcc.username);
    console.log(index);

    // removing the account
    accounts.splice(index, 1);
    
    // update UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  };  
});

// implementing the sort button functionality
btnSort.addEventListener('click', (e) =>
{
  e.preventDefault();

  displayMovements(currentLoggedAcc, !sorted);
  sorted = !sorted;
});