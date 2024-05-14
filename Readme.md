# CloudChef problem statement
### **📌 Problem Statement**

In a simplified warehouse scenario, we are given **`N`** resources, each equally capable of performing any task among a set **`m`** of tasks $T_1, T_2, T_3, …, T_m.$ The objective is to strategize the scheduling of these tasks to minimize the total completion time.

### **🛠️ Task Structure**

Each task in the system is defined with the following properties:
```

Task:
		id - String
    timeRequired - Numeric 
    dependencies - Array of task IDs

```

- **timeRequired**: The duration required to complete the task.
- **dependencies**: A list of task IDs indicating prerequisite tasks.

### 🔄 Task Example
For a clearer understanding, here’s an example of task definitions in JSON format:

```
{
	"task_id1": {
		"timeRequired": 200,
		"dependencies": ["task_id2", "task_id3"]
	},
	"task_id2": {
		"timeRequired": 100,
		"dependencies": ["task_id4"]
	},
	"task_id3": {
		"timeRequired": 50,
		"dependencies": []
	},
	"task_id4": {
		"timeRequired": 100,
		"dependencies": []
	}
}
```


### Solution

Solution

To approach this problem, first we need to understand the objectives. With the list of tasks, our objectives are:

- Completing all the tasks: We need to ensure that all tasks are executed, considering their dependencies and ensuring that no task is left incomplete.
- Minimizing the completion time: We aim to schedule tasks in a way that minimizes the total time required to complete all tasks. This involves efficient allocation of resources and prioritization of tasks.
- Minimizing idle resources: We want to optimize resource utilization by minimizing idle time for each resource. This involves distributing tasks among resources in a balanced manner.
- Solving the dependencies: Tasks may have dependencies, meaning certain tasks must be completed before others can start. We need to handle these dependencies properly to ensure tasks are executed in the correct order.

#### Proposed solution
The proposed solution is a greedy algorithm that prioritizes tasks based on their time required and dependencies. Specifically, the algorithm aims to maximize resource utilization by selecting the largest task with all dependencies satisfied at each step.

The proposed solution consists of two steps:

    Sorting Algorithm: A sorting algorithm that sorts every task by its time required, and then applies topological sorting to guarantee that a task will be after its dependencies in the execution list.

    Execution Algorithm: An algorithm that takes the ordered tasks and manages the resources, assigning a task to each resource at the moment it becomes available, minimizing idle time.


On this repository is the code implementation for the proposed solution in javascript, with graphical cues to help understand each step.


### Running the solution

As this repository has no dependencies, there is no need to run `` npm install``.

But the number of tasks and workers are customizable. YOu can run

```
npm start

```

To run it with **10 tasks** and **3 workers**. You also can run

```
npm start -- [number of tasks] [number of workers]

```

To customize the number of tasks and workers available

#### Example:

```
npm start -- 100

```

This will run the code with **100 tasks** and **3 workers**.


```
npm start -- 50 5

```

This will run the code with **50 tasks** and **5 workers**.







