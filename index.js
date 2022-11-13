let btn = document.getElementById("btn");
let main_area = document.getElementById("main_area");
let end_popUp = document.getElementById("end_popUp");
let start_popUp = document.getElementById("start_popUp");
let cur_score = document.getElementById("cur_score");
let last_score = document.getElementById("last_score");
let highest_score = document.getElementById("highest_score");
let pre_pattern = document.getElementById("pre_pattern");
let arrowleft = document.getElementById("arrowleft");
let arrowright = document.getElementById("arrowright");
let arrowup = document.getElementById("arrowup");
let arrowdown = document.getElementById("arrowdown");
let blocks;
let moveNewBlock;
let temporaryArr;
let score = 0;
let scoring_rules = {
    0: 0,
    1: 100,
    2: 300,
    3: 600,
    4: 1000
};
let allColor = {
    green: {
        1: "#3f8a87",
        2: "#2f6e59",
        3: "#7bc9b0",
        4: "#4eac84",
        5: "#83d77d",
        6: "#5c9943"
    },
    pink: {
        1: "rgb(254,156,171)",
        2: "rgb(255,128,153)",
        3: "rgb(255,110,143)",
        4: "rgb(214,93,138)",
        5: "rgb(213,119,169)",
        6: "rgb(255,167,218)"
    },
    yellow: {
        1: "#be7a3d",
        2: "#ba872e",
        3: "#deb040",
        4: "#f9d857",
        5: "#fce56f",
        6: "#fffe96"
    },
    purple: {
        1: "#905fa8",
        2: "#a478df",
        3: "#ad97f0",
        4: "#935bd4",
        5: "#bd96eb",
        6: "#9477f6"
    },
    red: {
        1: "#7d2b2a",
        2: "#741516",
        3: "#923645",
        4: "#c3413b",
        5: "#d25453",
        6: "#ed7172"
    },
    blue: {
        1: "#184892",
        2: "#5299f4",
        3: "#2a6bd8",
        4: "#6ac3fa",
        5: "#5299f4",
        6: "#73fbfd"
    }
}
let color = "green";

let arrRow = (new Array(16)).fill(0);
let arr = (new Array(24)).fill(0).map(_ => [...arrRow]);

// choose game color
function getColor(ev) {
    color = ev.target.innerHTML;
    if (!Object.keys(allColor).includes(color)) return;
    let backcolor = document.querySelectorAll("li");
    for (let item of backcolor) {
        item.style.background = "";
    }
    ev.target.style.background = allColor[color][3];
}

function getRandomColor(color) {
    let ranNum = Math.floor(Math.random() * 5 + 1);
    return allColor[color][ranNum];
}

function createBlock (props) {
    let new_block = document.createElement("div");
    new_block.className = `type ${props.className}`;
    new_block.state = 0;
    new_block.arr = props.arr;
    new_block.color = getRandomColor(color);
    new_block.boundary = getTypeCondition(props.arr);
    new_block.innerHTML = props.innerHTML
    return new_block;
}

function newBlock1() {
    const className = "type-1";
    const arr = [
        [1, 1, 1, 1]
    ];
    const innerHTML = `<div class="block"></div><div class="block"></div><div class="block"></div><div class="block"></div>`;
    return createBlock({className, arr, innerHTML});
}

function newBlock2() {
    const className = "type-2";
    const arr = [
        [0, 1, 0],
        [1, 1, 1]
    ];
    const innerHTML = `<div class="block type-2-1"></div><div class="type-2-2"><div class="block"></div><div class="block"></div><div class="block"></div></div>`;
    return createBlock({className, arr, innerHTML});
}

function newBlock3() {
    const className = "type-3";
    const arr = [
        [1, 1],
        [1, 1]
    ];
    const innerHTML = `<div class="block"></div><div class="block"></div><div class="block"></div><div class="block"></div>`;
    return createBlock({className, arr, innerHTML});
}

function newBlock4() {
    const className = "type-4";
    const arr = [
        [1, 0],
        [1, 0],
        [1, 1]
    ];
    const innerHTML = `<div class="type-4-1"><div class="block"></div><div class="block"></div><div class="block"></div></div><div class="type-4-2"><div class="block"></div></div>`;
    return createBlock({className, arr, innerHTML});
}

function newBlock5() {
    const className = "type-5";
    const arr = [
        [1, 1, 0],
        [0, 1, 1]
    ];
    const innerHTML = `<div class="type-5-1"><div class="block"></div><div class="block"></div></div><div class="type-5-2"><div class="block"></div><div class="block"></div></div>`;
    return createBlock({className, arr, innerHTML});
}

function newBlock6() {
    const className = "type-6";
    const arr = [
        [1, 0],
        [1, 1]
    ];
    const innerHTML = `<div class="block"></div><div class="type-6-1"><div class="block"></div><div class="block"></div></div>`;
    return createBlock({className, arr, innerHTML});
}

function getTypeCondition(arr) {
    let type_condition = {
        left: {},
        right: {},
        bottom: {},
        top: {}
    };

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] !== 0) {
                if (j === 0 || arr[i][j - 1] === 0) {
                    type_condition["left"][i] = [i, j];
                }
                if (j === arr[i].length - 1 || arr[i][j + 1] === 0) {
                    type_condition["right"][i] = [i, j];
                }
                if (i === arr.length - 1 || arr[i + 1][j] === 0) {
                    type_condition["bottom"][j] = [i, j];
                }
                if (i === 0 || arr[i - 1][j] === 0) {
                    type_condition["top"][j] = [i, j];
                }
            }
        }
    }
    return type_condition;
}

function clickToStart() {
    start_popUp.style.display = "none";
    clearInterval(moveNewBlock);
    main_area.addEventListener("DOMNodeInserted", function() {
        blocks = main_area.querySelectorAll(".type");
        for (let item of blocks) {
            moveNewBlock = setInterval(function() {
                let cur_row = parseFloat(item.style.top);
                let cur_col = parseFloat(item.style.left);
                temporaryArr = [];
                for (let pos in item.boundary["bottom"]) {
                    let row = item.boundary["bottom"][pos][0] + cur_row;
                    let col = item.boundary["bottom"][pos][1] + cur_col;
                    row = row < -1 ? -1 : row;
                    if (row !== arr.length - 1 && arr[row + 1][col] === 0) {
                        temporaryArr.push(1); //moving
                    } else {
                        temporaryArr.push(0); //stop moving
                    }
                }
                let isStop = temporaryArr.includes(0);
                if (isStop) {
                    clearInterval(moveNewBlock);
                    for (let direction in item.boundary) {
                        for (let index in item.boundary[direction]) {
                            let row = item.boundary[direction][index][0] + cur_row;
                            let col = item.boundary[direction][index][1] + cur_col;
                            row = row < 0 ? 0 : row;
                            arr[row][col] = item.color;
                        }
                    }
                    item.remove();
                    fullRemove();
                    isOver();
                } else {
                    item.style.top = parseFloat(item.style.top) + 1 + "rem";
                }
            }, 300)
        }
    })

    // 添加第一个block，触发listener
    addPreDom();
    addMainDom();

    //PC control block moving
    document.onkeydown = function(ev) {
        for (let item of blocks) {
            let cur_row = parseFloat(item.style.top);
            let cur_col = parseFloat(item.style.left);
            switch (ev.keyCode) {
                case 37:
                    leftArrow(item, cur_row, cur_col);
                    break;
                case 39:
                    rightArrow(item, cur_row, cur_col);
                    break;
                case 40:
                    downArrow(item, cur_row, cur_col);
                    break;
                case 38:
                    upArrow(item, cur_row, cur_col);
            }
        }
    }
    //mobile control block moving
    arrowleft.addEventListener("touchstart", function() {
        for (let item of blocks) {
            let cur_row = parseFloat(item.style.top);
            let cur_col = parseFloat(item.style.left);
            leftArrow(item, cur_row, cur_col);
        }
    })
    arrowright.addEventListener("touchstart", function() {
        for (let item of blocks) {
            let cur_row = parseFloat(item.style.top);
            let cur_col = parseFloat(item.style.left);
            rightArrow(item, cur_row, cur_col);
        }

    })
    arrowdown.addEventListener("touchstart", function() {
        for (let item of blocks) {
            let cur_row = parseFloat(item.style.top);
            let cur_col = parseFloat(item.style.left);
            downArrow(item, cur_row, cur_col);
        }
    })
    arrowup.addEventListener("touchstart", function() {
        for (let item of blocks) {
            let cur_row = parseFloat(item.style.top);
            let cur_col = parseFloat(item.style.left);
            upArrow(item, cur_row, cur_col);
        }
    })
}

//function move to left 
function leftArrow(item, cur_row, cur_col) {
    temporaryArr = [];
    for (let pos in item.boundary["left"]) {
        let row = item.boundary["left"][pos][0] + cur_row;
        let col = item.boundary["left"][pos][1] + cur_col;
        // if row<0,can't get arr and error
        row = row < 0 ? 0 : row;
        if (col !== 0 && arr[row][col - 1] === 0) {
            temporaryArr.push(1);
        } else {
            temporaryArr.push(0);
        }
    }
    let isMove = !temporaryArr.includes(0);
    if (isMove) {
        item.style.left = parseFloat(item.style.left) - 1 + "rem";
    }
}
// function move to right
function rightArrow(item, cur_row, cur_col) {
    temporaryArr = [];
    for (let pos in item.boundary["right"]) {
        let row = item.boundary["right"][pos][0] + cur_row;
        let col = item.boundary["right"][pos][1] + cur_col;
        row = row < 0 ? 0 : row;
        if (col !== arr[0].length - 1 && arr[row][col + 1] === 0) {
            temporaryArr.push(1);
        } else {
            temporaryArr.push(0);
        }
    }
    let isMove = !temporaryArr.includes(0);
    if (isMove) {
        item.style.left = parseFloat(item.style.left) + 1 + "rem";
    }
}
// function move to down
function downArrow(item, cur_row, cur_col) {
    clearInterval(moveNewBlock);
    // block 向下移动的最小距离
    let min_distance = 100;
    for (let pos in item.boundary["bottom"]) {
        let row = item.boundary["bottom"][pos][0] + cur_row;
        let col = item.boundary["bottom"][pos][1] + cur_col;
        const amendRowDif = item.arr.length;
        for (let i = row + amendRowDif; i < arr.length; i++) {
            if (arr[i][col] !== 0) {
                if (i - row - 1 < min_distance) {
                    min_distance = i - row - 1;
                }
                break;
            }
        }
    }
    if (min_distance === 100) {
        item.style.top = arr.length - item.arr.length + "rem";
    } else {
        item.style.top = min_distance + parseFloat(item.style.top) + "rem";
    }
    cur_row = parseFloat(item.style.top);
    cur_col = parseFloat(item.style.left);
    for (let direction in item.boundary) {
        for (let index in item.boundary[direction]) {
            let row = item.boundary[direction][index][0] + cur_row;
            let col = item.boundary[direction][index][1] + cur_col;
            if (row >= 0) {
                arr[row][col] = item.color;
            }
        }
    }
    item.remove();
    refreshBlock();
    fullRemove();
    isOver();
}
// function change direction
function upArrow(item, cur_row, cur_col) {
    let judge_arr = transpose(item.arr);
    let judge_boundary = getTypeCondition(judge_arr);
    let isFarthest = cur_col + judge_arr[0].length <= 16;
    let isHasBlocksArr = [];
    for (let direction in judge_boundary) {
        for (let block_site in judge_boundary[direction]) {
            let row = judge_boundary[direction][block_site][0] + cur_row;
            let col = judge_boundary[direction][block_site][1] + cur_col;
            row = row < 0 ? 0 : row;
            if (arr[row][col] == 0) { //moving
                isHasBlocksArr.push(0);
            } else { //no moving
                isHasBlocksArr.push[1];
                return;
            }
        }
    }
    let isHasBlocks = !isHasBlocksArr.includes(1);
    if (isFarthest & isHasBlocks) {
        switch (item.state) {
            case 0:
                item.style.transformOrigin = "0 0";
                item.style.transform = "rotate(90deg) translate(0,-100%)";
                item.arr = judge_arr;
                item.boundary = getTypeCondition(item.arr);
                item.state = 1;
                break;
            case 1:
                item.style.transformOrigin = "0 0";
                item.style.transform = "rotate(180deg) translate(-100%,-100%)";
                item.arr = judge_arr;
                item.boundary = getTypeCondition(item.arr);
                item.state = 2;
                break;
            case 2:
                item.style.transformOrigin = "0 0";
                item.style.transform = "rotate(270deg) translate(-100%,0)";
                item.arr = judge_arr;
                item.boundary = getTypeCondition(item.arr);
                item.state = 3;
                break;
            case 3:
                item.style.transform = "none";
                item.arr = judge_arr;
                item.boundary = getTypeCondition(item.arr);
                item.state = 0;
                break;
        }

    }
}

function addPreDom() {
    let pre_block = eval("newBlock" + Math.floor(Math.random() * 6 + 1) + "()");
    pre_pattern.prepend(pre_block);
    setPrecolor(pre_block);
}

function addMainDom() {
    let addblock = pre_pattern.querySelector(".type");
    let random_pos = Math.floor(Math.random() * 13);
    let top_distance = -addblock.arr.length;
    main_area.prepend(addblock);
    addblock.setAttribute("style", "top:" + top_distance + "rem;left:" + random_pos + "rem;");
    if (pre_pattern.querySelector(".type")) {
        pre_pattern.querySelector(".type").remove();
    }
    addPreDom();
}

//set pre color
function setPrecolor(pre) {
    let color_blocks = pre_pattern.querySelectorAll(".block");
    for (let cb of color_blocks) {
        cb.style.background = pre.color;
    }
}
//  use arr to render blocks
function refreshBlock() {
    let old_div = document.querySelectorAll(".block-arr");
    for (let old of old_div) {
        old.remove();
    }
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] !== 0) {
                let div = document.createElement('div');
                div.className = "block-arr";
                main_area.prepend(div);
                div.style.background = arr[i][j];
                div.style.top = i + "rem";
                div.style.left = j + "rem";
            }
        }
    }
}
//if full row ,remove and calculate score
function fullRemove() {
    let time = 0;
    for (let i = 1; i < arr.length; i++) {
        if (!arr[i].includes(0)) {
            time++; //判断一次消除了几行
            //reset arr 
            for (let k = i; k > 0; k--) {
                arr[k] = arr[k - 1];
            }
            arr[0] = (new Array(16)).fill(0);
        }
    }
    refreshBlock();
    if (time > 0) {
        score = score + scoring_rules[time];
        cur_score.innerHTML = score;
    }
}

//transpose arr
function transpose(origin_arr) {
    let new_arr = new Array;
    for (let i = 0; i < origin_arr[0].length; i++) {
        new_arr[i] = new Array;
        for (let j = 0; j < origin_arr.length; j++) {
            new_arr[i][j] = origin_arr[origin_arr.length - 1 - j][i];
        }
    }
    return new_arr;
}

// judge over
function isOver() {
    if (arr[0].find(item => item !== 0)) {
        clearInterval(moveNewBlock);
        last_score.innerHTML = score;
        end_popUp.style.display = "flex";
        if (!localStorage.gameHightestScore) {
            localStorage.gameHightestScore = 0;
        }
        if (localStorage.gameHightestScore < score) {
            localStorage.setItem("gameHightestScore", score);
        }
        highest_score.innerHTML = localStorage.gameHightestScore;
        return;
    }
    addMainDom();
}