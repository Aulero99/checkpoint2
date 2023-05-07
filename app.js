let stapleCount = 0
let unsoldStapleCount = 0
let staplePrice = 1

let stapleDemand = 100
let stapleDemandMultiplier = 1
let stapleDemandOperator = 1


const storeItems = [
    {
        name:'Auto Stapler',
        cost: 10,
        
    }
]

// These functions take in how many staples to add to the tracker
// then writes those changes both to the total staple count
// as well as the unsold staple count
function increaseStapleCount(number){
    stapleCount += number
    unsoldStapleCount += number
    writeUnsoldStapleCount(number)
    writeStapleCount()
    storeCheck()
}

function writeStapleCount(){
    document.getElementById('stapleCountHTM').innerText=stapleCount
}

function writeUnsoldStapleCount(){
    document.getElementById('unsoldStapleCountHTM').innerText=unsoldStapleCount
}


// These functions take in an argument for how much to change the
// price of staples by, then writes the price of the staples tracked
// by the staplePrice variable which is globally defined
// then calls the function writeStapleDemand() to calculate
// current demand
function priceChange(number){
    staplePrice += number
    if(staplePrice < 1){
        staplePrice = 1
    }else if(staplePrice > 100){
        staplePrice = 100
    }else{
        writeStaplePrice()
        calculateStapleDemand()
    }
}

function writeStaplePrice(){
    let number = ''
    if(staplePrice >= 100){
        number = '$1.00'
    }else{
        if(staplePrice == 10){
            number = '$0.10'
        }else if(staplePrice == 20){
            number = '$0.20'
        }else if(staplePrice == 30){
            number = '$0.30'
        }else if(staplePrice == 40){
            number = '$0.40'
        }else if(staplePrice == 50){
            number = '$0.50'
        }else if(staplePrice == 60){
            number = '$0.60'
        }else if(staplePrice == 70){
            number = '$0.70'
        }else if(staplePrice == 80){
            number = '$0.80'
        }else if(staplePrice == 90){
            number = '$0.90'
        }else{
            number = '$' + (staplePrice/100)
        }
    }
    document.getElementById('staplePriceHTM').innerText=number
}


// These functions calculate the current demand for staples then
// sets that result to the stapleDemand variable, then
// calls the write function with a result that multiplies
// the demand with the current multiplier
// while also using the operator to influence the demand in an
// organic way
function calculateStapleDemand(){
    stapleDemand = 100
    stapleDemand -= Math.floor(100-(100 *(stapleDemandOperator/staplePrice)))
    if (stapleDemand <= 1){
        stapleDemand = 1
    }
    result = stapleDemand * stapleDemandMultiplier
    writeStapleDemand(result)
}

function writeStapleDemand(number){
    document.getElementById('stapleDemandHTM').innerText = number + '%'
}

// These functions update the store periodically based on
// the number of staples you have produced
function