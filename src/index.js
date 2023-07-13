import CustomSelect from 'vanilla-js-dropdown';

import { months } from './constants';

import './styles.scss';

document.addEventListener('DOMContentLoaded', function () {
  // Burger-menu
  var burgerMenu = document.getElementById('burger-menu');
  var overlay = document.getElementById('menu');

  // Menu open
  burgerMenu.addEventListener('click', function () {
    this.classList.toggle('close');
    overlay.classList.toggle('overlay');
  });

  // Menu-item click
  overlay.addEventListener('click', function () {
    burgerMenu.classList.toggle('close');
    overlay.classList.toggle('overlay');
  });

  // Dropdown
  new CustomSelect({
    elem: 'destination',
  });

  const dnd = document.querySelector('#destination');

  // CALENDAR
  const calendarToggle = document.querySelector('#calendar-toggle');
  const calendarMenu = document.querySelector('#calendar-menu');
  const calendarSubmit = document.querySelector('#calendar-submit');
  const calendarClose = document.querySelector('#calendar-cancel');

  let selectedDates = [];

  const today = new Date();
  const dayInt = today.getDate();
  let month = today.getMonth();
  let year = today.getFullYear();

  // body of the calendar
  const calendarBody = document.getElementById('days');

  // next and previous functionality
  const nextbtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  // Calendar months control buttons
  nextbtn.onclick = function () {
    next();
  };
  prevBtn.onclick = function () {
    previous();
  };

  function next() {
    year = month === 11 ? year + 1 : year;
    month = (month + 1) % 12;
    showCalendar(month, year);
  }

  function previous() {
    year = month === 0 ? year - 1 : year;
    month = month === 0 ? 11 : month - 1;
    showCalendar(month, year);
  }

  // init calendar
  showCalendar(month, year);

  // open calendar
  calendarToggle.addEventListener('click', function () {
    selectedDates = [];
    calendarSubmit.disabled = true;
    document.getElementById('dateFrom').innerHTML = 'Check in';
    document.getElementById('dateTo').innerHTML = 'Check out';
    calendarMenu.style.display = calendarMenu.style.display === 'none' ? 'block' : 'none';
  });

  // submit calendar
  calendarSubmit.addEventListener('click', function () {
    calendarMenu.style.display = 'none';
    document.getElementById('dateFrom').innerHTML = selectedDates[0];
    document.getElementById('dateTo').innerHTML = selectedDates[1];
    resetDates();
  });

  // close calendar
  calendarClose.addEventListener('click', function () {
    selectedDates = [];
    calendarMenu.style.display = 'none';
    calendarSubmit.disabled = true;
    document.getElementById('dateFrom').innerHTML = 'Check in';
    document.getElementById('dateTo').innerHTML = 'Check out';
    resetDates();
  });

  // Remove all highlights from calendar
  function resetDates() {
    Array.from(document.querySelectorAll('#days .singleDay')).forEach((el) => {
      el.classList.remove('startDate');
      el.classList.remove('endDate');
    });
  }

  // Sorting for dates in format dd/mm/yyyy
  // if check out will be earlier than check in
  function arrayOfDatesSort(data) {
    data.sort(function (a, b) {
      a = a.split('/').reverse().join('');
      b = b.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
  }

  // Adding dates to selectedDates array with highlighting
  // in calendar
  function addDate(e, cell) {
    // padStart for adding zero to days or mounth with one digit 5 -> 05
    let date =
    `${e.getAttribute('data-day')}`.padStart(2, "0") + '/' + `${e.getAttribute('data-month')}`.padStart(2, "0") + '/' + e.getAttribute('data-year');    

    // Handle click when no dates added
    if (selectedDates.length === 0) {
      selectedDates.push(date);
      cell.classList.add('startDate');
      // Handle click when one date was added already. And dates sorting
    } else if (selectedDates.length === 1) {
      selectedDates.push(date);
      cell.classList.add('endDate');
      calendarSubmit.disabled = false;
      arrayOfDatesSort(selectedDates);
      // Handle click when two dates added with reset and adding first date
    } else if (selectedDates.length === 2) {
      selectedDates = [];
      resetDates();
      calendarSubmit.disabled = true;
      cell.classList.add('startDate');
      selectedDates.push(date);
    }
  }

  function showCalendar(month, year) {
    // gets the day of the week for this date
    let firstDay = new Date(year, month).getDay();
    // clearing all previous cells
    calendarBody.innerHTML = '';
    // checking the mount of days in this month to control the loop
    let totalDays = daysInMonth(month, year);

    // adding the blank boxes so that date start on correct day of the week
    // substracting 1 to set monday as the first weekday
    // and testing for sunday because it became the 7th day
    blankDates(firstDay === 0 ? 6 : firstDay - 1);
    // adding the dates to the calendar
    for (let day = 1; day <= totalDays; day++) {
      // create li node with text content & apend to body
      let cell = document.createElement('li');
      let cellText = document.createTextNode(day);
      // adding active class if day matches today
      if (dayInt === day && month === today.getMonth() && year === today.getFullYear()) {
        cell.classList.add('active');
      }

      // appending date attributes to single date li element
      cell.setAttribute('data-day', day);
      cell.setAttribute('data-month', month);
      cell.setAttribute('data-year', year);

      //appending li to body of calendar
      cell.classList.add('singleDay');

      // reset the highlightning of dates
      // if (selectedDates.length === 2) {
      //   cell.classList.remove('startDate');
      //   cell.classList.remove('endDate');
      // }

      cell.appendChild(cellText);
      cell.onclick = function (e) {
        addDate(e.target, cell);
      };
      calendarBody.appendChild(cell);
    }

    // set month string value
    document.getElementById('month').innerHTML = months[month];
    // set year string value
    document.getElementById('year').innerHTML = year;
  }

  function daysInMonth(month, year) {
    // day 0 here returns the last day of the PREVIOUS month
    return new Date(year, month + 1, 0).getDate();
  }

  function blankDates(count) {
    // looping to add the correct amount of blank days to the calendar
    for (let x = 0; x < count; x++) {
      let cell = document.createElement('li');
      let cellText = document.createTextNode('');
      cell.appendChild(cellText);
      // add the empty class to remove the borders
      cell.classList.add('empty');
      calendarBody.appendChild(cell);
    }
  }

  // Custom validation
  function customValidation(element, trigger) {
    element.addEventListener(trigger, function () {
      if (selectedDates.length > 1 && dnd.value) {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
    });
  }

  const submitButton = document.getElementById('submit-button');
  const loader = document.getElementById('loader');

  customValidation(calendarMenu, 'click');
  customValidation(dnd, 'change');

  // Send button
  submitButton.addEventListener('click', function (e) {
    // Loader and data sending imitation
    e.preventDefault();
    loader.style.display = 'flex';
    sentData();
    setTimeout(function () {
      document.getElementById('loader').style.display = 'none';
    }, 2000);

    // Clear Data
    document.getElementById('dateFrom').innerHTML = 'Check in';
    document.getElementById('dateTo').innerHTML = 'Check out';
    resetDates();
    document.getElementById('custom-destination').firstChild.innerHTML = 'Select a Destination';
    Array.from(document.querySelectorAll('.js-Dropdown-list li')).forEach((el, index) => {
      if (index === 0) el.classList.add('is-selected');
      else el.classList.remove('is-selected');
    });
    submitButton.disabled = true;
  });

  // Fake send data function
  function sentData() {
    const data = {
      destination: dnd.value,
      dates: selectedDates,
    };

    fetch('https://test.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Result:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
});
