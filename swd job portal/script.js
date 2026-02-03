// script.js — Vanilla JS dropdown behavior for navbar user menu
// - Toggles dropdown on button click
// - Closes when clicking outside or pressing Escape
// - Ensures only one dropdown is open at a time

document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.dropdown-toggle');

  function closeAll() {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
      menu.setAttribute('aria-hidden', 'true');
      const btn = document.querySelector(`[aria-controls="${menu.id}"]`);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  toggles.forEach(btn => {
    const menuId = btn.getAttribute('aria-controls');
    const menu = document.getElementById(menuId);
    if (!menu) return;

    // Toggle on click
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const opening = !menu.classList.contains('show');

      // Close other open menus
      closeAll();

      if (opening) {
        menu.classList.add('show');
        menu.setAttribute('aria-hidden', 'false');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        menu.classList.remove('show');
        menu.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when selecting an item (optional behavior)
    menu.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (target) {
        // If it's a link, allow navigation. Still close the menu.
        closeAll();
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
      closeAll();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  // -------------------------------
  // Logout button redirect (added)
  // -------------------------------
  const logoutBtn = document.querySelector('.dropdown-item.logout');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // future: clear auth/session data here
      window.location.href = 'login.html';
    });
  }

  // -------------------------------
  // Job Details interactions
  // - Simulates login state
  // - Shows login notice when not authenticated
  // - Allows saving a job (toggles) and applying (simulates submission)
  // -------------------------------
  const jobStatus = document.getElementById('job-status');
  const loginNotice = document.getElementById('login-notice');
  const applyBtn = document.getElementById('apply-btn');
  const saveBtn = document.getElementById('save-btn');
  const loginToApplyBtn = document.getElementById('login-to-apply-btn');
  const createAccountBtn = document.getElementById('create-account-btn');

  // Persisted states (simple simulation)
  let isLoggedIn = localStorage.getItem('swd_logged_in') === 'true';
  let isSaved = localStorage.getItem('swd_saved_job') === 'true';
  let hasApplied = localStorage.getItem('swd_applied_job') === 'true';

  function announce(msg){
    if(!jobStatus) return;
    jobStatus.textContent = msg;
    // Clear message after a short delay for screen readers
    setTimeout(()=>{ if(jobStatus.textContent === msg) jobStatus.textContent = ''; }, 3500);
  }

  function updateUI(){
    if(loginNotice){
      loginNotice.setAttribute('aria-hidden', isLoggedIn ? 'true' : 'true');
      // keep it hidden by default unless user tries to apply
    }

    if(saveBtn){
      saveBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
      saveBtn.textContent = isSaved ? 'Saved' : 'Save Job';
    }

    if(applyBtn){
      if(hasApplied){
        applyBtn.setAttribute('disabled', 'true');
        applyBtn.textContent = 'Applied';
      } else {
        applyBtn.removeAttribute('disabled');
        applyBtn.textContent = 'Apply Now';
      }
    }
  }

  // Toggle save
  if(saveBtn){
    saveBtn.addEventListener('click', () => {
      isSaved = !isSaved;
      localStorage.setItem('swd_saved_job', isSaved ? 'true' : 'false');
      updateUI();
      announce(isSaved ? 'Job saved' : 'Job removed from saved jobs');
    });
  }

  // Apply behavior
  if(applyBtn){
    applyBtn.addEventListener('click', () => {
      if(!isLoggedIn){
        // Reveal login notice and move focus to login button
        if(loginNotice){
          loginNotice.setAttribute('aria-hidden', 'false');
          loginToApplyBtn?.focus();
        }
        announce('You must log in to apply.');
        return;
      }

      // Simulate application submission
      hasApplied = true;
      localStorage.setItem('swd_applied_job', 'true');
      updateUI();
      announce('Application submitted. We will contact shortlisted candidates.');
    });
  }

  // Login in the notice (simulated)
  if(loginToApplyBtn){
    loginToApplyBtn.addEventListener('click', () => {
      isLoggedIn = true;
      localStorage.setItem('swd_logged_in', 'true');
      if(loginNotice) loginNotice.setAttribute('aria-hidden', 'true');
      announce('You are now logged in. You may apply.');
      applyBtn?.focus();
      updateUI();
    });
  }

  if(createAccountBtn){
    createAccountBtn.addEventListener('click', () => {
      // Simulate account creation + login
      isLoggedIn = true;
      localStorage.setItem('swd_logged_in', 'true');
      if(loginNotice) loginNotice.setAttribute('aria-hidden', 'true');
      announce('Account created. You are now logged in.');
      applyBtn?.focus();
      updateUI();
    });
  }

  // Close login notice on Escape or clicking outside
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && loginNotice && loginNotice.getAttribute('aria-hidden') === 'false'){
      loginNotice.setAttribute('aria-hidden','true');
      announce('Login canceled');
      applyBtn?.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if(!e.target.closest('#login-notice') && !e.target.closest('#apply-btn')){
      if(loginNotice && loginNotice.getAttribute('aria-hidden') === 'false'){
        loginNotice.setAttribute('aria-hidden','true');
      }
    }
  });

  // Initialize UI to persisted state
  updateUI();

});

