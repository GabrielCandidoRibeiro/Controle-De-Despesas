const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
   transactions = transactions.filter(transaction => 
     transaction.id !== ID)
   updateLocalStorage()
   init()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
   const operator = amount < 0 ? '-' : '+'
   const CSSClass = amount < 0 ? 'minus' : 'plus'
   const amountWithoutOperator = Math.abs(amount)
   const li = document.createElement('li')

   li.classList.add(CSSClass)
   li.innerHTML = `
     ${name} 
     <span>${operator} R$ ${amountWithoutOperator}</span>
     <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
   `
   transactionUl.prepend(li)
 }

 const getExpenses = transactionAmounts => Math.abs(transactionAmounts
      .filter(value => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0))
      .toFixed(2)

 const getIncome = transactionAmounts => transactionAmounts
      .filter(value => value > 0)
      .reduce((accumulator, value) => accumulator + value, 0)
      .toFixed(2)

 const getTotal = transactionAmounts => transactionAmounts
      .reduce((accumulator, transaction) => accumulator + transaction, 0)
      .toFixed(2)

 const updateBalanceValues = () => {
    const transactionAmounts = transactions.map(({ amount }) => amount)
    const total = getTotal(transactionAmounts)
    const income = getIncome(transactionAmounts)
    const expense = getExpenses(transactionAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`


 }

 const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
 }

 init()

 const updateLocalStorage = () => {
   localStorage.setItem('transactions', JSON.stringify(transactions))
 }

 const generateID = () => Math.round(Math.random() * 1000)
 // criando a transação e adcionando no array de transação
 const addToTransactionsArray = (transactionName, transactionAmount) => {
   transactions.push({ 
    id: generateID(), 
    name: transactionName, 
    amount: Number(transactionAmount) 
   })
 }
 
 const cleanInputs = () =>{
 // limpa os inputs 
   inputTransactionName.value = ''
   inputTransactionAmount.value = ''
 }

 const handleFormSubmit = event => {
   //impede de que form seja enviado e a página seja recarregada 
   event.preventDefault()

   // criando duas const com os valores inseridos no input 
   const transactionName = inputTransactionName.value.trim()
   const transactionAmount = inputTransactionAmount.value.trim()
   const isSomeInputEmpty = transactionName === '' || transactionAmount === ''
   // nesse if verifica se um dos valores do input não foi preenchido e exibe a mensagem na tela
   if (isSomeInputEmpty) {
      alert('Por favor, preencha tanto o nome quanto o valor da transação ')
      return
   }

   addToTransactionsArray(transactionName, transactionAmount)
   init()
   // atualiza o local storage 
   updateLocalStorage()
   cleanInputs()
 }

 form.addEventListener('submit', handleFormSubmit)
