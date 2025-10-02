const words = ["flower", "planet", "coding", "random", "purple", "Professtional"];

const textRandom = document.querySelector(".text-random");
const triesLabel = document.querySelector(".tries-label");
const triesCircles = document.querySelectorAll(".tries-circle");
const mistakesContent = document.querySelector(".mistakes-content");
const guessInput = document.querySelector(".guess-input");
const randomBtn = document.querySelector(".random");
const resetBtn = document.querySelector(".reset");
const noti = document.querySelector(".noti");
const notiIcon = document.querySelector(".noti-icon");
const notiText = document.querySelector(".noti-text");
const notiDis = document.querySelector(".noti-dis");

let currentWord = "";
let shuffleWord = "";
let mistakesCount = 0;
const maxTries = 5;
let mistakes = [];
let letterSlots = [];
let isGameLocked = false;

const shuffle = (word) => {
  let arr = word.split("");
  for(let i = arr.length - 1; i>0; i--){
    let j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

const disableInputs = () =>{
  const slots = Array.from(guessInput.querySelectorAll(".letter-slot"));
  slots.forEach(slot => slot.disabled = true);
}

const enableInputs = () =>{
  const slots = Array.from(guessInput.querySelectorAll(".letter-slot"));
  slots.forEach(slot => slot.disabled = false);
}

const updateStatus = () =>{
  triesLabel.textContent = `Tries (${mistakesCount}/${maxTries}):`;
  triesCircles.forEach((circle, index) =>{
    circle.classList.toggle("active", index < mistakesCount);
  });
  console.log(mistakes);
  mistakesContent.innerHTML = "";
  mistakes.forEach(item =>{
    mistakesContent.textContent = item.split("").join(", ");
  });
}

const showNotification = (title, message, type) =>{
  notiText.textContent = title;
  notiDis.textContent = message;

  if(type){
    noti.style.borderLeftColor = "#14f73a";
    notiIcon.style.color = "#14f73a";
    notiIcon.className = "fa-solid fa-circle-check";
  } else{
    noti.style.borderLeftColor = "#f87171";
    notiIcon.style.color = "#f87171";
    notiIcon.className = "fa-solid fa-circle-xmark noti-icon";
  }

  noti.classList.add("show");

  setTimeout(() =>{
    noti.classList.remove("show");
  }, 3000);
}

const updateInput = (word) =>{
  guessInput.innerHTML = "";
  for(let i =0; i < word.length; i++){
    const wrapperInput = document.createElement("div");
    wrapperInput.className = "slot-wrapper";


    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.className="letter-slot";
    input.autocomplete = "off";
    input.inputMode = "text"


    input.addEventListener("keydown", (e) =>{
      const slots = Array.from(guessInput.querySelectorAll(".letter-slot"));
      const index = slots.indexOf(e.target);

      if(e.key === "Backspace"){
        if(e.target.value === "" && index > 0){
          slots[index - 1].focus();
        }
      }
    });

    input.addEventListener("input", (e) =>{
      if(isGameLocked) return;
      e.target.value = e.target.value.slice(0,1);
      const slots = Array.from(guessInput.querySelectorAll(".letter-slot"));
      const index = slots.indexOf(e.target);
      if(e.target.value && index < slots.length -1){
        slots[index + 1].focus();
      }

      const attempt = slots.map(slot => slot.value).join("");
      setTimeout(() =>{
        if(attempt.length === currentWord.length){
          if(attempt.toLowerCase() === currentWord.toLowerCase()){
            isGameLocked = true;
            disableInputs();
            showNotification("You win!", "Congratulations! A new word is ready.", true);
            setTimeout(startGame, 3200);
          } else {
            mistakesCount++;
            mistakes.push(attempt);
            updateStatus();
            if(mistakesCount >= maxTries){
              isGameLocked = true;
              disableInputs();
              showNotification("Game over", `The correct word was: ${currentWord}`, false);
              setTimeout(startGame, 3200);
            } else{
              slots.forEach(slot => slot.value = "");
              slots[0].focus();
            }
          }
        }
      }, 200);
    });
    wrapperInput.appendChild(input);
    guessInput.appendChild(wrapperInput);
  }
}

const startGame = () =>{
  currentWord = words[Math.floor(Math.random() * words.length)];
  shuffleWord = shuffle(currentWord);

  textRandom.textContent = shuffleWord.toLowerCase();

  updateInput(currentWord);
  mistakes = [];
  mistakesCount = 0;
  updateStatus();
  isGameLocked = false;
  enableInputs();

  const slots = Array.from(guessInput.querySelectorAll(".letter-slot"));
  slots.forEach(slot => slot.value = "");
  if (slots.length > 0) slots[0].focus();
}

randomBtn.addEventListener("click", ()=>{
  startGame();
});

resetBtn.addEventListener("click", ()=>{
  mistakes = [];
  mistakesCount = 0;
  updateStatus();

  const slots = Array.from(guessInput.querySelectorAll(".letter-slot"));
  slots.forEach(slot => slot.value = "");
  if (slots.length > 0) slots[0].focus();
});

startGame();