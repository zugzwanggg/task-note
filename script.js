const card = document.querySelectorAll('.card')
const cardList = document.querySelector('.card-list')
const popUp = document.querySelector('.pop-up')
const colBtn = document.querySelector('.col-btn')
const popUpPermission = document.querySelector('.pop-up__permission')





function saveToLocalStorage(cardData) {
  const existingData = JSON.parse(localStorage.getItem('cardList')) || [];

  existingData.push(cardData);

  localStorage.setItem('cardList', JSON.stringify(existingData));

  location.reload()
}

function saveToDo(id, item) {

  const existingData = JSON.parse(localStorage.getItem('cardList')) || [];
  const newData = JSON.parse(JSON.stringify(existingData));
  const cardIndex = newData.findIndex((elem) => elem.id === id);

  if (!existingData[cardIndex].toDoList.includes(item)) {
    newData[cardIndex].toDoList.push(item);
    localStorage.setItem('cardList', JSON.stringify(newData));
    

    location.reload()
  }
}

function removeToDo(id,item) {
  const existingData = JSON.parse(localStorage.getItem('cardList')) || [];
  const cardIndex = existingData.findIndex((elem) => elem.id === id);
  const index = existingData[cardIndex].toDoList.indexOf(item)

  existingData[cardIndex].toDoList.splice(index, 1)
  

  localStorage.setItem('cardList', JSON.stringify(existingData));

  location.reload()
}


function removeFromLocalStorage(item) {

  const existingData = JSON.parse(localStorage.getItem('cardList')) || [];

  const index = existingData.findIndex(elem => elem.id === item)

  existingData.splice(index, 1)

  localStorage.setItem('cardList', JSON.stringify(existingData));
  location.reload()

}



colBtn.addEventListener('click', (e)=>{

  e.preventDefault()

  popUp.classList.toggle('show')


  if (e.target.innerText == 'Add new column') {
    e.target.innerText = 'Close'
  } else {
    e.target.innerText = 'Add new column'
  }
})


popUp.addEventListener('click' , (e)=> {

    
  const popUpInput = popUp.querySelector('.pop-up__input')
  const indicator = popUp.querySelector('.indicator')
  const popUpList = popUp.querySelectorAll('.pop-up__list')



  popUpList.forEach(elem => {
    elem.addEventListener('click', (e)=>{
      e.stopPropagation()
      switch (e.target.className) {
        case 'red': 
          return indicator.style.background = 'rgb(104, 9, 9)'
        case 'yellow': 
          return indicator.style.background = 'rgb(104, 68, 9)'
        
        case 'green': 
          return indicator.style.background = 'rgb(52, 104, 9)'
        
      }
    })
  })

  


  

  if (e.target.classList.contains('pop-up__btn')) {

    if (popUpInput.value.length == 0) {
      alert('cannot be empty')
      return;
    }

    colBtn.innerText = 'Add new column'

  


    const newCard = document.createElement('li')


    popUp.classList.toggle('show')

    newCard.toDoList = []

    const id = Math.random().toString(16).slice(2)




    newCard.className = 'card'
    newCard.innerHTML =`
    <hr style="background-color: ${indicator.style.background}">
    <div class='card-head'>
      <h2 class='heading'>${popUpInput.value}</h2>
      <span class="material-symbols-outlined delete">
        delete
      </span>
    </div>
    <ul class="card-items__list">
      
    </ul>
    <button class="card-button">Add new card</button>
    `

    saveToLocalStorage({data: newCard.innerHTML,toDoList: newCard.toDoList,id})
    popUpInput.value = ''
    
  }


})


const storedHTML = JSON.parse(localStorage.getItem('cardList'));
  storedHTML.forEach(item => {
    const newCard = document.createElement('li');


    newCard.className = 'card'
    newCard.innerHTML = item.data;

    newCard.toDoList = item.toDoList
    const listElement = newCard.querySelector('.card-items__list')

    newCard.toDoList.forEach(elem=> {
      const listItem = document.createElement('li')
      listItem.innerHTML = `
              <textarea readonly>${elem}</textarea>
              <span class="material-symbols-outlined remove">
                  remove
              </span>`;
      listElement.appendChild(listItem)
    })

    


    cardList.appendChild(newCard);

    newCard.addEventListener('click', (e)=> {

      const textarea = document.querySelectorAll('textarea')
  
    
      const target = e.target
    
      textarea.forEach(elem => {
        elem.addEventListener('input', (e)=> {
          e.target.style.height = '1.5rem';
          e.target.style.height = `${e.target.scrollHeight}px`
        })
        
      })
       
    
      if (target.classList.contains('card-button')) {
        const cardButton = newCard.querySelector('.card-button')
        const listItem = document.createElement('li')
        newCard.toDoList.push('')
       

        newCard.toDoList.forEach(()=> {
          listItem.innerHTML = `
                  <textarea placeholder='Write something to do'></textarea>
                  <span class="material-symbols-outlined remove">
                      remove
                  </span>`;
          listElement.appendChild(listItem)
        })

    
        
    
        cardButton.textContent = 'Save'
        cardButton.className = 'save-button'
    
    
    
      } else if (target.classList.contains('remove')) {
    
        const saveButton = newCard.querySelector('button')
    
        
        if (saveButton.innerText == 'Save') {
          saveButton.textContent = 'Add new card'
          saveButton.className = 'card-button'
        } 
    
    
    
        target.parentElement.remove();
    
        newCard.toDoList.splice(newCard.toDoList.indexOf(target.parentElement), 1);
        removeToDo(item.id, target.parentElement.innerText)
    
      } else if (target.classList.contains('save-button')) {
    
        const inputValue = newCard.querySelectorAll('textarea')
        const saveButton = newCard.querySelector('.save-button')
    
    
        inputValue.forEach(elem =>
          {
            if(elem.value.length > 0) {
              elem.setAttribute('readonly','readonly')
              saveButton.textContent = 'Add new card'
              saveButton.className = 'card-button'
              saveToDo(item.id,elem.value)
              newCard.toDoList.push(elem.value)
            } else {
            alert('Cannot be empty')
            saveButton.textContent = 'Save'
            saveButton.className = 'save-button'
              }
            }
          )
          

      } else if (e.target.classList.contains('delete')) {
        popUpPermission.classList.toggle('show')
        popUpPermission.addEventListener('click', function handler(e) {
          if (e.target.classList.contains('permission-yes')) { 
            newCard.remove()
            removeFromLocalStorage(item.id)
          } 
          popUpPermission.classList.toggle('show');
          popUpPermission.removeEventListener('click', handler);
        });
      }

    })

    cardList.appendChild(newCard);
  }
)

