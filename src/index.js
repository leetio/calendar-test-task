import CustomSelect from 'vanilla-js-dropdown';

import { clearDataAfterSubmit, customValidation, sentData, calendarHandler } from './helpers';

import './styles.scss';

document.addEventListener('DOMContentLoaded', function () {
  const loader = document.getElementById('loader');

  const calendarToggle = document.querySelector('#calendar-toggle');
  const calendarClose = document.querySelector('#calendar-cancel');
  const calendarSubmit = document.querySelector('#calendar-submit');
  const calendarMenu = document.querySelector('#calendar-menu');

  const submitButton = document.getElementById('submit-button');

  const dnd = document.querySelector('#destination');
  
  const burgerMenu = document.getElementById('burger-menu');
  const overlay = document.getElementById('menu');

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

  // CALENDAR
  const menuStatus = calendarMenu.style.display === 'none' ? 'block' : 'none';
  // open calendar
  calendarToggle.addEventListener('click', function () {
    calendarHandler([], true, menuStatus, 'Check in', 'Check out', null)
  });

  // submit calendar
  calendarSubmit.addEventListener('click', function () {
    calendarHandler(null, null, 'none', 'selectedDates[0]', 'selectedDates[1]', true)
  });

  // close calendar
  calendarClose.addEventListener('click', function () {
    calendarHandler([], true, 'none', 'Check in', 'Check out', true)
  });

  customValidation(calendarMenu, 'click', submitButton);
  customValidation(dnd, 'change', submitButton);

  // Send button
  submitButton.addEventListener('click', function (e) {
    // Loader and data sending imitation
    e.preventDefault();
    loader.style.display = 'flex';
    
    sentData();

    setTimeout(function () {
      document.getElementById('loader').style.display = 'none';
    }, 2000);

    clearDataAfterSubmit(submitButton);
  });
});
