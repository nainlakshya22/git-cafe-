document.addEventListener('DOMContentLoaded', () => {
  const qtyButtons = document.querySelectorAll('.qty-picker button');
  qtyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const wrapper = button.parentElement;
      const valueEl = wrapper.querySelector('span');
      let currentValue = Number(valueEl.textContent);
      if (button.textContent.trim() === '+') currentValue += 1;
      if (button.textContent.trim() === '−') currentValue = Math.max(1, currentValue - 1);
      valueEl.textContent = String(currentValue);
    });
  });

  const confirmation = document.getElementById('order-confirmation');
  const checkoutForm = document.querySelector('form');
  if (checkoutForm && confirmation) {
    checkoutForm.addEventListener('submit', (event) => {
      event.preventDefault();
      confirmation.classList.add('show');
      confirmation.textContent = 'Your order has been placed successfully. A confirmation email is on the way.';
    });
  }

  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  galleryThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      galleryThumbs.forEach((item) => item.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  const optionPills = document.querySelectorAll('.option-pill');
  optionPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const group = pill.parentElement;
      group.querySelectorAll('.option-pill').forEach((item) => item.classList.remove('selected'));
      pill.classList.add('selected');
    });
  });
});
