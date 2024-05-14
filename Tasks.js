
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Task {
    constructor(id,timeRequired, dependencies) {
        this.id = id;
        this.timeRequired = timeRequired;
        this.dependencies = dependencies;
        this.timeConsumed = 0;
        this.worker = null;

    }


    static createTasksFromInput(input) {
        const tasks = {};
        const keys = Object.keys(input);

        for (const taskId of keys) {
            tasks[taskId] = new Task(taskId,parseInt(input[taskId].timeRequired), input[taskId].dependencies);
        }
        return tasks;
    }

    assignWorker(worker){
        this.worker = worker;
    }

    consumeTime(){
        if(this.timeConsumed < this.timeRequired)
            this.timeConsumed++;
    }
    done(){
        return this.timeConsumed === this.timeRequired;
    }

}

class Worker {
    currentTask = null;

    constructor(id) {
        this.id = id;
    }
    addTask(taskId){
        if(this.currentTask === null){
            this.currentTask = taskId;
        }
    }
    removeTask(){
        this.currentTask = null;
    }

    toString(){
        return this.id;
    }


}

class TasksManagement{
    tasks = {};
    orderedTasks = [];
    activeTasks = [];
    executedTasks = [];
    workers = [];
    tick = 0;

    constructor(input, workersNum) {
        this.tasks = Task.createTasksFromInput(input);
        this.workers = Array(workersNum).fill().map((_,index) => new Worker(index));
    }
    
    drawSorting(stack, taskIds){
        console.clear();
        console.log("Topological Sort....")
        const stackSize = stack.length*80/taskIds.length;
        const  pendingSize = (taskIds.length - stack.length)*80/taskIds.length;
        const stackBar = Array(Math.floor(stackSize)).fill("█").join("").padEnd(80, "_");
        const  pendingBar = Array(Math.floor(pendingSize)).fill("█").join("").padEnd(80, "_");
        console.log("\n",stackBar, "\n\n", pendingBar, "\n\n");
    }
    async sortTasks() {
        const taskIds = Object.keys(this.tasks);
        console.log("Sorting tasks....")
        console.log(taskIds.map(t => this.tasks[t].timeRequired).join("-->"))
        taskIds.sort((task1, task2) => this.tasks[task2].timeRequired - this.tasks[task1].timeRequired);
        await sleep(2000);
        console.log(taskIds.map(t => this.tasks[t].timeRequired).join("-->"))
        await sleep(2000);
        const stack = [];
        const visited = {};
        while (stack.length < taskIds.length) {
            let found = false;
            for (const taskId of taskIds) {
                if (!visited[taskId] && this.tasks[taskId].dependencies.every(dep => visited[dep])) {
                    stack.push(taskId);
                    visited[taskId] = true;
                    found = true;
                    console.log(stack.join("-->"))
                    this.drawSorting(stack, taskIds);
                    await sleep(20);
                }
            }
            if (!found) {
                throw new Error('Tasks have cyclic dependencies');
            }
        }
        console.log(taskIds.map(t => this.tasks[t].timeRequired).join("-->"))
        await sleep(2000);
        return stack;
    }

    getNextAvailableTask() {
        for (const taskId of this.orderedTasks) {
            if (!this.executedTasks.includes(taskId) && !this.activeTasks.includes(taskId) && this.tasks[taskId].dependencies.every(dep => this.executedTasks.includes(dep))) {
                return taskId;
            }
        }
        return null;
    }

    getAvailableWorker() {
        for (const worker of this.workers) {
            if(!this.activeTasks.some(task => this.tasks[task].worker === worker)){
                return worker;
            }
        }
        return null;
    }

    next(){
        this.tick++;
        for(const task of this.activeTasks){
            this.tasks[task].consumeTime();
            if(this.tasks[task].done()){
                this.executedTasks.push(task);
                this.activeTasks = this.activeTasks.filter(t => t !== task);
                this.tasks[task].worker.removeTask();
                this.tasks[task].worker = null;
                
            }
        }
        const nextTaskId = this.getNextAvailableTask();
        if(nextTaskId){
            const worker = this.getAvailableWorker();
            if(worker){
                this.tasks[nextTaskId].assignWorker(worker);
                worker.addTask(nextTaskId);
                this.activeTasks.push(nextTaskId);
            }
        }
        
    }

    async run(){
        this.orderedTasks = await this.sortTasks();
        while (this.executedTasks.length < this.orderedTasks.length) {
            this.next();
            this.draw();
            await sleep(20);   
        }
    }

     draw(){
        const totalTime = Object.values(this.tasks).reduce((acc, value) => acc + value.timeRequired, 0);
        const consumedTime = Object.values(this.tasks).reduce((acc, value) =>  acc + value.timeConsumed, 0);
        console.clear();
        const bar = Array(Math.floor(consumedTime/totalTime*80)).fill("█").join("").padEnd(80, "_");
        console.log("Current time ",this.tick);
        console.log("--------------------------------------------")
        console.log(bar, Math.floor(consumedTime/totalTime*100) + "%");
        const idleWorkers = this.workers.filter(worker => !this.activeTasks.some(task => this.tasks[task].worker === worker));
        console.log("Idle workers: ", idleWorkers.map(worker => worker.id))
        let idle = 0
        let lastTask = null;
        for (const index in this.orderedTasks) {
            const taskId = this.orderedTasks[index];
            const task = this.tasks[taskId];
            if(task.done()){
                continue;
            }
            if(task.worker){
                console.log(`Task ${taskId}: ${task.timeConsumed}/${task.timeRequired} worker ${task.worker}`);
                continue;
            } else {
                idle++;
            }
            if(!task.dependencies.every(dep => this.executedTasks.includes(dep))){
                console.log(`Task ${taskId}: waiting for dependencies ${task.dependencies.filter(dep => !this.executedTasks.includes(dep))}`);
            } else {
                console.log(`Task ${taskId}: waiting for available worker`);
            }
            lastTask = index;
        
            if (idle >2){
                break;
            }
        }
        const waitingTasks = Object.values(this.tasks).filter(task => !this.executedTasks.includes(task.id) && !this.activeTasks.includes(task.id) );
        console.log("waiting tasks:", waitingTasks.length);
    }

}

export default TasksManagement;