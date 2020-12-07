# crushtw.github.io
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tetris</title>
    <style>
        * {
            padding: 0;
            margin: 0;
            /*给火狐浏览器使用，避免不兼容*/
            -moz-box-sizing: border-box;
            /* 给webkit内核浏览器，避免不兼容*/
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }

        html {
            font-size: 25px;
        }

        a,
        a:hover,
        a:active,
        a:visited {
            text-decoration: none;
            color: #222222;
        }

        .container {
            width: 700px;
            height: 620px;
            margin: 50px auto;
            display: flex;
        }

        .box {
            width: 402px;
            height: 602px;
            border: 1px black solid;
            position: relative;
            overflow: hidden;
        }

        .block {
            width: 1rem;
            height: 1rem;
            border: 1px black solid;
        }

        .block-arr {
            width: 1rem;
            height: 1rem;
            z-index: -1;
            border: 1px black solid;
            position: absolute;
        }

        .type-1 {
            display: flex;
            height: 1rem;
            width: 4rem;
            position: absolute;
        }

        .type-2 {
            display: flex;
            flex-direction: column;
            height: 2rem;
            width: 3rem;
            position: absolute;
        }

        .type-2-1 {
            margin: 0 auto;
        }

        .type-2-2 {
            display: flex;
            height: 1rem;
        }

        .type-3 {
            display: flex;
            width: 2rem;
            height: 2rem;
            flex-flow: wrap;
            position: absolute;
        }

        .type-4 {
            display: flex;
            width: 2rem;
            height: 3rem;
            position: absolute;
        }

        .type-4-1 {
            display: flex;
            flex-direction: column;
        }

        .type-4-2 {
            display: flex;
            flex-direction: column-reverse;
        }

        .type-5 {
            display: flex;
            flex-direction: column;
            width: 3rem;
            height: 2rem;
            position: absolute;
        }

        .type-5-1 {
            display: flex;
            flex-direction: row;
        }

        .type-5-2 {
            display: flex;
            flex-direction: row-reverse;
        }

        .type-6 {
            display: flex;
            flex-direction: column;
            width: 2rem;
            height: 2rem;
            position: absolute;
        }

        .type-6-1 {
            display: flex;
            flex-direction: row;
        }

        .start {
            width: 4rem;
            height: 2rem;
            border: 1px grey solid;
            border-radius: 5px;
            line-height: 2rem;
            text-align: center;
            box-shadow: 1px 1px 3px 1px grey;
        }

        .start:hover {
            cursor: pointer;
        }

        .popUp {
            height: 14rem;
            width: 12rem;
            border: 1px grey solid;
            border-radius: 5px;
            margin: 4rem auto 6rem;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            background: white;
        }

        .over {
            font-size: 1.6rem;
            font-weight: 600;
        }

        .score {
            font-size: 1.2rem
        }

        .highest {
            font-size: 0.8rem
        }

        .restart {
            width: 4rem;
            height: 2.5rem;
            border: 1px grey solid;
            border-radius: 5px;
            line-height: 2.5rem;
            text-align: center;
        }

        .restart:hover {
            cursor: pointer;
        }

        .color {
            border: 1px black solid;
            border-radius: 5px;
            width: 4rem;
            height: 2rem;
            font-size: 0.8rem;
            margin: 0.2rem 0.25rem;
            line-height: 2rem;
        }

        .color:hover {
            cursor: pointer
        }

        ul {
            width: 9rem;
            display: flex;
            flex-flow: wrap;
            list-style: none;
            text-align: center;
        }

        .tool {
            width: 202px;
            height: 602px;
            border: 1px black solid;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
        }

        .next-pattern-box {
            margin-bottom: 5rem;
        }

        .pre-pattern {
            margin: 0 auto;
            width: 4rem;
            height: 4rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <div id="main_area" class="box">
            <div id="start_popUp" class="popUp">
                <p>请选择颜色</p>
                <ul onclick="getColor(event)">
                    <li class="color" style="border-color:green;background:#7bc9b0;">green</li>
                    <li class="color" style="border-color:pink">pink</li>
                    <li class="color" style="border-color:yellow">yellow</li>
                    <li class="color" style="border-color:red">red</li>
                    <li class="color" style="border-color:rgb(57, 6, 151)">purple</li>
                    <li class="color" style="border-color:blue">blue</li>
                </ul>
                <p id="start" class="start" onclick="clickToStart()">start</p>
            </div>
            <div id="end_popUp" class="popUp" style="display:none">
                <p class="over">Game over</p>
                <p class="score">score：<span id="last_score"> </span></p>
                <p class="highest">Highest score：<span id="highest_score"></span></p>
                <a href="" class="restart">restart</a>
            </div>
        </div>
        <div id="tools" class="tool">
            <p class="score">Score:<span id="cur_score"> 0</span></p>
            <div class="next-pattern-box">
                <p>next pattern</p>
                <div class="pre-pattern" id="pre_pattern">

                </div>
            </div>
        </div>
    </div>
    <script>
        let btn = document.getElementById("btn");
        let main_area = document.getElementById("main_area");
        let end_popUp = document.getElementById("end_popUp");
        let start_popUp = document.getElementById("start_popUp");
        let cur_score = document.getElementById("cur_score");
        let last_score = document.getElementById("last_score");
        let highest_score = document.getElementById("highest_score");
        let pre_pattern = document.getElementById("pre_pattern");
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
        let all_color = {
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


        let arr = new Array;
        for (let i = 0; i < 24; i++) {
            arr[i] = new Array;
            for (let j = 0; j < 16; j++) {
                arr[i][j] = 0;
            }
        }
        // choose game color
        function getColor(ev) {
            color = ev.target.innerHTML;
            let backcolor = document.querySelectorAll("li");
            for (let item of backcolor) {
                item.style.background = "";
            }
            ev.target.style.background = all_color[color][3];
        }
        //got an array about ranNum and random color
        function getRandomColor(color) {
            let ranNum = Math.floor(Math.random() * 5 + 1);
            return [ranNum, all_color[color][ranNum]];
        }



        function newBlock1() {
            let new_block = document.createElement("div");
            new_block.className = "type type-1";
            new_block.isCurrent = true;
            new_block.state = 0;
            new_block.arr = [
                [1, 1, 1, 1]
            ];
            new_block.color = getRandomColor(color);
            new_block.boundary = getTypeCondition(new_block.arr);
            new_block.innerHTML = `<div class="block"></div><div class="block"></div><div class="block"></div><div class="block"></div>`;
            return new_block
        }

        function newBlock2() {
            let new_block = document.createElement("div");
            new_block.className = "type type-2";
            new_block.isCurrent = true;
            new_block.state = 0;
            new_block.arr = [
                [0, 1, 0],
                [1, 1, 1]
            ];
            new_block.color = getRandomColor(color);
            new_block.boundary = getTypeCondition(new_block.arr);
            new_block.innerHTML = `<div class="block type-2-1"></div><div class="type-2-2"><div class="block"></div><div class="block"></div><div class="block"></div></div>`;
            return new_block
        }

        function newBlock3() {
            let new_block = document.createElement("div");
            new_block.className = "type type-3";
            new_block.isCurrent = true;
            new_block.state = 0;
            new_block.arr = [
                [1, 1],
                [1, 1]
            ];
            new_block.color = getRandomColor(color);
            new_block.boundary = getTypeCondition(new_block.arr);
            new_block.innerHTML = `<div class="block"></div><div class="block"></div><div class="block"></div><div class="block"></div>`;
            return new_block
        }

        function newBlock4() {
            let new_block = document.createElement("div");
            new_block.className = "type type-4";
            new_block.isCurrent = true;
            new_block.state = 0;
            new_block.arr = [
                [1, 0],
                [1, 0],
                [1, 1]
            ];
            new_block.color = getRandomColor(color);
            new_block.boundary = getTypeCondition(new_block.arr);
            new_block.innerHTML = `<div class="type-4-1"><div class="block"></div><div class="block"></div><div class="block"></div></div><div class="type-4-2"><div class="block"></div></div>`;
            return new_block
        }

        function newBlock5() {
            let new_block = document.createElement("div");
            new_block.className = "type type-5";
            new_block.isCurrent = true;
            new_block.state = 0;
            new_block.arr = [
                [1, 1, 0],
                [0, 1, 1]
            ];
            new_block.color = getRandomColor(color);
            new_block.boundary = getTypeCondition(new_block.arr);
            new_block.innerHTML = `<div class="type-5-1"><div class="block"></div><div class="block"></div></div><div class="type-5-2"><div class="block"></div><div class="block"></div></div>`;
            return new_block
        }

        function newBlock6() {
            let new_block = document.createElement("div");
            new_block.className = "type type-6";
            new_block.isCurrent = true;
            new_block.state = 0;
            new_block.arr = [
                [1, 0],
                [1, 1]
            ];
            new_block.color = getRandomColor(color);
            new_block.boundary = getTypeCondition(new_block.arr);
            new_block.innerHTML = `<div class="block"></div><div class="type-6-1"><div class="block"></div><div class="block"></div></div>`;
            return new_block
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
                    if (j == 0 && arr[i][j] != 0) {
                        type_condition["left"][i] = [i, j];
                    } else if (arr[i][j] != 0 && arr[i][j - 1] == 0) {
                        type_condition["left"][i] = [i, j];
                    }
                }
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].length; j++) {
                    if (j == arr[i].length - 1 && arr[i][j] != 0) {
                        type_condition["right"][i] = [i, j];
                    } else if (arr[i][j] != 0 && arr[i][j + 1] == 0) {
                        type_condition["right"][i] = [i, j];
                    }
                }
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].length; j++) {
                    if (i == arr.length - 1 && arr[i][j] != 0) {
                        type_condition["bottom"][j] = [i, j];
                    } else if (arr[i][j] != 0 && arr[i + 1][j] == 0) {
                        type_condition["bottom"][j] = [i, j];
                    }
                }
            }
            //some type will lose middle block without top position while changing direction
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].length; j++) {
                    if (i == 0 && arr[i][j] != 0) {
                        type_condition["top"][j] = [i, j];
                    } else if (arr[i][j] != 0 && arr[i - 1][j] == 0) {
                        type_condition["top"][j] = [i, j];
                    }
                }
            }
            return type_condition;
        }

        function clickToStart() {
            start_popUp.style.display = "none";
            clearInterval(moveNewBlock);
            main_area.addEventListener("DOMNodeInserted", function () {
                blocks = main_area.querySelectorAll(".type");
                for (let item of blocks) {
                    if (item.isCurrent) {
                        moveNewBlock = setInterval(function () {
                            let cur_row = parseFloat(item.style.top);
                            let cur_col = parseFloat(item.style.left);
                            temporaryArr = [];
                            for (let pos in item.boundary["bottom"]) {
                                let row = item.boundary["bottom"][pos][0] + cur_row;
                                let col = item.boundary["bottom"][pos][1] + cur_col;
                                // fix “Z” type and "L" type after transpose two times("7" type) can't move at -2 row
                                row = row < -1 ? -1 : row;
                                if (row != arr.length - 1 && arr[row + 1][col] == 0) {
                                    temporaryArr.push(1); //moving
                                } else {
                                    temporaryArr.push(0); //stop moving
                                }
                            }
                            let isMove = temporaryArr.includes(0);
                            if (isMove) {
                                clearInterval(moveNewBlock);
                                item.isCurrent = false;
                                for (let direction in item.boundary) {
                                    for (let index in item.boundary[direction]) {
                                        let row = item.boundary[direction][index][0] + cur_row;
                                        let col = item.boundary[direction][index][1] + cur_col;
                                        row = row < 0 ? 0 : row;
                                        arr[row][col] = item.color[0];
                                    }
                                }
                                item.remove();
                                refreshBlock();
                                fullRemove();
                                // console.log(arr);
                                isOver();
                            } else {
                                item.style.top = parseFloat(item.style.top) + 1 + "rem";
                            }
                        }, 300)
                    }
                }
            })


            // 添加第一个block，触发listener
            addPreDom();
            addMainDom();


            //control block moving
            document.onkeydown = function (ev) {
                let isMove;
                for (let item of blocks) {
                    let cur_row = parseFloat(item.style.top);
                    let cur_col = parseFloat(item.style.left);
                    if (item.isCurrent) {
                        switch (ev.keyCode) {
                            case 37:
                                temporaryArr = [];
                                for (let pos in item.boundary["left"]) {
                                    let row = item.boundary["left"][pos][0] + cur_row;
                                    let col = item.boundary["left"][pos][1] + cur_col;
                                    // if row<0,can't get arr and error
                                    row = row < 0 ? 0 : row;
                                    if (col != 0 && arr[row][col - 1] == 0) {
                                        temporaryArr.push(1);
                                    } else {
                                        temporaryArr.push(0);
                                    }
                                }
                                isMove = !temporaryArr.includes(0);
                                if (isMove) {
                                    item.style.left = parseFloat(item.style.left) - 1 + "rem";
                                }
                                break;
                            case 39:
                                temporaryArr = [];
                                for (let pos in item.boundary["right"]) {
                                    let row = item.boundary["right"][pos][0] + cur_row;
                                    let col = item.boundary["right"][pos][1] + cur_col;
                                    row = row < 0 ? 0 : row;
                                    if (col != arr[0].length - 1 && arr[row][col + 1] == 0) {
                                        temporaryArr.push(1);
                                    } else {
                                        temporaryArr.push(0);
                                    }
                                }
                                isMove = !temporaryArr.includes(0);
                                if (isMove) {
                                    item.style.left = parseFloat(item.style.left) + 1 + "rem";
                                }
                                break;
                            case 40:
                                clearInterval(moveNewBlock);
                                let min_distance = 100;
                                for (let pos in item.boundary["bottom"]) {
                                    let row = item.boundary["bottom"][pos][0] + cur_row;
                                    let col = item.boundary["bottom"][pos][1] + cur_col;
                                    row = row < -1 ? -1 : row;
                                    for (let i = row + 1; i < arr.length; i++) {
                                        if (arr[i][col] != 0) {
                                            if (i - row - 1 < min_distance) {
                                                min_distance = i - row - 1;
                                            }
                                            break;
                                        }
                                    }
                                }
                                if (min_distance == 100) {
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
                                        row = row < 0 ? 0 : row;
                                        arr[row][col] = item.color[0];
                                    }
                                }
                                item.remove();
                                refreshBlock();
                                fullRemove();
                                // console.log(arr);
                                isOver();
                                break;
                            case 38:
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

                    }
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
                cb.style.background = pre.color[1];
            }
        }
        //  use arr to render blocks
        function refreshBlock() {
            let old_div = document.querySelectorAll(".block-arr");
            for (let del_div of old_div) {
                del_div.remove();
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].length; j++) {
                    if (arr[i][j] != 0) {
                        let div = document.createElement('div');
                        div.className = "block-arr";
                        main_area.prepend(div);
                        div.style.background = all_color[color][arr[i][j]];
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
                    //full row set 0
                    for (let j = 0; j < arr[i].length; j++) {
                        arr[i][j] = 0;
                    }
                    //reset arr 
                    for (let k = i; k > 0; k--) {
                        arr[k] = arr[k - 1];
                    }
                    arr[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    refreshBlock();
                }
            }
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
            for (let item in arr[0]) {
                if (arr[0][item] != 0) {
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
            }
            addMainDom();
        }
    </script>

</body>

</html>