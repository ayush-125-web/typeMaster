import paras from './para.js'

    let idx=Math.floor(Math.random()*6);
    let currTimer=30;
    let currentIndex=0;
    let isTimeStarted=false;
    let textTyped=0;
    let paraLength=paras[idx].length;
    let correctlyTyped=0;
    const contentDIV=document.querySelector('.content')
    const input=document.querySelector('input')
    const timeSelector = document.querySelector('.timer')
    const refershButton=document.querySelector('.reload')
    const dynTimer=document.querySelector('.dynTime')
   

    function render(){
         idx=Math.floor(Math.random()*6);
         currentIndex=0;
         randomParaGenrate(contentDIV);
         isTimeStarted=false;
         dynTimer.textContent='';
         dynTimer.classList.remove('dynTimer')

    }

    

    function handleTimeSetter(e){
      
        let selectedTIme=e.target.value;
        currTimer=Number(selectedTIme);
       
        timeSelector.innerHTML='';
        timeSelector.textContent=` Timer:  ${currTimer}sec`;
    }

    function handleOnClickTimer(){
        if(timeSelector.querySelector('select')) return;
        timeSelector.innerHTML=`<select class="selectTime">
        <option value="30">30s</option>
        <option value="60">60s</option>
        <option value="90">90s</option>
        <option value="120">120s</option>
        </select>`

        document.querySelector('select').addEventListener('change',(e)=>handleTimeSetter(e));
        document.querySelector('select').value=currTimer;
        document.querySelector('select').addEventListener('blur', () => timeSelector.textContent = `Timer: ${currTimer}sec`);
    }


    function randomParaGenrate(contentDIV){
    
        contentDIV.innerHTML=paras[idx].split('').map((char,i)=>`<span id="${i}">${char}</span>`).join('');

    
    }

    function updateCursor(currIdx){
        if(currIdx!=0) document.getElementById(`${currIdx-1}`).classList.remove('cursor');
        document.getElementById(`${currIdx}`).classList.add('cursor');
    }

    function endAndResult(paraLength,correctlyTyped,textTyped,timeLeft){
        let wpm=textTyped/(5*(currTimer-timeLeft)/60)
        let cpm=textTyped/((currTimer-timeLeft)/60)
        let acc=correctlyTyped/textTyped*100;

        console.log(Math.ceil(wpm));
        console.log(acc.toFixed(2));
        console.log(Math.ceil(cpm));

    }

    function handleTime(){
       let timeLeft=currTimer;

       dynTimer.textContent=`Time Left => ${timeLeft}`;
       

       let timer=setInterval(()=>{
        timeLeft--;
        dynTimer.textContent=`Time Left => ${timeLeft}`

        if(timeLeft<=0 || textTyped==paraLength){
            clearInterval(timer);
            endAndResult(paraLength,correctlyTyped,textTyped,timeLeft);
        }

       },1000);

    }

   

    input.addEventListener("input", e => {
        textTyped++;
        if(!isTimeStarted){
            dynTimer.classList.add('dynTimer')
            handleTime();
            isTimeStarted=true;
        }
        const typed = e.target.value.slice(-1); 
        const expected = paras[idx][currentIndex];

        updateCursor(currentIndex);

        if (typed === expected) {
            correctlyTyped++;
            document.getElementById(`${currentIndex}`).classList.add("right");
        } else {
            
            document.getElementById(`${currentIndex}`).classList.add("wrong");
        }
        currentIndex++;

        e.target.value = "";
    });


randomParaGenrate(contentDIV);


timeSelector.textContent=` Timer:  ${currTimer}sec`;
refershButton.addEventListener('click',()=>render());
timeSelector.addEventListener('click',()=>handleOnClickTimer());





render();


