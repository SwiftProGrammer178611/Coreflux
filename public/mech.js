import { createRoot } from "react-dom/client";
import Sidebar from "../Sidebar";

createRoot(document.getElementById('sidebar-root')).render(<Sidebar />)

var candies = ["CryoCoolant", "Plasma", "RepairNanites", "PowerCell", "ChassisScrap", "Purple"];
var board = [];
var rows = 9;
var cols = 9;
var score = 0;
var currentTile;
var otherTile; 
var powerCell = 0;
var cryoCoolant = 0;
var repairNanites = 0;
var chassisScrap = 0;

window.onload = function(){
    startGame();
    window.setInterval(function(){
        crushCandy();
        slideCandy();
        genCandy();
    }, 200);
    document.getElementById("powerCell").innerText = powerCell;
    document.getElementById("CryoCoolant").innerText = cryoCoolant;
    document.getElementById("RepairNanites").innerText = repairNanites;
}
function randomCandy(){
    return candies[Math.floor(Math.random() * candies.length)];
}

function setCandy(tile,candy){
    tile.dataset.candy = candy;
    tile.src = candy === "blank"? "./images/blank.png" : "./images/" + candy + ".png";
}
function getCandyType(tile){
    return tile.dataset.candy || "";
}

function startGame(){
    for(let r = 0; r < rows; r++){
        let row = [];
        for(let c = 0; c < cols; c++){
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            setCandy(tile,randomCandy());
            document.getElementById("board").append(tile);

            //drag functionality
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}
function dragStart(){
    currentTile = this;

}
function dragOver(e){
    e.preventDefault();
}
function dragEnter(e){
    e.preventDefault();
}
function dragLeave(){
    
}
function dragDrop(){
    otherTile = this;
}
function dragEnd(){
    if (currentTile.src.includes("blank") || otherTile.src.includes("blank")){
        return;
    }

    let currentCoords = currentTile.id.split("-"); 
     let r = parseInt(currentCoords[0]);
     let c = parseInt(currentCoords[1]);
    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);
    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;
    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2; 

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if(isAdjacent){
        const currentCandy = getCandyType(currentTile);
        const otherCandy = getCandyType(otherTile);
        setCandy(currentTile, otherCandy);
        setCandy(otherTile, currentCandy);

        let validMove = checkValid();
        if(!validMove){
            setCandy(currentTile, currentCandy);
            setCandy(otherTile, otherCandy);
        }
    }
}
function crushCandy(){
    crushThree();
}

function crushThree(){

    //check For power cell matches (special candy)
    for (let c=0; c<cols; c++){
        for (let r=0; r<rows-2; r++){
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            const type1 = getCandyType(candy1);
            const type2 = getCandyType(candy2);
            const type3 = getCandyType(candy3);
            if(type1 === type2 && type2 === type3 && type1 != "blank"){

            
           
                if(candy1.src.includes("PowerCell") && candy2.src.includes("PowerCell") && candy3.src.includes("PowerCell")){
                    //update mech's giant laser cannon charge bar
                    powerCell += 15;
                    document.getElementById("powerCell").innerText = powerCell;
                    console.log("PowerCell match found! Charge increased to: " + powerCell);
                }
                if(candy1.src.includes("CryoCoolant") && candy2.src.includes("CryoCoolant") && candy3.src.includes("CryoCoolant")){
                    //update mech's giant laser cannon charge bar
                    cryoCoolant += 15;
                    document.getElementById("CryoCoolant").innerText = cryoCoolant;
                    console.log("CryoCoolant match found! Charge increased to: " + cryoCoolant);
                }
                if(candy1.src.includes("RepairNanites") && candy2.src.includes("RepairNanites") && candy3.src.includes("RepairNanites")){
                    repairNanites += 100;
                    document.getElementById("RepairNanites").innerHTML = repairNanites;
                    console.log("Repair Nanites match found! Repair Nanites increased to: "+repairNanites);
                }
                if(candy1.src.includes("ChassisScrap") && candy2.src.includes("ChassisScrap") && candy3.src.includes("ChassisScrap")){
                    chassisScrap += 90;
                    document.getElementById("ChassisScrap").innerHTML = chassisScrap;
                }
                
                setCandy(candy1,"blank");
                setCandy(candy2,"blank");
                setCandy(candy3,"blank");
                score += 30;
                document.getElementById("score").innerText = score;
            }
    }}


    //check For power cell matches (special candy)
    for (let r=0; r<rows; r++){
        for(let c=0; c<cols-2; c++){
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            const type1 = getCandyType(candy1);
            const type2 = getCandyType(candy2);
            const type3 = getCandyType(candy3);
            if(type1 === type2 && type2 === type3 && type1 != "blank"){

                if(type1 === "PowerCell"){
                    //update mech's giant laser cannon charge bar
                    powerCell += 15;
                    document.getElementById("powerCell").innerText = powerCell;
                    console.log("PowerCell match found! Charge increased to: " + powerCell);
                }
                if(type1 === "CryoCoolant"){
                    //update mech's giant laser cannon charge bar
                    cryoCoolant += 15;
                    document.getElementById("CryoCoolant").innerText = cryoCoolant;
                    console.log("CryoCoolant match found! Charge increased to: " + cryoCoolant);
                }
                if(type1 === "RepairNanites"){
                    repairNanites += 100;
                    document.getElementById("RepairNanites").innerHTML = repairNanites;
                }
                setCandy(candy1,"blank");
                setCandy(candy2,"blank");
                setCandy(candy3,"blank");
                score += 30;
                document.getElementById("score").innerText = score;
            }
        }
    }


}

function checkValid(){
    //check rows
    for (let r=0; r<rows; r++){
        for(let c=0; c<cols-2; c++){
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            const type1 = getCandyType(candy1);
            const type2 = getCandyType(candy2);
            const type3 = getCandyType(candy3);

            if(type1 === type2 && type2 === type3 && type1 !== "blank"){
                return true;
            }
        }
    }
    //check cols
    for (let c=0; c<cols; c++){
        for (let r=0; r<rows-2; r++){
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            const type1 = getCandyType(candy1);
            const type2 = getCandyType(candy2);
            const type3 = getCandyType(candy3);

            if(type1 === type2 && type2 === type3 && type1 !== "blank"){
                return true
            }
    }}
    return false;
}

//sliding new candies down
function slideCandy(){
    for(let c=0; c<cols; c++){
        let ind = rows-1;
        for(let r=rows-1;r>=0;r--){
            if(getCandyType(board[r][c]) !== "blank"){
                if(r !== ind){
                    setCandy(board[ind][c], getCandyType(board[r][c]));
                    setCandy(board[r][c],"blank");
                }
                ind -= 1;
            }
        }
        
    }
}

function genCandy(){
    for (let c = 0; c<cols; c++){
        if(board[0][c].src.includes("blank")){
            setCandy(board[0][c],randomCandy());// another candy if blank after candies slide down...
        }
    }
}

//Core functionality of candies working. Now enhancements with special candies for the mech game. 