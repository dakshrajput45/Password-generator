const inputSlider = document.querySelector("[data-lenslider]");
const lengthDisplay = document.querySelector("[data-lenNum]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copybtn]");
const copyMsg = document.querySelector("[data-copyMsg]"); 
const uppercaseCheck = document.querySelector("#uppercase"); 
const lowercaseCheck = document.querySelector("#lowercase"); 
const numberCheck = document.querySelector("#number"); // Corrected
const symbolsCheck = document.querySelector("#symbols"); 
const indicator = document.querySelector("[data-indicator]"); 
const generateBtn = document.querySelector(".genrate-password"); // Corrected
const allCheckBox = document.querySelectorAll("input[type=checkbox]"); 
const sym = '~`:()[]{}&^%$#@*/?":;,<>|+=.'
//default
let password = "";
let passwordLen = 10;
let checkCnt = 0;
handleSlider();
setIndicator("#ccc");

//set length path password
function handleSlider() {
    inputSlider.value = passwordLen;
    lengthDisplay.innerText = passwordLen; 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLen-min)*100/(max-min))+"%100%"
}

function setIndicator(color) {
    indicator.style.background = color;
    indicator.style.boxShadow = '10px 10px 10px rgba(0, 0, 0, 0.5)'; 
}

function getRndInteger(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRndNumber() {
    return getRndInteger(0,9);
}

function genLowercase() {
   return String.fromCharCode(getRndInteger(97,123)); 
}

function genUppercase() {
    return String.fromCharCode(getRndInteger(67,90)); 
}

function genSymbol() {
    const randNum = getRndInteger(0,sym.length);
    return sym.charAt(randNum);
}
 
function calStrength() {
    let  up = false;
    let lo = false;
    let num = false;
    let sym = false;
    if(uppercaseCheck.checked) up = true;
    if(lowercaseCheck.checked) low = true;
    if(numberCheck.checked) num = true;
    if(symbolsCheck.checked) sym = true;
    
    if(up && low && (num || sym) && passwordLen >= 8) {
        setIndicator("#0f0");
    } else if (
        (low || up) &&
        (num || sym) &&
        passwordLen>=6
    ){
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

function shufflePassword(array) {
    //fisher Yates Method
    for(let i = array.length-1 ; i>0;i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    let str = "";
    array.forEach((e) => (str +=e));
    return str;
}
function handleCheckBox (){
    checkCnt = 0;
    allCheckBox.forEach ( (checkBox) =>{
        if(checkBox.checked)
        checkCnt++;
    })
    // special
    if(passwordLen < checkCnt)
    {
        passwordLen = checkCnt;
        handleSlider();
    }
}
async function copy_content() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed"
    }
    //to make copy wala span visble
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input',(e) => {
    passwordLen = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copy_content();
})

allCheckBox.forEach((checkBox) =>{
    checkBox.addEventListener('change',handleCheckBox);
})
//main fun genrate_password
generateBtn.addEventListener('click',() => {
    if(checkCnt==0)return;

    if(passwordLen <= checkCnt){
    passwordLen = checkCnt;
    handleSlider();
    }

    password = "";

    //check checkboxes
    // if(uppercaseCheck.checked){
    //     password += genUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += genLowercase();
    // }
    
    // if(numberCheck.checked){
    //     password += getRndNumber();
    // }
    
    // if(symbolsCheck.checked){
    //     password += genSymbol();
    //console.log("yha tk");
    let funArr = []

    if(uppercaseCheck.checked){
        funArr.push(genUppercase);
    }
    if(lowercaseCheck.checked){
        funArr.push(genLowercase);
    }
    
    if(numberCheck.checked){
        funArr.push(getRndNumber);
    }
    
    if(symbolsCheck.checked){
        funArr.push(genSymbol);
    }
    //console.log("yha yha tak");
    for(let i=0; i<funArr.length;i++)
    {
        password+= funArr[i]();
    }
    for(let i =0;i<passwordLen-funArr.length;i++)
    {
        let randInd = getRndInteger(0,funArr.length);
        //console.log("randind ->" + randInd);
        password += funArr[randInd]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    calStrength();
})