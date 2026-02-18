import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const load = async () => {
    try {
      const res = await api.get("/tasks", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await api.post(
        "/tasks",
        { 
          title: newTask, 
          description: "", 
          dueDate: newTaskDate || new Date().toISOString().split('T')[0],
          status: "pending" 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask("");
      setNewTaskDate("");
      load();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      load();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      await api.put(
        `/tasks/${task.id}`,
        { ...task, status: task.status === "completed" ? "pending" : "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      load();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null;
      return taskDate === dateStr;
    });
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null;
      return taskDate === today;
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return taskDate > today && task.status !== "completed";
    }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Task Scheduler</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-grid">
        {/* Left Section - Task List */}
        <div className="tasks-section">
          <div className="add-task-card">
            <h3>Add New Task</h3>
            <input
              type="text"
              placeholder="Enter task title..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="task-input"
            />
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="date-input"
            />
            <button onClick={addTask} className="add-btn">Add Task</button>
          </div>

          <div className="tasks-list-card">
            <h3>Today's Tasks</h3>
            <div className="task-list">
              {getTodayTasks().length === 0 ? (
                <p className="no-tasks">No tasks for today</p>
              ) : (
                getTodayTasks().map((task) => (
                  <div key={task.id} className={`task-item ${task.status}`}>
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => toggleTaskStatus(task)}
                        className="task-checkbox"
                      />
                      <span className={task.status === "completed" ? "completed-text" : ""}>
                        {task.title}
                      </span>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="delete-btn">×</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="tasks-list-card">
            <h3>Upcoming Tasks</h3>
            <div className="task-list">
              {getUpcomingTasks().length === 0 ? (
                <p className="no-tasks">No upcoming tasks</p>
              ) : (
                getUpcomingTasks().slice(0, 5).map((task) => (
                  <div key={task.id} className={`task-item ${task.status}`}>
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => toggleTaskStatus(task)}
                        className="task-checkbox"
                      />
                      <div>
                        <span className={task.status === "completed" ? "completed-text" : ""}>
                          {task.title}
                        </span>
                        <small className="task-date">
                          {new Date(task.due_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </small>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="delete-btn">×</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Calendar */}
        <div className="calendar-section">
          <div className="calendar-card">
            <div className="calendar-header">
              <button onClick={previousMonth} className="nav-btn">‹</button>
              <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
              <button onClick={nextMonth} className="nav-btn">›</button>
            </div>

            <div className="calendar-grid">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="calendar-day-name">{day}</div>
              ))}
              {getDaysInMonth(currentMonth).map((date, index) => {
                const tasksForDay = date ? getTasksForDate(date) : [];
                const isToday = date && isSameDay(date, new Date());
                const isSelected = date && isSameDay(date, selectedDate);

                return (
                  <div
                    key={index}
                    className={`calendar-day ${!date ? 'empty' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <span className="day-number">{date.getDate()}</span>
                        {tasksForDay.length > 0 && (
                          <div className="task-indicator">
                            {tasksForDay.length}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Tasks */}
          <div className="selected-date-card">
            <h3>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            <div className="task-list">
              {getTasksForDate(selectedDate).length === 0 ? (
                <p className="no-tasks">No tasks scheduled</p>
              ) : (
                getTasksForDate(selectedDate).map((task) => (
                  <div key={task.id} className={`task-item ${task.status}`}>
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => toggleTaskStatus(task)}
                        className="task-checkbox"
                      />
                      <span className={task.status === "completed" ? "completed-text" : ""}>
                        {task.title}
                      </span>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="delete-btn">×</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
