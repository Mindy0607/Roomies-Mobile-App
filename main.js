// This is first page JavaScript file

//sound
var clickSoundEl = document.getElementById("clickSound");
var updatePointsLevelSoundEl = document.getElementById("updatePointsLevelSound");
var winSoundEl = document.getElementById("winSound");

//Firebase API
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

var appSettings = {
    databaseURL:"https://yourFirebaseID.firebasedatabase.app/"
}

//push input filed data to database
var app = initializeApp(appSettings);
var database = getDatabase(app);
//points and level 
var pointsEl = document.getElementById("pointsStar");
var levelEl = document.getElementById("levelHeart");
// References for own tasks and roommate tasks
var owntaskInDB = ref(database, "personalTasks");
var roommateInDB = ref(database, "RoommateTasks");
// Input field and buttons
var inputEl = document.getElementById("input-field");
var addEl = document.getElementById("add-button");


// Task lists
var ownTodolistEl = document.getElementById("own-toDo-list");
var roommateTodolistEl = document.getElementById("roommate-toDo-list");
// Button to switch between own tasks and roommate tasks
var ownTasksBtnEl = document.getElementById("ownBtn");
var roommateTasksBtnEl = document.getElementById("roomBtn");

//points and level variables to store the text
var points = 0;
var level = 0;



ownTasksBtnEl.addEventListener("click", function(){
    inputEl.style.display = 'block';
    addEl.style.display = 'block';
    roommateTodolistEl.style.display = 'none';
    ownTodolistEl.style.display = 'block';
})

roommateTasksBtnEl.addEventListener("click", function(){
  inputEl.style.display = 'block';
  addEl.style.display = 'block';
  roommateTodolistEl.style.display = 'block';
  ownTodolistEl.style.display = 'none';
})


//Add tasks function
addEl.addEventListener("click", function(){
    var inputValue = inputEl.value;
    if(ownTodolistEl.style.display == 'block'){
       push(owntaskInDB, inputValue);
    }else if(roommateTodolistEl.style.display == 'block'){
       push(roommateInDB, inputValue);
    }
 // Play the notification sound
    clickSoundEl.play();
    clearInputValue();
    
})

//Display my task on the page (Code learned from Scrimba tutorial)
onValue(owntaskInDB, function(snapshot){
    if (snapshot.exists()){
         var owntaskArray = Object.entries(snapshot.val());
        clearownTodolistEl();
        for(let i=0; i<owntaskArray.length; i++){
            var currentTask = owntaskArray[i];
            var currentTaskID = currentTask[0];
            var curreentTaskValue = currentTask[1];
            addownToDoListEl(currentTask);
    }
    } else {
        ownTodolistEl.innerHTML = "Nothing to do today";
    }
})

//Display roommate tasks on the page (Code learned from Scrimba tutorial)
onValue(roommateInDB, function(snapshot){
    if (snapshot.exists()){
         var roommatetaskArray = Object.entries(snapshot.val());
        clearroommateTodolistEl();
        for(let i=0; i<roommatetaskArray.length; i++){
            var currentTask = roommatetaskArray[i];
            var currentTaskID = currentTask[0];
            var curreentTaskValue = currentTask[1];
            addroommateToDoListEl(currentTask);
    }
    } else {
        roommateTodolistEl.innerHTML = "Nothing to do today";
    }
})



function clearownTodolistEl(){
  ownTodolistEl.innerHTML = "";
}

function clearroommateTodolistEl(){
  roommateTodolistEl.innerHTML = "";
}


// Function to clear the input field
function clearInputValue(){
    inputEl.value = "";
}

//Remove to do items
function addownToDoListEl(item){
  var todiItemID = item[0];
  var todoItemValue = item[1]; 
  var newAddToDoListEL = document.createElement("li");
  newAddToDoListEL.textContent = todoItemValue;
  newAddToDoListEL.addEventListener("click",function(){
      points++;
      let exactLocationOfItemInDB = ref(database, `personalTasks/${todiItemID}`);
      remove(exactLocationOfItemInDB);
      newAddToDoListEL.classList.toggle("completed");
      updatePointsLevel();
      
  })
  
  ownTodolistEl.append(newAddToDoListEL);
  
}

function addroommateToDoListEl(item){
  var todiItemID = item[0];
  var todoItemValue = item[1]; 
  var newRoommateToDoListEL = document.createElement("li");
  newRoommateToDoListEL.textContent = todoItemValue;
  newRoommateToDoListEL.addEventListener("click",function(){
      points++;
      let exactLocationOfItemInDB = ref(database, `RoommateTasks/${todiItemID}`);
      remove(exactLocationOfItemInDB);
      updatePointsLevel();
  })
  roommateTodolistEl.append(newRoommateToDoListEL);
  
}

function updatePointsLevel(){
  //check if points reach the next level
  if(points >= 10 * level){
    level ++;
  }
  if (points === 5 ) {
    // Display a reminder to drink water and have a rest
    updatePointsLevelSoundEl.play();
    window.alert("You're awesome! Take a break and drink some water!");
  } else if (points === 10) {
    // Display a level message 
    winSoundEl.play();
    window.alert("Congratulations, you're in level " + level );
  } else if (points === 15) {
    // Display a message
    updatePointsLevelSoundEl.play();
    window.alert("You're wonderful! Take a break and have happy time with friends");
  } else if (points === 20) {
    // Display a message
     winSoundEl.play();
    window.alert("Keep up the great work!");
  }
   pointsEl.innerHTML = points;
   levelEl.innerHTML = level;
}



