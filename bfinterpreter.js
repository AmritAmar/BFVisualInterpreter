class BFInterpreter {

  constructor(MEMORY_SIZE) {
    // Create a new 30,000 size array
    this.memory = new Array(MEMORY_SIZE).fill(0);
    
    // Instruction pointer
    this.insPointer = 0;
    
    // Memory pointer
    this.memPointer = 0;
    
    // Address stack
    this.addStack = [];
    
    //IO
    this.program = "";
    this.programInput = "";
    this.curInput = "";
    this.output = "";
  }
  
  reset() {
    //Reset everything
    this.memory.fill(0);
    this.insPointer = 0;
    this.memPointer = 0;
    this.addStack = [];
    this.output = "";
    this.input = "";
    this.program = "";
  }
  
  halfreset() {
    //Reset only variables
    this.memory.fill(0);
    this.insPointer = 0;
    this.memPointer = 0;
    this.addStack = [];
    this.output = "";    
  }

  inputProgram(program, input) {
    this.reset();
    this.program = program
    this.programinput = input
    this.input = input
  }
  
  setInput(t) {
    this.input = t;
  }
  
  sendOutput(value) {
    this.output += String.fromCharCode(value);
  }
  
  getMemory() {
    let mem = [];
    for(var i = 0; i < this.memory.length; i++) {
      mem.push(this.memory[i])
    }
    return mem;
  }
  
  getMemPointer() {
    return this.memPointer;
  }
  
  getOutput() {
    return this.output;
  }
  
  getInsPointer() {
    return this.insPointer;
  }

  getInput() {
    let val = 0;

    // If input isn't empty
    if (this.input) {
        val = this.input.charCodeAt(0);
        this.input = this.input.substring(1);
    }

    return val;
  }
  
  step() {
    let notUndefined = true;
    switch (this.program[this.insPointer]) {
      case '>':
        //Add more memory incase we run out!
        //if (this.memPointer == this.memory.length - 1) {
        //  this.memory.push(0, 0, 0, 0, 0);
        //}
        this.memPointer++;
        break;
      case '<':
        if (this.memPointer > 0) {
          this.memPointer--;
        }
        break;
      case '+':
        this.memory[this.memPointer]++;
        break;
      case '-':
        this.memory[this.memPointer]--;
        break;
      case '.':
        this.sendOutput(this.memory[this.memPointer]);
        break;
      case ',':
        this.memory[this.memPointer] = this.getInput();
        break;
      case '[':
        if (this.memory[this.memPointer]) { // If non-zero
          this.addStack.push(this.insPointer);
        } else { // Skip to matching right bracket
          let count = 0;
          while (true) {
            this.insPointer++;
            if (!this.program[this.insPointer]) break;
            if (this.program[this.insPointer] === "[") count++;
            else if (this.program[this.insPointer] === "]") {
              if (count) count--;
              else break;
            }
          }
        }
        break;
      case ']':
        this.insPointer = this.addStack.pop() - 1;
        break;
      case undefined:
        notUndefined = false;
        break;
      default: 
        break;
    }
    this.insPointer++;
    return notUndefined;
  }

  interpret() {
    this.halfreset();
    
    let end = false;
    while (!end) {
      let val = this.step();
      if (!val) {
        end = true;
      }
    }
  }
}