let stapleCount = 0
let staplePrice = 0

let money = 999999999999

let wire = 1000
let wireLength = 1000
let wirePrice = 1
let wireUpgradeLevel = 1
let wireUpgradePrice = 500

let autoWire = false

let autoStapleRate = 1000
let autoStapleSmall = 0
let autoStapleSmallMultiplier = 1
let autoStapleLarge = 0
let autoStapleLargeMultiplier = 500

let clickLevel = 1

let marketTrack = 1

const wirePriceArray = [
    {min:1,max:4, length: 1000},
    {min:2,max:12, length: 5000},
    {min:14,max:28, length: 15000},
    {min:50,max:100, length: 100000}
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
        wire+=wireLength
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
    let price = marketTrack ** 2

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
}
function writeMarket(){
    price = (marketTrack ** 2)**2

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




// These functions update the store periodically based on
// the number of staples you have produced
function storeCheck(){
    console.log('storecheck');
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
    autoStapleSmall += number
    writeAutoSmall()
}
function autoStapleGenSmall(){
    increaseStapleCount(autoStapleSmall*autoStapleSmallMultiplier)
}
function writeAutoSmall(){
    // TODO 
    console.log('writeAutoSmall()')
}

function autoLargeIncrease(number){
    // Starts the interval
    if(writeLargeStapleCountInterval == undefined){
        clearInterval(writeLargeStapleCountInterval)
        writeLargeStapleCountInterval = setInterval(autoStapleGenLarge, autoStapleRate)
        console.log('interval set');
    }
    autoStapleLarge += number
    writeAutoLarge()
}
function autoStapleGenLarge(){
    increaseStapleCount(autoStapleLarge*autoStapleLargeMultiplier)
}
function writeAutoLarge(){
    // TODO
    console.log('writeAutoLarge()')
    
}




// These are the functions for the click upgrades
function clickUpgrade(number){
    let clickPrice = (clickLevel*2)-1
    console.log(clickPrice);
    
    if(clickPrice>money){
        return
    }

    clickLevel+=number
    writeClickUpgrade(clickPrice)
}
function writeClickUpgrade(number){
    let clickElementUpgrade = `
    <div id="staplerHTM" class="col-12 stapler" onclick="increaseStapleCount(${clickLevel})">
        <div class="level">
            <h3>Level <span id="clickLevelHTM">${clickLevel}</span></h3>
        </div>
    </div>
    `

    money -= number
    writeMoney()
    document.getElementById('clickUpgradeLevelHTM').innerText = clickLevel
    document.getElementById('clickPriceHTM').innerText = number
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
function wireUpgrade(number){
    console.log('wireUpgrade ' + wireUpgradeLevel);
    if(wireUpgradePrice>money){
        return
    }
    money -= wireUpgradePrice
    wireUpgradePrice += 500
    if(wireUpgradeLevel<wirePriceArray.length){
        wireUpgradeLevel++
    }else{
        wireUpgradeLevel = wirePriceArray.length
    }
    drawWire()
}
function drawWire(){
    let array = wirePriceArray
    let price = Math.floor(Math.random()*(array[wireUpgradeLevel-1].max - array[wireUpgradeLevel-1].min) +1 +array[wireUpgradeLevel-1].min)
    wireLength = array[wireUpgradeLevel-1].length

    document.getElementById('wireUpgradeLevelHTM').innerText = wireUpgradeLevel
    document.getElementById('wireUpgradePriceHTM').innerText = wireUpgradePrice
    document.getElementById('wirePurchaseHTM').innerText = price
    document.getElementById('wirePurchaseLengthHTM').innerText = wireLength

    writeMoney()
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