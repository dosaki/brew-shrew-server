var _domain = "http://localhost";
var _oneYear = 31556926;
var _delimiter = "$$!,!$$";
var _cookieDrinks = "favDrinks";
var _cookiePerson = "userName";
var _preparer = "";
var _serverUrl = _domain + ":8585/";
var _url = _serverUrl + "kettle/";
var _intervalIsSet = false;

var makeRequest = function(url, data, callBack){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      document.body.style.cursor = "default";
      callBack(xhr);
    }
  }
  xhr.open('GET', url + "?" + data);
  xhr.send();
  document.body.style.cursor = "progress";
}


var getCookies = function(domain, name, callback) {
  var cookie = docCookies.getItem(name);
  if(callback) {
    if(cookie){
      callback(cookie);
    }
    else{
      callback(null);
    }
  }
}

var setCookie = function(domain, name, value, expiry) {
  docCookies.setItem(name, value, expiry)
}

var isEmpty = function(value){
  return value === undefined || value === null || value === "" || value.length === 0
}

var disable = function(element, isLoading){
  element.disabled = "disabled";
  if(isLoading){
    element.style.cursor = "progress";
  }
}

var enable = function(element){
  element.removeAttribute("disabled");
  element.style.cursor = "pointer";
}

var joinNoNulls = function(list, delimiter){
  var joinedList = "";
  for(var i=0; i<list.length; i++){
    if(!isEmpty(list[i])){
      if(isEmpty(joinedList)){
        joinedList = list[i];
      }
      else{
        joinedList = joinedList + _delimiter + list[i];
      }
    }
  }
  return joinedList;
}

var message = function(text, type){
  document.getElementById("messages").style.display = "block"
  document.getElementById("messages").innerHTML = text;
  document.getElementById("messages").className = "messages " + type;

  setTimeout(function(){
    document.getElementById("messages").style.display = "none"
    document.getElementById("messages").className = "";
  }, 4000);
}

var clearFavourites = function(){
  setCookie(_domain, _cookieDrinks, null, _oneYear);
}

var addFavourite = function(){
  getCookies(_domain, _cookieDrinks, function(drinksValues){
    var newFavList = drinksValues;
    var newFav = document.getElementById("newBrewInput").value;
    document.getElementById("newBrewInput").value = "";

    if(!isEmpty(newFav)){
      if(isEmpty(drinksValues)){
        newFavList = newFav;
      }
      else{
        newFavList = newFavList + _delimiter + newFav
      }
      setCookie(_domain, _cookieDrinks, newFavList, _oneYear);

      setUpBrews();
    }
  });
}

var deleteFavorite = function(brewId){
  getCookies(_domain, _cookieDrinks, function(drinksValues){
    var drinks = drinksValues.split(_delimiter);
    drinks[brewId] = "";
    var newDrinksValues = joinNoNulls(drinks, _delimiter);
    setCookie(_domain, _cookieDrinks, newDrinksValues, _oneYear);
    setUpBrews();
  });
}

var askBrew = function(brew){
  getCookies(_domain, _cookiePerson, function(person){
    makeRequest(_url + "addBrew", "brewName=" + encodeURI(brew) + "&personName=" + encodeURI(person), function(data){
      var success = data.status === 200;
      if(success){
        message("Someone will (hopefully) make you a " + brew + "!", "success");
      }
      else{
        message("Oops... I think I lost your " + brew + ".", "fail");
      }
    });
  });
}

var prepareKettle = function(){
  disable(document.getElementById("prepareKettle"), true);
  getCookies(_domain, _cookiePerson, function(person){
    checkPreparer(function(preparer){
      if(person === preparer || isEmpty(preparer)){
        makeRequest(_url + "turnOn", "personName="+person, function(){
          message("I'll let people know then.", "success");
          enable(document.getElementById("prepareKettle"));
        });
      }
      else{
        message("It looks like " + preparer + " is already boiling some water.", "fail");
      }

      document.getElementById("prepareKettle").innerHTML = "serve the brews"
      document.getElementById("prepareKettle").onclick = function(){
        doneServing();
      };
    });
  });
}

var checkPreparer = function(callback){
  makeRequest(_url + "brewer", "", function(data){
    if(data.status === 200){
      _preparer = data.response;
    }
    callback(_preparer);
  });
}

var doneServing = function(){
  disable(document.getElementById("prepareKettle"), true);
  makeRequest(_url + "doneServing", "", function(data){
      document.getElementById("prepareKettle").innerHTML = "turn the kettle on"
      document.getElementById("prepareKettle").onclick = function(){
        prepareKettle();
      };
      message("Done serving", "success");
      enable(document.getElementById("prepareKettle"));
  });
}

var setUser = function(username){
  setCookie(_domain, _cookiePerson, username, _oneYear)
}

var getUser = function(callBack){
  getCookies(_domain, _cookiePerson, function(user){
    callBack(user);
  });
}

var setUpBrews = function(drinksValues){
  getCookies(_domain, _cookieDrinks, function(drinksValues){
    var usuals = document.getElementById("usuals");
    usuals.innerHTML = "";
    if(isEmpty(drinksValues)){
      usuals.style.display = "none";
      document.getElementById("clearFavBtn").style.display = "none";
      document.getElementById("usualsTitle").style.display = "none";
      return;
    }

    document.getElementById("clearFavBtn").style.display = "block";

    usuals.style.display = "block";

    var drinks = drinksValues.split(_delimiter);

    for(var i=0; i<drinks.length; i++){
      var drinkButton = document.createElement("button");
      drinkButton.className="brewButton";
      drinkButton.id="askFav"+i;
      drinkButton.innerHTML=drinks[i];
      drinkButton.addEventListener("click", function(){
        askBrew(this.innerHTML);
      });

      var drinkDelButton = document.createElement("button");
      drinkDelButton.className="deleteFav";
      drinkDelButton.id="delFav"+i;
      drinkDelButton.innerHTML="x";
      drinkDelButton.addEventListener("click", function(){
        deleteFavorite(this.id.replace("delFav", ""));
      });

      usuals.appendChild(drinkButton);
      usuals.appendChild(drinkDelButton);
    }
  });
}

var loadUser = function(){
  getCookies(_domain, _cookiePerson, function(personValue){
    document.getElementById("personName").value = personValue;
  });
}

loadUser();
setUpBrews();

document.getElementById("clearFavBtn").onclick = function(){
  clearFavourites();
  setUpBrews();
};

document.getElementById("addFavBtn").onclick = function(){
  addFavourite();
};

document.getElementById("personName").onkeypress = function(e){
  if (13 === e.keycode || 13 === e.which) { //Enter key
    this.blur();
  }
};

document.getElementById("personName").onblur = function(){
  setUser(this.value);
}

document.getElementById("newBrewInput").onkeypress = function(e){
  if (13 === e.keycode || 13 === e.which) { //Enter key
    askBrew(this.value);
    this.value = "";
  }
};

document.getElementById("askBrew").onclick = function(){
  askBrew(document.getElementById("newBrewInput").value);
};

getUser(function(user){
  checkPreparer(function(preparer){
    if(isEmpty(preparer)){
      document.getElementById("prepareKettle").onclick = function(){;
        prepareKettle();
      };
      enable(document.getElementById("prepareKettle"));
    }
    else{
      if(preparer === user){
        document.getElementById("prepareKettle").innerHTML = "serve the brews"
        document.getElementById("prepareKettle").onclick = function(){
          doneServing();
        };
        enable(document.getElementById("prepareKettle"));
      }
    }
  });
});
