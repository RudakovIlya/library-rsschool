function toggleBurgerMenu() {
  const burgerMenu = document.querySelector('.menu');
  const burgerBtn = document.querySelector('.icon-menu');
  const body = document.body;
  const background = document.querySelector('.background');

  const onToggle = () => {
    burgerMenu.classList.toggle('open');
    body.classList.toggle('locked');
    background.classList.toggle('open');
  };

  const onRemove = (event) => {
    const target = event.target

    const isClickInsideMenu = burgerMenu.contains(target);

    if (!isClickInsideMenu) {
      burgerMenu.classList.remove('open');
      body.classList.remove('locked');
      background.classList.remove('open');
    }
  };

  if (!burgerMenu.classList.contains('open')) {
    burgerBtn.addEventListener('click', onToggle);
  }

  document.addEventListener('click', onRemove);
}

toggleBurgerMenu()

