let score;
let nums;
let previous_score;
let ns;
let free;
let undone;
let x;
let y;
let leaders_n = [];
let leaders_s = [];
let leaders_d = [];
let moves = [];
let boxes = [];
let traces = [];
let traces_users = [];
let back_traces = [];
let news = [];

const container = document.getElementById("container");

const modal_element = document.createElement("dialog");
modal_element.id = "modal";
modal_element.classList.add("game_end");
modal_element.classList.add("no-select");
container.appendChild(modal_element);

const modal_restart = document.createElement("button");
const modal_approve = document.createElement("button");
const modal_input = document.createElement("input");
const modal_paragraph = document.createElement("p");

const playground = document.createElement("div");
playground.classList.add("playground")
playground.classList.add("no-select");
playground.id = "playground";
container.appendChild(playground);

const score_bar = document.getElementById("score_block");
const score_name = document.createElement("p");
const score_amount = document.createElement("p");

const restart = document.createElement("button");
const undo = document.createElement("button");

const leaderboard = document.getElementById("leaderboard");
const leaderboard_button = document.createElement("button");

const pos = 70;

function initiateVariables(){
    score = 0;
    previous_score = 0;
    nums = [0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0];
    clearBoxes();
    ns = 0;
    free = true;
    undone = true;
    modal_input.value = "";
    x = 0;
    y = 0;
}

function initiateLeaderboard(){
    leaderboard_button.classList.add("leaderboard_button")
    leaderboard_button.classList.add("no-select");
    leaderboard_button.id = "leaderboard_button";
    leaderboard_button.textContent = "Таблица лидеров";

    container.appendChild(leaderboard_button);

    leaderboard_button.addEventListener("click", () => {
        leaderboard.showModal();
    })

    const leaderboard_h = document.createElement("h1");
    leaderboard_h.classList.add("leaderboard_h")
    leaderboard_h.classList.add("no-select");
    leaderboard_h.id = "leaderboard_h";
    leaderboard_h.textContent = "Таблица лидеров";

    leaderboard.appendChild(leaderboard_h);

    const close_leaderboard = document.createElement("button");
    close_leaderboard.classList.add("close_leaderboard")
    close_leaderboard.classList.add("no-select");
    close_leaderboard.id = "close_leaderboard";
    close_leaderboard.textContent = "X";

    close_leaderboard.addEventListener("click", () => {
        leaderboard.close();
    })

    leaderboard.appendChild(close_leaderboard);
}

function makeLeaderboard(){
    if (leaderboard.childNodes.length == 3){
        leaderboard.removeChild(leaderboard.childNodes[2]);
    }
    if (leaders_n.length == 0){
        return;
    }
    const leadertable = document.createElement("table");
    let tr = leadertable.insertRow();
    tr.insertCell().appendChild(document.createTextNode(`Имя`));
    tr.insertCell().appendChild(document.createTextNode(`Счёт`));
    tr.insertCell().appendChild(document.createTextNode(`Дата`));

    for (let index = 0; index < leaders_n.length; index++){
        tr = leadertable.insertRow();
        
        tr.insertCell().appendChild(document.createTextNode(`${leaders_n[index]}`));
        tr.insertCell().appendChild(document.createTextNode(`${leaders_s[index]}`));
        tr.insertCell().appendChild(document.createTextNode(`${leaders_d[index]}`));
    }

    leaderboard.appendChild(leadertable);
}

function initiateScore(){
    score_name.classList.add("score_name");
    score_name.textContent = "Счёт";
    score_bar.appendChild(score_name);

    score_amount.classList.add("current_score");
    score_amount.textContent = score;
    score_bar.appendChild(score_amount);
}

function initiateCells(){
    for (let index = 0; index < 16; index++){
        box = document.createElement("div");
        box.classList.add("num_box");
        box.classList.add("no-select");
        playground.appendChild(box);
    }
}

function initiateDialog(){
    updateDialog();

    modal_element.appendChild(modal_paragraph);
    modal_element.appendChild(modal_input);
    modal_element.appendChild(modal_approve);
    modal_element.appendChild(modal_restart);
}

function updateRestart(){
    modal_restart.classList.add("no-select");
    modal_restart.classList.add("modal_restart");
    modal_restart.id = "modal_restart";
    modal_restart.textContent = "Начать заново";

    modal_restart.addEventListener("click", () => {
        modal_input.classList.remove("ch");
        modal_input.style.display = "";
        modal_approve.style.display = "";
        initiate();
        saveGame(false);
        modal_element.close();
    })
}

function updateApprove(){
    modal_approve.classList.add("no-select");
    modal_approve.classList.add("modal_approve");
    modal_approve.id = "modal_approve";
    modal_approve.textContent = "Сохранить результат";

    modal_approve.addEventListener("click", () => {
        if (modal_input.value != ""){
            addLeader(modal_input.value, score);
            saveLeaders();

            modal_paragraph.textContent = "Игра окончена.\r\n";
            modal_paragraph.textContent += "Результат сохранён.";
            modal_input.style.display = "none";
            modal_approve.style.display = "none";
            modal_input.value = ""
        } else {
            modal_input.classList.add("ch");
        }
    })
}

function updateInput(){
    modal_input.classList.add("no-select");
    modal_input.classList.add("modal_input");
    modal_input.id = "modal_input";
    modal_input.placeholder = "Введите имя";
    modal_input.value = "";

    modal_input.addEventListener('keydown', () => {
        modal_input.classList.remove("ch");
    })

    modal_input.addEventListener("beforeinput", (event) => {
        if (event.data != null){
            if (/\\/.test(event.data)){ 
                event.preventDefault();
            }
        }
    });
}

function updateParagraph(){
    modal_paragraph.classList.add("no-select");
    modal_paragraph.classList.add("modal_paragraph");
    modal_paragraph.id = "modal_paragraph";
    modal_paragraph.textContent = "Игра окончена.\r\n";
    modal_paragraph.textContent += "Сохранить результат в таблицу?";
}

function updateDialog(){
    updateRestart();

    updateApprove();

    updateInput();

    updateParagraph();
}

function saveGame(settings=true){
    let line = "t3-";
    if (settings){
        for (let index = 0; index < boxes.length; index++){
            line += `${boxes[index] != null ? Math.log2(Number(boxes[index].textContent)) : 0}`;
            if (index < boxes.length - 1){ line += " "; }
        }
        line += `-${score}-${previous_score}-`;
        for (let index = 0; index < back_traces.length; index++){
            line += `${back_traces[index][0]} ${back_traces[index][1] != -1 ? back_traces[index][1] : "_"} ${back_traces[index][2]} ${back_traces[index][3]}`;
            if (index < back_traces.length - 1){ line += " "; }
        }
        line += "-";
        for (let index = 0; index < news.length; index++){
            line += `${news[index][0]} ${news[index][1]}`;
            if (index < news.length - 1){ line += " "; }
        }
    } else { 
        for (let index = 0; index < 15; index++){
            line += "0 ";
        }
        line += "0-0-0--";
    }

    try{
        localStorage.setItem("0", `${line}`);
    } catch {
        return;
    }
}

function saveLeaders(){
    let line = "t3-";
    for (let index = 0; index < leaders_s.length - 1; index++){
        line += `${leaders_n[index]} ${leaders_s[index]} ${leaders_d[index]}\\`;
    }
    if (leaders_s.length > 0){
        line += `${leaders_n[leaders_s.length - 1]} ${leaders_s[leaders_s.length - 1]} ${leaders_d[leaders_s.length - 1]}`;
    }

    try{
        localStorage.setItem("1", `${line}`);
    } catch {
        return;
    }
}

function loadGame(){
    try{
        let line;
        let s_line;
        let t_line;
        let zeros = true;
        let same = true;

        line = localStorage.getItem("0").split("-");
        if (line[0] != "t3") {initiate(); return;}
        line = line.slice(1);

        score = Number(line[1]);
        score_amount.textContent = score;
        previous_score = Number(line[2]);
        s_line = line[3].split(" ");
        t_line = line[4].split(" ");
        line = line[0].split(" ");
        news = [];
        back_traces = [];

        for (let index = 0; index < line.length; index++){
            nums[index] = line[index] != "0" ? Math.pow(2, Number(line[index])) : 0;
            if (line[index] != "0"){ 
                news.push([index, Math.pow(2, Number(line[index]))]);
                zeros = false; }
        }

        addCells();
        news = [];

        if (s_line != "") {
            for (let index = 0; index < s_line.length; index+=4){
                back_traces.push([Number(s_line[index]), Number(s_line[index + 1] != "_" ? s_line[index + 1] : "-1"),
                                  Number(s_line[index + 2]), Number(s_line[index + 3])]);
                if (back_traces[back_traces.length - 1][1] == -1) { same = false; }
            }
        }

        if (t_line != "") {
            for (let index = 0; index < t_line.length; index+=2){
                news.push([Number(t_line[index]), Number(t_line[index + 1])]);
            }
        } 

        if (same) { undone = false; }
        if (zeros) { initiate(); }
    } catch {
        return;
    }    
}

function loadLeaders(){
    try{
        let lines = "";
        lines = localStorage.getItem("1");
        if (lines == "") {return;}
        if (lines.slice(0, 2) != "t3") {return;}
        lines = lines.slice(2);
        lines.split("\\").forEach(line => {
            const leads = line.split(" ");
            let name = "";
            for (let index = 0; index < (leads.length - 3); index++){name += `${leads[index]} `;}
            name += leads[leads.length - 3]
            leaders_n.push(name);
            leaders_s.push(Number(leads[leads.length - 2]));
            leaders_d.push(leads[leads.length - 1]);
        });
    } catch {
        return;
    }
}

function addLeader(name, up_score){
    let leader_changed = false;
    for (let index = 0; index < leaders_s.length; index++){
        if (leaders_s[index] < up_score){
            leader_changed = true;
            let currentDate = new Date();
            leaders_s.splice(index, 0, up_score);
            leaders_n.splice(index, 0, name);
            leaders_d.splice(index, 0, `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`);
            break;
        }
    }

    if (leaders_s.length < 10 & !leader_changed) {
        let currentDate = new Date();
        leaders_s.push(up_score);
        leaders_n.push(name);
        leaders_d.push(`${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`);
    }

    if (leaders_s.length > 10) {
        leaders_s.pop();
        leaders_n.pop();
        leaders_d.pop();
    } 
}

function initiateBlock(){
    let game_name = document.getElementById("name_header");
    game_name.textContent = "2048";

    restart.classList.add("restart_button");
    restart.classList.add("no-select");
    restart.id = "restart_button";
    restart.textContent = "Начать заново";
    container.appendChild(restart);

    undo.classList.add("undo_button");
    undo.classList.add("no-select");
    undo.id = "undo_button";
    undo.textContent = "Отмена хода";
    container.appendChild(undo);
}

restart.addEventListener("click", () => {
    initiate();
    saveGame(false);
})

undo.addEventListener("click", () => {
    if (!undone){
        undone = true;
        score = previous_score;
        deleteCells();
        animateUndo(function (){
            saveGame();
            for (let index = 0; index < nums.length; index++){
                nums[index] = boxes[index] != null ? Number(boxes[index].textContent) : 0;
            }
            score = previous_score;
            score_amount.textContent = score;
        });
    }
})

function initiate(){
    initiateVariables();

    if (restart.id == "") {
        initiateScore();
        initiateCells();
        initiateBlock();
        initiateDialog();
        loadLeaders();
        initiateLeaderboard();
        loadGame();
    } else {
        score_amount.textContent = 0;
        generateNums(Math.floor(Math.random()*(1.3) + 1.85));
        news = [];
    }

    makeLeaderboard();
}

function generateNums(amount=2){
    console.log(amount);
    news = [];
    count = Math.min(amount, 16 - ns);
    while (count > 0){
        const ind = Math.floor(Math.random()*(16));
        if (nums[ind] == 0){
            const a = 2 * Math.floor(Math.random()*(1.15) + 1);
            nums[ind] = a; 
            news.push([ind, a])
            count--;
        }
    }
    addCells();
}

function checkPlayground(){
    let neighboors = [-1, 1, -4, 4];
    let stuck = true;
    let no_match = false;
    ns = 0;
    for (let index = 0; index < nums.length; index++){
        if (nums[index] == 0) { 
            stuck = false;
            continue;
        }
        ns++;
        for (let ind = 0; ind < 4; ind++){
            const sup_ind = index + neighboors[ind];
            if ((Math.floor(sup_ind / 16) == 0 && ind > 1) ||
                ((Math.floor(index / 4) == Math.floor(sup_ind / 4)) && ind < 2)){
                if (nums[index] == nums[sup_ind]){
                    stuck = false;
                }
            }
        }
    }
    return stuck;
}

function addCells(){
    for (let index = 0; index < news.length; index++){
        if (boxes[news[index][0]] != null) { continue; }
        const box = document.createElement("div");
        box.classList.add("num_box");
        box.classList.add("no-select");
        box.textContent = `${news[index][1]}`;
        box.classList.add(`nb${news[index][1]}`);

        box.style.position = "absolute";
        box.style.insetInlineStart = "50%";
        box.style.insetBlockStart = "50%";
        box.style.marginLeft = ((news[index][0] % 4  - 2) * pos + 5) + 'px';
        box.style.marginTop = ((Math.floor(news[index][0] / 4)  - 2) * pos + 5) +'px';
        
        boxes[news[index][0]] = box;
        container.appendChild(box);
    }
}

function deleteCells(){
    for (let index = 0; index < news.length; index++){
        container.removeChild(boxes[news[index][0]]);
        boxes[news[index][0]] = null;
    }
}

function makeTraces(){
    traces = [];
    index = 0;
    while (index < moves.length){
        if (traces.length == 0){
            traces.push(moves[index]);
        } else if (traces[traces.length - 1][1] == moves[index][1] &&
                    traces[traces.length - 1][2] == moves[index][0]){
            traces[traces.length - 1][2] = moves[index][2];
            traces[traces.length - 1][3] = moves[index][3];
        } else {
            traces.push(moves[index]);
        }
        index++;
    }
    makeBackTraces();
}

function makeBackTraces(){
    back_traces = [];
    index = 1;
    let pr = index - 1;
    back_traces.push([traces[pr][2], traces[pr][1], traces[pr][0], traces[pr][3]]);

    while (index < traces.length){
        back_traces.push([traces[index][2], traces[index][1], traces[index][0], traces[index][3]]);
        if (back_traces[pr][0] == back_traces[index][0] &&
            back_traces[pr][1] == back_traces[index][1] &&
            back_traces[pr][3] == 0){
            back_traces[index][0] = back_traces[pr][2];
            pr--;
        }
        if (pr > -1 && index - pr > 1){
            if (back_traces[pr][0] == back_traces[index][2] &&
                2 * back_traces[pr][1] == back_traces[index][3]){
                back_traces[index][2] = back_traces[pr][2];
                back_traces[pr][1] = -1;
                pr++;
            }
        }
        pr++;
        index++;
    }
}

function animateUndo(callback){
    if (back_traces.length == 0) { return; }
    let c = 0;
    free = false;

    let timer = setInterval(function() {

        if (c == 30) {
            clearInterval(timer);
            callback();
            free = true;
            return;
        }
        
        for (let index = back_traces.length - 1; index > -1; index--) {
            let elem = boxes[back_traces[index][0]];
            if (back_traces[index][1] == -1) { continue; }
            if (elem != null){
                updateUndoCell(elem, index);
            }

            const cur_cord = back_traces[index][2];
            elem = boxes[cur_cord];
            if (elem == null) { continue; }
            const dest_cord = back_traces[index][0];
            const dest_l = ((cur_cord % 4  - 2) * pos + 5);
            const dest_t = ((Math.floor(cur_cord / 4)  - 2) * pos + 5);
            const dir_l = Math.sign(dest_cord % 4 - cur_cord % 4);
            const dir_t = Math.sign(Math.floor(dest_cord / 4) - Math.floor(cur_cord / 4));
            st = draw(elem, 7 * (-dir_l), 7 * (-dir_t));
            if (st[0] + 7 * (-dir_l) == dest_l &&
                st[1] + 7 * (-dir_t) == dest_t) {
                    back_traces[index][1] = -1;
            }
        }
        c++;

    }, 3);
}


function updateUndoCell(elem, ind) {
    if (Number(elem.textContent) > back_traces[ind][1] &&
        boxes[back_traces[ind][2]] == null &&
        back_traces[ind][3] != 0 &&
        elem.style.marginLeft == `${((back_traces[ind][0] % 4  - 2) * pos + 5)}px` &&
        elem.style.marginTop == `${((Math.floor(back_traces[ind][0] / 4)  - 2) * pos + 5)}px`) {

        const box = document.createElement('div');
        box.classList.add("num_box");
        box.classList.add("no-select");
        box.textContent = `${back_traces[ind][3]}`;
        box.classList.add(`nb${back_traces[ind][3]}`);

        box.style.position = "absolute";
        box.style.insetInlineStart = "50%";
        box.style.insetBlockStart = "50%";
        box.style.marginLeft = ((back_traces[ind][0] % 4  - 2) * pos + 5) + 'px';
        box.style.marginTop = ((Math.floor(back_traces[ind][0] / 4)  - 2) * pos + 5) +'px';

        container.appendChild(box);
        boxes[back_traces[ind][2]] = box;

        boxes[back_traces[ind][0]].classList.remove(`nb${Number(boxes[back_traces[ind][0]].textContent)}`);
        boxes[back_traces[ind][0]].classList.add(`nb${Number(boxes[back_traces[ind][0]].textContent) - back_traces[ind][1]}`);
        boxes[back_traces[ind][0]].textContent = `${Number(boxes[back_traces[ind][0]].textContent) - back_traces[ind][1]}`;
    }
    if (back_traces[ind][3] == 0 &&
        boxes[back_traces[ind][2]] == null){
        boxes[back_traces[ind][2]] = elem;
        boxes[back_traces[ind][0]] = null;
    }
}

function animate(callback){
    if (traces.length == 0) { return; }
    let c = 0;
    let minuses = 0;
    free = false;
    for (let a_ind = 0; a_ind < traces.length; a_ind++) { traces_users.push(null); }

    let timer = setInterval(function() {
        if (minuses == traces.length || c == 30) {
            clearInterval(timer);
            callback();
            free = true;
            traces_users = [];
            return;
        }
        
        for (let index = 0; index < traces.length; index++) {
            const cur_cord = traces[index][0];
            const elem = boxes[cur_cord];
            if (elem == null || traces[index][1] != Number(elem.textContent) ||
                findIndexOf(traces_users, elem) != index &&
                findIndexOf(traces_users, elem) != -1) { continue; }
            if (traces_users[index] == null) {traces_users[index] = elem;}
            const dest_cord = traces[index][2];
            const dest_l = ((dest_cord % 4  - 2) * pos + 5);
            const dest_t = ((Math.floor(dest_cord / 4)  - 2) * pos + 5);
            const dir_l = Math.sign(cur_cord % 4 - dest_cord % 4);
            const dir_t = Math.sign(Math.floor(cur_cord / 4) - Math.floor(dest_cord / 4));
            st = draw(elem, 7 * (-dir_l), 7 * (-dir_t));
            minuses += updateCell(st, dir_l, dir_t, dest_l, dest_t, index);
        }
        c++;

    }, 3);
}

function findIndexOf(array, element){
    for (let fio_ind = 0; fio_ind < array.length; fio_ind++) {
        if (array[fio_ind] == element) {return fio_ind;}
    }
    return -1;
}

function draw(elem, left, top) {
    const st_l = Number(elem.style.marginLeft.slice(0, elem.style.marginLeft.length - 2));
    if (left != 0) { elem.style.marginLeft = st_l + left + 'px'; }
    const st_t = Number(elem.style.marginTop.slice(0, elem.style.marginTop.length - 2));
    if (top != 0) { elem.style.marginTop = st_t + top + 'px'; }
    
    return [st_l, st_t]
}

function updateCell(uc_st, uc_dir_l, uc_dir_t, uc_dest_l, uc_dest_t, uc_ind) {
    if (uc_st[0] + 7 * (-uc_dir_l) == uc_dest_l &&
        uc_st[1] + 7 * (-uc_dir_t) == uc_dest_t) {
            let uc_num = 0;
            if (boxes[traces[uc_ind][2]] != null) { 
                uc_num += Number(boxes[traces[uc_ind][2]].textContent);
                container.removeChild(boxes[traces[uc_ind][2]]);
            }
            if (traces[uc_ind][3] != 0){
                uc_num += Number(boxes[traces[uc_ind][0]].textContent);
                boxes[traces[uc_ind][0]].classList.remove(`nb${boxes[traces[uc_ind][0]].textContent}`);
                boxes[traces[uc_ind][0]].textContent = `${uc_num}`;
                boxes[traces[uc_ind][0]].classList.add(`nb${uc_num}`);
            }
            boxes[traces[uc_ind][2]] = boxes[traces[uc_ind][0]];
            boxes[traces[uc_ind][0]] = null;
            traces[uc_ind][1] = -1;
            traces_users[uc_ind] = -1;
            return 1;
    }
    return 0;

}

function clearBoxes() {
    if (boxes.length != 0){
        for (let index = 0; index < boxes.length; index++){
            if (boxes[index] == null) { continue; }
            container.removeChild(boxes[index]);
            boxes[index] = null;
        }
    } else {
        for (let index = 0; index < 16; index++){
            boxes.push(null);
        }
    }
}

function changeColumn(column, direction){
    col = direction > 0 ? column + 4: column + 8;
    let col_changed = false;

    while(true){
        if (col > 15 || col < 0){ break; }

        if (nums[col] == 0){ 
            col += 4 * direction;
            continue; 
        }

        // make traces here
        if (nums[col - 4 * direction] == nums[col] || nums[col - 4 * direction] == 0){
            moves.push([col, nums[col], col - 4 * direction, nums[col - 4 * direction]]);
            score += 2 * nums[col - 4 * direction];
            nums[col - 4 * direction] += nums[col];
            nums[col] = 0;
            col = direction > 0 ? Math.max(col - 4 * direction, column + 4): Math.min(col - 4 * direction, column + 8);
            col_changed = true;
            continue;
        }
        col += 4 * direction;
    }
    return col_changed;
}

function changeRow(row, direction){
    r = direction > 0 ? row + 1: row + 2;
    let row_changed = false;

    while(true){
        if (r > row + 3 || r < row){ break; }

        if (nums[r] == 0){ 
            r += direction;
            continue; 
        }

        // make traces here
        if (nums[r - direction] == nums[r] || nums[r - direction] == 0){
            moves.push([r, nums[r], r - direction, nums[r - direction]]);
            score += 2 * nums[r - direction];
            nums[r - direction] += nums[r];
            nums[r] = 0;
            r = direction > 0 ? Math.max(r - direction, row + 1): Math.min(r - direction, row + 2);
            row_changed = true;
            continue;
        }
        r += direction;
    }
    
    return row_changed;
}

function updateStory(){
    undone = false;
    moves = [];
}

function move(direction){
    let sup_score = score;
    let index = 0;
    let move_changed = false;

    if (direction == "up" || direction == "down"){
        dir = (direction == "up") ? 1 : -1;
        while (index < 4){
            move_changed += changeColumn(index, dir);
            index++;
        }
    } else {
        dir = (direction == "left") ? 1 : -1;
        while (index < 16){
            move_changed += changeRow(index, dir);
            index += 4;
        }
    }
    
    if (move_changed){
        previous_score = sup_score;
        score_amount.textContent = score;
        makeTraces();
        animate(function (){
            updateStory();
            generateNums(Math.floor(Math.random()*(1.3) + 1));
            saveGame(); 

            if (checkPlayground()) {
                saveGame(false);
                free = false;
                modal_element.showModal();
            }
        });
    }
}

initiate();

document.addEventListener('keydown', (event) => {
    if (!free) { return -1; }

    switch (event.key){
        case "ArrowUp": 
            move("up");
            break;
        case "ArrowDown": 
            move("down");
            break;
        case "ArrowLeft": 
            move("left");
            break;
        case "ArrowRight": 
            move("right");
            break;
    }
});

function TouchStart(e){
    x = e.changedTouches[0].clientX;
    y = e.changedTouches[0].clientY;
}

function TouchEnd(e){
    if (!free) { return -1; }
    const sensivity = 20;
    const xs = x - e.changedTouches[0].clientX;
    const ys = y - e.changedTouches[0].clientY;
    
    if (Math.abs(xs) > Math.abs(ys)){
        if (Math.abs(xs) > sensivity){
            if (xs > 0){
                move("left");
            } else {
                move("right");
            }
        }
    } else {
        if (Math.abs(ys) > sensivity){
            if (ys > 0){
                move("up");
            } else {
                move("down");
            }
        }
    }
}

document.addEventListener("touchstart", function (e) { TouchStart(e); });
document.addEventListener("touchend", function (e) { TouchEnd(e); });

