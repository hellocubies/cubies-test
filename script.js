let cubies = window.data;
let myStorage = window.localStorage;
let randomCubies = ['Aurelie', 'Aurelie', 'Molton', 'Molton', 'Molton', 'Molton', 'Molton']

let targetList = document.querySelector('div.card-list');
cubies.forEach(createList);
let prevStory;

function createList(cubie) {
    let temp = document.querySelector('#card-temp');
    let newCubie = document.importNode(temp.content, true);
    for (key in cubie) {
        // console.log(cubie[key]);
        if (newCubie.querySelector('.' + key) !== null) {
            if (key === 'cubie-story-content') {
                newCubie.querySelector('.' + key).textContent = cubie[key];
            } else {
                newCubie.querySelector('.' + key).textContent = key.slice(6).toUpperCase() + " : " + cubie[key];
            }
        }

    }
    newCubie.querySelector('img.cubie-img').src = 'images/' + cubie['cubie-img'] + '.JPG';
    newCubie.querySelector('div.thumb-card').id = cubie['cubie-name'];
    newCubie.querySelector('input').classList.add(cubie['cubie-name']);
    newCubie.querySelector('div.cubie-story').classList.add(cubie['cubie-name']);
    newCubie.querySelector('.btn-close').classList.add(cubie['cubie-name']);
    newCubie.querySelector('.story-toggle').classList.add(cubie['cubie-name']);
    newCubie.querySelector('.btn-story-toggle').classList.add(cubie['cubie-name']);
    //   console.log(newCubie.querySelector('input').classList);
    targetList.insertBefore(newCubie, targetList.childNodes[0]);
    //check ownership from local storage, check and show story toggle button
    let ownership = myStorage.getItem(cubie['cubie-name']);
    console.log(ownership);
        if (ownership === '1') {
            console.log('Ownership is 1');
            let toggleBtn = document.querySelector('div.story-toggle.' + cubie['cubie-name']);
            console.log(toggleBtn);
                toggleBtn.style.display = 'block';
            let checkOwn = document.querySelector('input.own-check.' + cubie['cubie-name']);
                checkOwn.checked = true;
        }
    }
    //menu bar
    let menuItems = document.querySelector('menu-item');
    let checklist = document.querySelector('div.checklist');
    let aboutUs = document.querySelector('div.about-us');
    let getCubie = document.querySelector('div.get-cubie');

    let btnChecklist = document.querySelector('.btn-checklist');
    btnChecklist.onclick = showChecklist;
    let btnAboutUs = document.querySelector('.btn-about-us');
    btnAboutUs.onclick = showAboutUs;
    let btnGetCubie = document.querySelector('.btn-get-cubie');
    btnGetCubie.onclick = showGetCubie;
    let btnClose = document.querySelector('.btn-close');
    btnClose.onclick = closeStory;

    function showChecklist() {
        aboutUs.style.display = 'none';
        getCubie.style.display = 'none';
        checklist.style.display = 'block';
    }

    function showAboutUs() {
        aboutUs.style.display = 'block';
        getCubie.style.display = 'none';
        checklist.style.display = 'none';
    }

    function showGetCubie() {
        aboutUs.style.display = 'none';
        getCubie.style.display = 'block';
        checklist.style.display = 'none';
    }

    let closeBtn = document.getElementsByClassName('btn-close');
    console.log(closeBtn);

    for (let i = 0; i < closeBtn.length; i++) {
        closeBtn[i].onclick = closeStory;
    }

    function closeStory() {
        let closingStory = document.querySelector('div.cubie-story.' + this.classList[1]);
        console.log(closingStory);
        closingStory.style.display = 'none';
        let toggleBtn = document.querySelector('div.story-toggle.' + this.classList[1]);
        toggleBtn.style.display = 'block';
        prevStory = undefined;
    }


    let el = document.getElementsByTagName('input');
    console.log(el);

    for (let i = 0; i < el.length; i++) {
        if (el[i].type === 'checkbox') {
            el[i].onclick = showStory;
        }
    }

    function showStory() {
        let cubieName = this.classList[1];
        if (this.checked === true) {
            console.log(cubieName);
            let cubieStory = document.querySelector('div.cubie-story.' + cubieName);
            console.log(cubieStory);
            if (prevStory !== undefined) {
                console.log(prevStory);
                prevStory.style.display = 'none';
                let toggleBtn = document.querySelector('div.story-toggle.' + prevStory.classList[1]);
                toggleBtn.style.display = 'block';
            }
            cubieStory.style.display = 'block';
            prevStory = cubieStory;
            localStorage.setItem(cubieName, 1);
            console.log('localStorage' + localStorage.getItem(cubieName));
        } else {
            let cubieName = this.classList[1];
            console.log(cubieName);
            let cubieStory = document.querySelector('div.cubie-story.' + cubieName);
            console.log(cubieStory);
            cubieStory.style.display = 'none';
            let toggleBtn = document.querySelector('div.story-toggle.' + cubieName);
            toggleBtn.style.display = 'none';
            if (prevStory !== undefined) {
                if (prevStory.classList[1] === cubieName) {
                    prevStory = undefined;
                }
            }
            localStorage.removeItem(cubieName);
        }
    }

    let myStoryBtn = document.getElementsByClassName('btn-story-toggle');
    console.log(myStoryBtn);

    for (let i = 0; i < myStoryBtn.length; i++) {
        myStoryBtn[i].onclick = storyOpen;
    }

    function storyOpen() {
        let cubieName = this.classList[1];
        console.log(cubieName);
        let cubieStory = document.querySelector('div.cubie-story.' + cubieName);
        console.log(cubieStory);
        if (prevStory !== undefined) {
            prevStory.style.display = 'none';
            let toggleBtn = document.querySelector('div.story-toggle.' + prevStory.classList[1]);
            toggleBtn.style.display = 'block';
        }
        cubieStory.style.display = 'block';
        prevStory = cubieStory;


    }

    /** Local Storage Availability test
    function storageAvailable(type) {
        var storage;
        try {
            storage = window[type];
            var x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }
    if (storageAvailable('localStorage')) {
        alert('Yippee! We can use localStorage awesomeness') ;
      }
      else {
        // 
        alert('Too bad, no localStorage for us');
      }

     */