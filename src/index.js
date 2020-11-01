document.addEventListener("DOMContentLoaded", () => {
  main();
});

function main (){
  fetchPups();
  eventListeners();
}

let dogFilter = false

function fetchPups(){fetch(`http://localhost:3000/pups`)
.then(resp => resp.json())    //need to remember to add the parentheses for json!
.then(json => pupIndex(json))
};

function pupIndex(pups){
  const dogBar = document.getElementById('dog-bar')
  dogBar.innerHTML = ''  //wipes sibling elements for easy refresh
  if (dogFilter === false){
    pups.forEach(pup => {
      const dogDiv = document.createElement('div')
      dogDiv.innerHTML = `<span id= ${pup.id} class='pup-btn'>${pup.name}</span>`
      dogBar.appendChild(dogDiv)
    })
  } else {
    pups.forEach(pup => {
      if (pup.isGoodDog === true){
      const dogDiv = document.createElement('div')
      dogDiv.innerHTML = `<span id= ${pup.id} class='pup-btn'>${pup.name}</span>`
      dogBar.appendChild(dogDiv)
      }
    })
  }
}

function eventListeners(){
  const body = document.querySelector('body')
  body.addEventListener('click',function (event){
  // Individual dog show info
    if (event.target.className === 'pup-btn'){
      fetch(`http://localhost:3000/pups/${event.target.id}`)
      .then(resp => resp.json())
      .then(dog => pupInfo(dog))
    }
  // Good dog filtering
    if (event.target.id === 'good-dog-filter'){
       dogFilter = !dogFilter
       if (dogFilter === true){
         event.target.innerText = 'Filter good dogs: ON'
         fetchPups()
       }
       if (dogFilter === false){
         event.target.innerText = 'Filter good dogs: OFF'
         fetchPups()
       }
    }
  }) 
}


function pupInfo(dog) { 
  dogInfo = document.getElementById('dog-info')
  let dogStatus = dog.isGoodDog
  let goodDog;
  dogStatus != true ? (goodDog = 'Bad Dog!') : (goodDog = 'Good Dog!')
  dogInfo.innerHTML = `<img src='${dog.image}'><h2>${dog.name}</h2><button class='dog-status'>${goodDog}</button>`
  const goodDogBtn = document.querySelector('.dog-status')
  goodDogBtn.addEventListener('click', function(event){
    dogStatus = !dogStatus
    console.log(dogStatus)
    const formData = {
      isGoodDog: dogStatus
    }
    const configObj = {
      method: 'PATCH',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData)
      }

    fetch(`http://localhost:3000/pups/${dog.id}`, configObj) 
    .then(resp => resp.json())
    .then(dog => console.log(dog));
    
    dogStatus != true ? (goodDog = 'Bad Dog!') : (goodDog = 'Good Dog!')
    event.target.innerText = `${goodDog}`
  })
}
    


