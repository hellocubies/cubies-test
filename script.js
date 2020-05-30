let cubies = window.data; //checklist data  가져오기
let myStorage = window.localStorage; //로컬 저장소 만들기

//download number check하기. 처음이면 0
// let dnNum;
// if (myStorage.getItem('downloadToday') !== null) {
//     dnNum = myStorage.getItem('downloadToday');
// } else {
//     dnNum = 0;
//     myStorage.setItem('downloadToday', dnNum);
// }


//getCubie눌리면 실행하게 하기. 
//Daily cubie 6시간에 한번씩 리셋되게 하기
let targetDaily = document.querySelector('div.get-cubie');
let nextEndtime = 0, //endTime
    downloaded = 0,
    tempImg = ['Qub87'],
    tempName = ['TEST']; // 블랭크 이미지로 바꿔와야 함. 안쓰이지만 값 필요
let timenow = Date.now();


if (myStorage.getItem('nextEndtime') !== null) {
    nextEndtime = myStorage.getItem('nextEndtime');
}

if (nextEndtime > timenow) { // endtime지났으면 초기화 상태로 유지
    if (myStorage.getItem('downloaded') !== null) {
        downloaded = myStorage.getItem('downloaded');
    }
    if (myStorage.getItem('tempImg') !== null) {
        tempImg = myStorage.getItem('tempImg');
    }
    if (myStorage.getItem('tempName') !== null) {
        tempName = myStorage.getItem('tempName');
    }
}

//test용 초기화하기
// let btnInit = document.querySelector('.btn-init');
// btnInit.onclick = initStorage;

// function initStorage() {
//     console.log('Storage daily, downloaded,tempImg will be removed')
 
//         localStorage.removeItem('nextEndtime');
//         localStorage.removeItem('downloaded');
//         localStorage.removeItem('tempImg');
   
// }

//Checklist 만들기
let targetList = document.querySelector('div.card-list');
cubies.forEach(createList);
let prevStory;

function createList(cubie) {
    let temp = document.querySelector('#card-temp');
    let newCubie = document.importNode(temp.content, true);
    for (let key in cubie) {

        if (newCubie.querySelector('.' + key) !== null) {
            if (key === 'cubie-story-content') {
                newCubie.querySelector('.' + key).textContent = cubie[key];
            } else {
                newCubie.querySelector('.' + key).textContent = key.slice(6, 7).toUpperCase() + key.slice(7) + " : " + cubie[key];
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

    targetList.insertBefore(newCubie, targetList.childNodes[0]);
    //check ownership from local storage, check and show story toggle button
    let ownership = myStorage.getItem(cubie['cubie-name']);
    // console.log(ownership);
    if (ownership === '1') {
        // console.log('Ownership is 1');
        let toggleBtn = document.querySelector('div.story-toggle.' + cubie['cubie-name']);
        // console.log(toggleBtn);
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
    document.querySelector('.remaining-time').textContent = getTimeRemaining(nextEndtime);
}

//story 창 close 버튼 모든 cubie에 붙이기
let closeBtn = document.getElementsByClassName('btn-close');
// console.log(closeBtn);
for (let i = 0; i < closeBtn.length; i++) {
    closeBtn[i].onclick = closeStory;
}

function closeStory() {
    let closingStory = document.querySelector('div.cubie-story.' + this.classList[1]);
    // console.log(closingStory);
    closingStory.style.display = 'none';
    let toggleBtn = document.querySelector('div.story-toggle.' + this.classList[1]);
    toggleBtn.style.display = 'block';
    prevStory = undefined;
}
//own checkbox check될때 story보여주면서 다른 story창 닫기,  uncheck될때 mystory button없애기
let el = document.getElementsByTagName('input');
// console.log(el);
for (let i = 0; i < el.length; i++) {
    if (el[i].type === 'checkbox') {
        el[i].onclick = showStory;
    }
}

function showStory() {
    let cubieName = this.classList[1];
    if (this.checked === true) {
        // console.log(cubieName);
        let cubieStory = document.querySelector('div.cubie-story.' + cubieName);
        // console.log(cubieStory);
        if (prevStory !== undefined) {
            // console.log(prevStory);
            prevStory.style.display = 'none';
            let toggleBtn = document.querySelector('div.story-toggle.' + prevStory.classList[1]);
            toggleBtn.style.display = 'block';
        }
        cubieStory.style.display = 'block';
        prevStory = cubieStory;
        myStorage.setItem(cubieName, 1);
        // console.log('myStorage' + myStorage.getItem(cubieName));
    } else {
        let cubieName = this.classList[1];
        // console.log(cubieName);
        let cubieStory = document.querySelector('div.cubie-story.' + cubieName);
        // console.log(cubieStory);
        cubieStory.style.display = 'none';
        let toggleBtn = document.querySelector('div.story-toggle.' + cubieName);
        toggleBtn.style.display = 'none';
        if (prevStory !== undefined) {
            if (prevStory.classList[1] === cubieName) {
                prevStory = undefined;
            }
        }
        myStorage.removeItem(cubieName);
    }
}

//my story button으로 스토리 다시열어보기
let myStoryBtn = document.getElementsByClassName('btn-story-toggle');
// console.log(myStoryBtn);
for (let i = 0; i < myStoryBtn.length; i++) {
    myStoryBtn[i].onclick = storyOpen;
}

function storyOpen() {
    let cubieName = this.classList[1];
    // console.log(cubieName);
    let cubieStory = document.querySelector('div.cubie-story.' + cubieName);
    // console.log(cubieStory);
    if (prevStory !== undefined) {
        prevStory.style.display = 'none';
        let toggleBtn = document.querySelector('div.story-toggle.' + prevStory.classList[1]);
        toggleBtn.style.display = 'block';
    }
    cubieStory.style.display = 'block';
    prevStory = cubieStory;
}


// console.log('nextEndtime', nextEndtime);
// console.log('downloaded', downloaded);
// console.log('tempImg', tempImg);


//getcubie누른 후에는 template과 다운로드 버튼, 다운로드 한 후에는 다시 물음표와 몇시간 후에 니 튜비 나온다는걸로 변경
createDailyCubie(Number(nextEndtime));
console.log('downloaded', downloaded)
function createDailyCubie(endstamp) {
    let temp = document.querySelector('#daily-temp');
    let newDaily = document.importNode(temp.content, true);
   console.log('endtime, timenow', endstamp, timenow);
    if (endstamp < timenow) {
        // newDaily.querySelector('div.before-message').textContent = 'Your Cubie is waiting for you';
        newDaily.querySelector('div.before-get').style.display = 'block';
        newDaily.querySelector('div.after-get').style.display = 'none';
    } else {
        newDaily.querySelector('div.before-get').style.display = 'none';
        newDaily.querySelector('div.after-get').style.display = 'block';
        newDaily.querySelector('div.lucky-template').style.backgroundImage = 'url("images/' + tempImg + '.png")';
        newDaily.querySelector('h2.lucky-title').textContent = 'You got ' + tempName + '!';
        if (downloaded === '1') {
            
            newDaily.querySelector('div.download-bar').style.display = 'none';
            console.log(newDaily.querySelector('div.download-bar'));
            console.log(newDaily.querySelector('div.download-bar').style.display);
            newDaily.querySelector('div.after-message').textContent = 'Are you enjoying the time with your ' + tempName + '?';
            newDaily.querySelector('div.remaining-time').textContent = getTimeRemaining(endstamp);
        } else if (downloaded === '0') {
            newDaily.querySelector('div.download-bar').style.display = 'block';
            console.log('tempImg : ' + tempImg);
            newDaily.querySelector('div.after-message').textContent = 'Click download button and save the image';
            newDaily.querySelector('div.remaining-time').textContent = getTimeRemaining(endstamp);
        }
        

    }
    // targetDaily.insertBefore(newDaily, targetDaily.childNodes[0]);
    targetDaily.appendChild(newDaily);
}

function getTimeRemaining(endtime) {
    // console.log(Date.now());
    let t = endtime - Date.now();
    // var t = Date.parse(endtime) - Date.parse(new Date());
    // console.log(t);
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    // var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return hours + ' hours  ' + minutes + ' mins  ' + seconds + ' secs';
}


//Daily random cubie 뽑기, 다운로드 받기, 몇번 받았는지 몇시간 남았는지 시간 계산하기
let getCubieBtn = document.querySelector('.btn-lucky');
console.log('show my lucky cubie');
console.log(getCubieBtn);
getCubieBtn.onclick = getRandomCubie;


function getRandomCubie() {
    let templates = window.templateData;
    let randomCubies = [];
    let rarityFreq = [1, 20, 35, 45]
    for (let key in templates) {
        for (let i = 0; i < rarityFreq[templates[key][1] - 1]; i++) {
            randomCubies.push(key);
        }
    }
    console.log(randomCubies);
    let randomCubie = randomCubies[Math.floor(Math.random() * randomCubies.length)];
    console.log(randomCubie);
    // let chanceNum = this.classList[1].slice(-1);
    // console.log(chanceNum);
    let dailyChance = document.querySelector('div.daily-chance');
    console.log('dailyChance', dailyChance);
    let afterGet = dailyChance.querySelector('div.after-get');
    // console.log('after-get', afterGet);
    let beforeGet = dailyChance.querySelector('div.before-get');
    afterGet.style.display = 'block';
    beforeGet.style.display = 'none';
    let cubieTemplate = dailyChance.querySelector('div.lucky-template');
    let luckyTitle = dailyChance.querySelector('h2.lucky-title');
    luckyTitle.textContent = 'You got ' + randomCubie + '!';
    console.log('luckyTitle', luckyTitle);
    console.log(templates[randomCubie][0]);

    cubieTemplate.style.backgroundImage = 'url("images/' + templates[randomCubie][0] + '.png")';
    
    myStorage.setItem('downloaded', 0);
    myStorage.setItem('tempImg', templates[randomCubie][0]);
    tempImg = templates[randomCubie][0];
    myStorage.setItem('tempName', randomCubie);
    tempName = randomCubie;
    // console.log('chancenum', chanceNum);

    myStorage.setItem('nextEndtime', timenow + (0.1 * 1000 * 60 * 60));
    nextEndtime = timenow + (0.1 * 1000 * 60 * 60);
    // console.log('endtime calculate', daily[chanceNum]);
    let remainingTime = dailyChance.querySelector('div.remaining-time');
    // console.log('remainingTime',remainingTime);
    remainingTime.textContent = getTimeRemaining(nextEndtime);
    let afterMessage = dailyChance.querySelector('div.after-message');
    // console.log('remainingTime',remainingTime);
    afterMessage.textContent = 'Click download button below and save the image to your computer.';
}

//Download Button download 받았다고 카운트 되고,  download버튼이 없어지고 Downloaded로 메세지 바뀜. 
let downloadBtn = document.querySelector('.btn-download');


    downloadBtn.onclick = tempDown;


function tempDown() {
    // console.log(this);
    // console.log('Here we are!');
    // if (dnNum !== null) {
    //     dnNum++;
    // } else {
    //     dnNum = 1;
    // }
    // // myStorage.setItem('downloadToday', dnNum);
    // // alert('you downloaded ' + dnNum + 'times!')
    // if (dnNum > 5) {
    //     this.style.display = 'none';
    //     myStorage.removeItem('downloadToday');
    // }
    this.style.display = 'none';
    document.querySelector('div.after-message').textContent = 'Are you enjoying the time with your ' + tempName + '?';
            
    myStorage.setItem('downloaded', 1);
    downloaded = 1;
    window.open('images/' + tempImg + '.png');

}