//Text Inputs
let program;
let programInput;
let programOutput;

//Buttons
let loadButton;
let runButton;
let stepButton;
let stopButton;

//Slider
let speedSlider;

let bf;
let auto = false;
let loaded = false;
let curProgram = ""
let curInput = ""
let curInstruction = 0;
let w = 0;

p1 = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
p2 = ",[.,]"

function setup() {
  createCanvas(720, 750);  
  createUI();
  //console.log(width)
  
  bf = new BFInterpreter(30);
  
  //bf.inputProgram(p, "");
  //bf.interpret();
  //console.log(bf.getOutput());
  //drawMemory(bf);
  
  //Reset
  //bf.reset();
  
  //bf.inputProgram(p2, "afffs");
  //bf.interpret();
  //console.log(bf.getOutput());  
  //drawMemory(bf);
  
  //verifyBrainFuckProgram(p);
}

function createUI() {
  
  program = createElement('textarea');
  program.position(10, 10);
  program.size(695, 100);
  program.style("resize", "none");
  program.style("font-size", "20px");
  program.value("Write the BrainFuck Program here")
  
  programInput = createElement('textarea');
  programInput.position(10, 120);
  programInput.size(695, 25);
  programInput.style("resize", "none");
  programInput.style("font-size", "20px");
  programInput.value("Write any inputs to the program here")
  
  programOutput = createElement('textarea');
  programOutput.position(10, 700);
  programOutput.size(695, 25);
  programOutput.style("resize", "none");
  programOutput.style("font-size", "20px");
  programOutput.attribute("readonly", "true");
  programOutput.value("Output will be here")
  
  loadButton = createButton('LOAD PROGRAM');
  loadButton.position(10, 160);
  loadButton.style("font-size", "20px");
  loadButton.mousePressed(loadProgram);
  
  runButton = createButton('RUN');
  runButton.position(570, 160);
  runButton.style("font-size", "20px");
  runButton.mousePressed(runProgram);
  
  stepButton = createButton('STEP');
  stepButton.position(640, 160);
  stepButton.style("font-size", "20px");
  stepButton.mousePressed(stepProgram);
  
  stopButton = createButton('STOP');
  stopButton.position(485, 160);
  stopButton.style("font-size", "20px");
  stopButton.mousePressed(stopProgram);
  
  speedSlider = createSlider(1, 25, 1);
  speedSlider.position(200, 160);
  speedSlider.style('width', '100px');

  
}

function loadProgram() {
  if (verifyBrainFuckProgram(program.value())) {
    curProgram = program.value();
    curInput = programInput.value();
    
    bf.inputProgram(curProgram, curInput);
    
    loaded = true;
    auto = false;
  }
}

function stopProgram() {
  auto = false;
}

function stepProgram() {
  if (loaded) {
    auto = false;
    bf.step()
  }
}

function runProgram() {
  if (loaded) {
    auto = true;
  }
}

function verifyBrainFuckProgram(stra) {
  let verify = /^[+-<>.,\[\] \t\n\r]+$/;
  if (stra.match(verify)) {
    return true;
  } else {
    return false;
  }
}

function drawText(t, cur, h) {
  textSize(64)
  before = (t.slice(0,cur));
  letter = (t.slice(cur,cur+1));
  after = (t.slice(cur+1,t.length));
  
  before_w = textWidth(before);
  letter_w = textWidth(letter);
  after_w = textWidth(after);
  
  textSize(64);
  textAlign(RIGHT, TOP);
  fill(0)
  text(before, width/2 - letter_w/2, h);
  
  textSize(72);
  textAlign(CENTER, TOP);
  fill(255)
  text(letter, width/2, h-3);
  
  textSize(64);
  textAlign(LEFT, TOP);
  fill(0)
  text(after, width/2 + letter_w/2, h);
}

function drawMemory(bfuck, h) {
  //console.log(bf.getMemory());
  mem = bfuck.getMemory()
  cur = bfuck.getMemPointer();
  
  before = (mem.slice(0,cur));
  letter = (mem.slice(cur,cur+1));
  after = (mem.slice(cur+1,mem.length));
  
  //console.log(before)
  //console.log(letter)
  //console.log(after)
  
  //BEFORE
  for (var i = before.length-1; i > -1; i--) {
    textSize(32);
    textAlign(LEFT, TOP);
    fill(0)
    text(i, width/2 - 50 - (1 + before.length - 1 - i)*100, h-30);
    
    fill(100)
    rect(width/2 - 50 - (1 + before.length - 1 - i)*100, h, 100, 100)
    
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(0)
    text(before[i], width/2 - 50 + 50 - (1 + before.length - 1 - i)*100, h+50);
  }
  
  //Current
  textSize(32);
  textAlign(LEFT, TOP);
  fill(255)
  text(cur, width/2 - 50, h-30);
    
  fill(100)
  rect(width/2 - 50, h, 100, 100)
    
  textSize(48);
  textAlign(CENTER, CENTER);
  fill(255)
  text(letter[0], width/2, h+50);
  
  //AFTER
  for (var i = 0; i < after.length; i++) {
    textSize(32);
    textAlign(LEFT, TOP);
    fill(0)
    text(cur + 1 + i, 50 + width/2 + i*100, h-30);
    
    fill(100)
    rect(50 + width/2 + i*100, h, 100, 100)
    
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(0)
    text(after[i], 50 + width/2 + 50 + i*100, h+50);
  }
  
}

function draw() {
  background(100);
  //console.log(deltaTime)
  if (loaded) {
    drawText(curProgram, bf.getInsPointer(), 200);
    programOutput.value(bf.getOutput());
    drawMemory(bf, 400)
  }
  if (auto) {
    w += deltaTime
    if (w > 1000/speedSlider.value()) {
      w = 0;
      bf.step();
    }
  }
  textAlign(LEFT, CENTER)
  textSize(20);
  text(speedSlider.value() + " instructions/sec", 314, 174)
}