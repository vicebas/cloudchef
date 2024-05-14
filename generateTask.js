

export default function generateTasks(taskNumber,maxDependencies,maxTimeRequired,minTimeRequired){
    const tasks = {};

    for (let i = 0; i < taskNumber; i++) {
        const dependencies = [];
        const tasksIds = Object.keys(tasks);
        const dependenciesNum = Math.min(Math.floor(Math.random() * maxDependencies), Object.keys(tasks).length);
        for (let j = 0; j < dependenciesNum; j++) {
            dependencies.push(tasksIds[Math.floor(Math.random() * tasksIds.length)]);
        }
        dependencies.filter((value, index, self) => self.indexOf(value) === index);
        const taskId = `task${i}`;
        tasks[taskId] = {
            timeRequired: Math.floor(Math.random() * (maxTimeRequired - minTimeRequired) + minTimeRequired),
            dependencies
        };
    }
    return tasks;
}


