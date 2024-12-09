const apiUrl = 'http://localhost:3000/tasks';

// Load tasks when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

// Fetch and display tasks
async function loadTasks() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        const taskList = document.querySelector('.task-list');
        taskList.innerHTML = ''; // Clear existing tasks
        tasks.forEach(task => {
            createTaskElement(task);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Create a task element
function createTaskElement(task) {
    const taskList = document.querySelector('.task-list');
    const taskItem = document.createElement('div');
    taskItem.classList.add('task');

    const taskContent = document.createElement('h5');
    taskContent.textContent = task.completed ? `✓ ${task.name}` : task.name;

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');

    taskItem.appendChild(taskContent);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);

    // Add complete functionality
    completeButton.addEventListener('click', async () => {
        if (!task.completed) {
            try {
                const response = await fetch(`${apiUrl}/${task._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: true }),
                });

                if (response.ok) {
                    taskContent.textContent = `✓ ${task.name}`;
                    task.completed = true;
                } else {
                    console.error('Failed to mark task as complete');
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
    });

    // Add delete functionality
    deleteButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`${apiUrl}/${task._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                taskItem.remove();
                console.log(`Task deleted successfully`);
            } else {
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    });
}

// Add a new task
async function AddTask() {
    const inputTask = document.querySelector('.addTask input').value.trim();
    if (inputTask !== '') {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: inputTask }),
            });

            if (response.ok) {
                document.querySelector('.addTask input').value = ''; // Clear input
                loadTasks(); // Refresh tasks
            } else {
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
}

document.querySelector('.addTask button').addEventListener('click', AddTask);
document.querySelector('.addTask input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        AddTask();
    }
});
