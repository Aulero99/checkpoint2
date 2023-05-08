let stapleCount = 0
let staplePrice = 0

let money = 10000000

let wire = 1000
let wireLength = 1000
let wirePrice = 1
let wireUpgradeLevel = 1
let autoWireBuyer = ''

let autoWire = false

let autoStapleRate = 1000
let autoStapleSmall = 0
let autoStapleSmallMultiplier = 1
let autoStapleLarge = 0
let autoStapleLargeMultiplier = 500

let clickLevel = 1

let marketTrack = 1

const wirePriceArray = [
    {min:1,max:3, seg:1000, price:500},
    {min:2,max:9, seg:5000, price:1000},
    {min:14,max:28, seg:15000, price:2000},
    {min:50,max:100, seg:1000001, price:0}
]
let wireTrack = 0



// These are the universal interval updaters for
// the money and staple increases
let writeSmallStapleCountInterval = undefined
let writeLargeStapleCountInterval = undefined




// These functions take in how many staples to add to the tracker
// then writes those changes both to the total staple count
// as well as the unsold staple count
function increaseStapleCount(number){
    let staples = number
    if (wire<=0){
        wire = 0
        return
    }
    if(wire<number){
        staples = wire
    }
    stapleCount += staples

    money+=(staplePrice/100)*staples

    writeStapleCount()
    storeCheck()
    writeWireLength(-staples)
    writeMoney()
}
function writeStapleCount(){
    document.getElementById('stapleCountHTM').innerText=stapleCount
}




// These functions deduct the cost of the wire index from
// the money then increase wire length by the wire
// length variable
function increaseWireLength(){
    if(money<wirePrice){
        return
    }else{
        money-=wirePrice
        writeWireLength(wireLength)
        writeMoney()
    }
}
function writeWireLength(number){
    wire += number
    document.getElementById('wireLengthHTM').innerText=wire
}




// These functions take in an argument for how much to change the
// price of staples by, then writes the price of the staples tracked
// by the staplePrice variable which is globally defined
function priceChange(number){
    staplePrice += number
    writeStaplePrice()
}
function writeStaplePrice(){
    let number = ''
    number = '$' + (staplePrice/100)
    
    document.getElementById('staplePriceHTM').innerText=number
}




// This function increases the level of marketing
function marketIncrease(){
    let price = (marketTrack ** 2)**2

    // This section takes that price value and compares it to
    // the money on hand, and if there is not enough it sets the
    // track back by 1 then returns
    if(price > money){
        return
    }else{
        money -= price
    }
    marketTrack++
    writeMarket()
    writeClickUpgrade()
}
function writeMarket(){
    let price = (marketTrack ** 2)**2

    document.getElementById('marketingHTM').innerText=marketTrack
    document.getElementById('marketingPriceHTM').innerText = '$' + price
    priceChange(1)
    writeMoney()
}




// This function updates the money on the dom
function writeMoney(){
    let moneyFix = money*100
    moneyFix = Math.floor(moneyFix)/100
    document.getElementById('moneyHTM').innerText = '$' + moneyFix
}





// These are the functions for the auto staplers
// let autoStapleRate = 1000
// let autoStapleSmall = 0
// let autoStapleSmallMultiplier = 1
// let autoStapleLarge = 0
// let autoStapleLargeMultiplier = 500
function autoSmallIncrease(number){
    // Starts the interval
    if(writeSmallStapleCountInterval == undefined){
        clearInterval(writeSmallStapleCountInterval)
        writeSmallStapleCountInterval = setInterval(autoStapleGenSmall, autoStapleRate)
        console.log('interval set');
    }
    // checks the price
    let price = Math.floor(((autoStapleSmall + 1)**2)/2) + 1

    if (price>money){
        return
    }

    money -= price
    autoStapleSmall += number
    price = Math.floor(((autoStapleSmall + 1)**2)/2)+ 1
    writeAutoSmall(price)
}
function autoStapleGenSmall(){
    increaseStapleCount(autoStapleSmall*autoStapleSmallMultiplier)
}
function writeAutoSmall(price){
    document.getElementById('autoSmallQtyHTM').innerText = autoStapleSmall
    document.getElementById('autoSmallPriceHTM').innerText = price
    writeMoney()
}

function autoLargeIncrease(number){
    // Starts the interval
    if(writeLargeStapleCountInterval == undefined){
        clearInterval(writeLargeStapleCountInterval)
        writeLargeStapleCountInterval = setInterval(autoStapleGenLarge, autoStapleRate)
        console.log('interval set');
    }
    // checks the price
    let price = (autoStapleLarge)**4 + 500

    if (price>money){
        return
    }

    money -= price
    autoStapleLarge += number
    price = (autoStapleLarge)**4 + 500
    writeAutoLarge(price)
}
function autoStapleGenLarge(){
    increaseStapleCount(autoStapleLarge*autoStapleLargeMultiplier)
}
function writeAutoLarge(price){
    document.getElementById('autoLargeQtyHTM').innerText = autoStapleLarge
    document.getElementById('autoLargePriceHTM').innerText = price
    writeMoney()
}




// These are the functions for the click upgrades
function clickUpgrade(number){
    let clickPrice = (clickLevel*2)-1
    
    if(clickPrice>money){
        return
    }

    money -= clickPrice
    writeMoney()

    clickLevel+=number
    clickPrice = (clickLevel*2)-1
    writeClickUpgrade()
}
function writeClickUpgrade(number){
    let income = (clickLevel*staplePrice)/100
    let clickPrice = ((clickLevel-1)*2)-1
    if (clickPrice<=0){
        clickPrice = 1
    }
    let clickElementUpgrade = `
    <div id="staplerHTM" class="col-12 stapler" onclick="increaseStapleCount(${clickLevel})">
        <div class="level">
            <h3>Income $<span id="clickLevelHTM">${income}</span></h3>
        </div>
    </div>
    `

    document.getElementById('clickUpgradeLevelHTM').innerText = clickLevel
    document.getElementById('clickPriceHTM').innerText = clickPrice
    document.getElementById('clickLevelContainerHTM').innerHTML = clickElementUpgrade
}




// These are the functions to upgrade the wire production
// and write those changes to the dom. 
// VARIABLES:
// wire = 1000
// wireLength = 1000
// wirePrice = 1
// wireUpgradeLevel = 1
// wireUpgradePrice = 500
// wirePriceArray[]
let wireMarketUpdate = setInterval(calculateWireMarket, 3000)

// This function checks to see if there is enough money in the account
// to upgrade the wire, then charges for it
function wireUpgrade(){
    let price = wirePriceArray[wireUpgradeLevel-1].price
    if(price>money){
        return
    }
    console.log('The price is ' + price);
    money-=price

    writeMoney()
    writeWire()
}
function writeWire(){
    let array = wirePriceArray

    if(wireUpgradeLevel < array.length-1){
        wireUpgradeLevel++

        let Price = array[wireUpgradeLevel - 1].price

        document.getElementById('wireUpgradeLevelHTM').innerText = wireUpgradeLevel
        document.getElementById('wireUpgradePriceHTM').innerText = '$' + Price

        calculateWireMarket()
    }else{
        document.getElementById('wireUpgradeLevelHTM').innerText = 'MAX'
        document.getElementById('wireUpgradePriceHTM').innerText = 'MAX'
        wireUpgradeLevel = array.length
    }
    
}
function calculateWireMarket(){
    let array = wirePriceArray
    let price = Math.floor(Math.random()*(array[wireUpgradeLevel-1].max - array[wireUpgradeLevel-1].min) +1 +array[wireUpgradeLevel-1].min)
    wireLength = array[wireUpgradeLevel-1].seg

    document.getElementById('wirePurchaseHTM').innerText = price
    document.getElementById('wirePurchaseLengthHTM').innerText = wireLength
}





// These functions update the store periodically based on
// the number of staples you have produced
// then writes these upgrades to the dom
const storeItemArray = [
    {
        title: 'Auto Wire',
        desc: 'Buys wire automatically',
        price: 5000,
        effect: 'null',
        function: function autoWireOn(){
            autoWireBuyer = setInterval(autoWireCheck, 100)
        }
    },
    {
        title: 'Random Item',
        desc: 'does nothing',
        price: 5,
        effect: 'null',
        function: function storeBlank1(){
            console.log('did nothing');
        }
    },
    {
        title: 'Stapler Sale',
        desc: 'AutoStaplers on Sale!',
        price: 50,
        effect: 'autoSmallIncrease(10)',
        function: function storeBlank2(){
            console.log('gained 10 small staplers');
        }
    }
]
let storeOperator = 0
function storeCheck(){
    if(stapleCount >= 10 && storeOperator == 0){
        writeStore(0)
        storeOperator++
        return
    }else if(stapleCount >= 12 && storeOperator == 1){
        writeStore(1)
        storeOperator++
        return
    }else if (stapleCount >= 500 && storeOperator == 2) {
        writeStore(2)
        storeOperator++
        return
    }else{
        return
    }
}
function writeStore(number){
    let array = storeItemArray[number]
    let template = `
    <div class="d-flex flex-row one-off-upgrade" id="oneOff${number}" onclick="executeOneOff(${number},${array.price}),  ${array.effect}">
        <h5>${array.title}</h5>
        <p>${array.desc}</p>
        <p>$${array.price}</p>
    </div>`
    document.getElementById('oneOffUpgradesHTM').innerHTML += template
}
function executeOneOff(number,price){
    if(price>money){
        return
    }

    let ident = 'oneOff' + number
    let element = document.getElementById(ident)
    element.parentNode.removeChild(element);

    money -= storeItemArray[number].price
    writeMoney()
    storeItemArray[number].function();
}


// This is the companion function to turn on auto wire
function autoWireCheck(){
    if (wire>0){
        return
    }else{
        increaseWireLength()
    }
}

// These are used to track the production speed of
// both money and staples
let incomeTrackInterval = setInterval(incomeTrack, 1000)

let moneyTrack1 = 0
let moneyTrack2 = 0
let stapleTrack1 = 0
let stapleTrack2 = 0

function incomeTrack(){
    moneyTrack2 = money
    stapleTrack2 = stapleCount

    let moneyDiff = moneyTrack2 - moneyTrack1
    let staplesDiff = stapleTrack2 - stapleTrack1
    
    document.getElementById('incomeMoneyHTM').innerText = Math.floor(moneyDiff*100)/100 
    document.getElementById('incomeStaplesHTM').innerText = staplesDiff
    
    moneyTrack1 = money
    stapleTrack1 = stapleCount
}



writeMarket()
writeStapleCount()
writeMoney()