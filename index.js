import paras from './para.js'

    let idx=Math.floor(Math.random()*6);
    let currTimer=30;
    let currentIndex=0;
    let isTimeStarted=false;
    let textTyped=0;
    let paraLength=paras[idx].length;
    let correctlyTyped=0;
    let keydownhandler=null;
    let timer=null;
    
    const ui=document.querySelector('.typeUI');

    function initizaliser(){
        const contentDIV=document.querySelector('.content')
        const input=document.querySelector('input')
        const timeSelector = document.querySelector('.timer')
        const refershButton=document.querySelector('.reload')
        const dynTimer=document.querySelector('.dynTime')
        const hiddenInput=document.getElementById('hiddenInput');
        

        idx=Math.floor(Math.random()*6);
        currTimer=30;
        currentIndex=0;
        isTimeStarted=false;
        textTyped=0;
        paraLength=paras[idx].length;
        correctlyTyped=0;

        randomParaGenrate(contentDIV);
        timeSelector.textContent=` Timer:  ${currTimer}sec`;

        hiddenInput.focus();
        contentDIV.addEventListener('click',()=>hiddenInput.focus());

        refershButton.addEventListener('click',()=>render());
        if(keydownhandler) document.removeEventListener('keydown',keydownhandler);

         //for laptop
        keydownhandler=(e)=>{
            if(e.key=='Backspace'){
                 e.preventDefault();
                handleBackSpace();
            }
            else if(e.key.length==1){
                 e.preventDefault();
                handlecharType(e.key,dynTimer);         
            }
        };

        //for smartphone
        hiddenInput.value='';
        hiddenInput.addEventListener('input',(e)=>{
            if(e.inputType=='deleteContentBackward'){
                handleBackSpace();
            }
            else if(e.data){
                handlecharType(e.data,dynTimer);
                hiddenInput.value='';
            }
        })
        document.addEventListener('keydown',keydownhandler);
        timeSelector.addEventListener('click',()=>handleOnClickTimer(timeSelector));
        
    }

    function render(){
         ui.innerHTML=`
            <div class="timer"></div>
            <div class="language">Language : English</div>  
            <div class="dynTime"></div>
            <input type="text" id="hiddenInput" 
       style="opacity:0; position:absolute; pointer-events:none;" />
            <div class="content"></div>
            <button class="reload">refresh</button>
         `

         initizaliser();
    }

    function handleBackSpace(){
        if(document.getElementById(`${currentIndex-1}`).className=='wrong'){
            document.getElementById(`${currentIndex-1}`).classList.remove('wrong');
        }
        else if(document.getElementById(`${currentIndex-1}`).className=='right'){
            correctlyTyped--;
            document.getElementById(`${currentIndex-1}`).classList.remove('right');
        }
        
        document.getElementById(`${currentIndex}`).classList.remove('cursor');
        textTyped--;
        currentIndex--;
        document.getElementById(`${currentIndex}`).classList.add('cursor');

    }

    function handlecharType(char,dynTimer){
        textTyped++;
                if(!isTimeStarted){
                    dynTimer.classList.add('dynTimer')
                    handleTime(dynTimer);
                    isTimeStarted=true;
                }
                const typed = char; 
                console.log(typed);
                const expected = paras[idx][currentIndex];

                updateCursor(currentIndex+1);

                if (typed === expected) {
                    correctlyTyped++;
                    document.getElementById(`${currentIndex}`).classList.add("right");
                } else {
                    
                    document.getElementById(`${currentIndex}`).classList.add("wrong");
                }
                currentIndex++;
            }


    

    function handleTimeSetter(e,timeSelector){
      
        let selectedTIme=e.target.value;
        currTimer=Number(selectedTIme);
       
        timeSelector.innerHTML='';
        timeSelector.textContent=` Timer:  ${currTimer}sec`;
    }

    function handleOnClickTimer(timeSelector){
        if(timeSelector.querySelector('select')) return;
        timeSelector.innerHTML=`<select class="selectTime">
        <option value="30">30s</option>
        <option value="60">60s</option>
        <option value="90">90s</option>
        <option value="120">120s</option>
        </select>`

        document.querySelector('select').addEventListener('change',(e)=>handleTimeSetter(e,timeSelector));
        document.querySelector('select').value=currTimer;
        document.querySelector('select').addEventListener('blur', () => timeSelector.textContent = `Timer: ${currTimer}sec`);
    }


    function randomParaGenrate(contentDIV){
        contentDIV.innerHTML=paras[idx].split('').map((char,i)=>`<span id="${i}">${char}</span>`).join('');
    }

    function updateCursor(currIdx){
        const active=document.getElementById(`${currIdx}`);
        if(currIdx!=0) document.getElementById(`${currIdx-1}`).classList.remove('cursor');
        document.getElementById(`${currIdx}`).classList.add('cursor');

        active.scrollIntoView({
             behavior: "smooth",
             block: "nearest",
             inline: "nearest"
        })
    }

    function endAndResult(paraLength,correctlyTyped,textTyped,timeLeft){
        let wpm=textTyped/(5*(currTimer-timeLeft)/60)
        let cpm=textTyped/((currTimer-timeLeft)/60)
        let acc=correctlyTyped/textTyped*100;

        let statement;

        if(wpm<25) statement='You are a Tortoise 🐢🐢'
        else if (wpm<50) statement='You are a Horse 🐎🐎'
        else statement='You are a cheetah 🐆🐆🐆'

      

        const prevUI=ui;

        ui.innerHTML=`
        <div class='result'>
         <div class='wpm'>
           Your Word Per Minute is : ${Math.ceil(wpm)}
         </div>
         <div class='cpm'>
           Your Character Per Minute is : ${Math.ceil(cpm)}
         </div>
         <div class='acc'>
           Your Accuracy is : ${acc.toFixed(2)}
         </div>
         <div class='state'>
          ${statement}  
         </div>
         <button class='reset'>
         Restart Again
         </button>
        </div>`

        
        ui.querySelector('.reset').addEventListener('click',()=>render());
    }

    function handleTime(dynTimer){
    if(timer) clearInterval(timer);
       let timeLeft=currTimer;

       dynTimer.textContent=`Time Left => ${timeLeft}`;
       

        timer=setInterval(()=>{
        timeLeft--;
        dynTimer.textContent=`Time Left => ${timeLeft}`

        if(timeLeft<=0 || textTyped==paraLength){
            clearInterval(timer);
            timer=null;
            endAndResult(paraLength,correctlyTyped,textTyped,timeLeft);
        }

       },1000);

    }

render();


