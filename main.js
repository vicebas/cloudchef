import TasksManagement from './Tasks.js';
import generateTasks from './generateTask.js';

function main() {
	const taskNumber = process.argv[2] || 10;
	const tasks = generateTasks(parseInt(taskNumber), 3, 200, 50);
	const workersNum = process.argv[3] || 3;
	const tasksManagement = new TasksManagement(tasks, parseInt(workersNum));
	tasksManagement.run();
}

main();