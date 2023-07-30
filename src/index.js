require('./styles/index.scss')
require('./scripts/burger')

console.log(`Оценка за работу 100 баллов`)

const year = document.querySelector('.footer__year')

year.textContent = new Date().getFullYear().toString()
