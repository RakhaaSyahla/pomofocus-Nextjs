// app/components/PomodoroTimer.tsx

"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  FormEvent,
} from "react";
import styles from "./PomodoroTimer.module.css";

// Tipe data
type Mode = "pomodoro" | "shortBreak" | "longBreak";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// Waktu default awal
const initialTimeSettings: Record<Mode, number> = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

export default function PomodoroTimer() {
  // --- State ---
  const [timeSettings, setTimeSettings] = useState(initialTimeSettings);
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState<number>(
    timeSettings.pomodoro * 60
  );
  const [isActive, setIsActive] = useState<boolean>(false);

  // State Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");

  // State Modal
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Refs untuk input modal
  const pomoInputRef = useRef<HTMLInputElement>(null);
  const shortInputRef = useRef<HTMLInputElement>(null);
  const longInputRef = useRef<HTMLInputElement>(null);

  // --- Fungsi Handler (dibungkus useCallback) ---

  // Fungsi Reset (bergantung pada mode & timeSettings)
  const handleReset = useCallback(() => {
    setIsActive(false);
    setSecondsLeft(timeSettings[mode] * 60);
  }, [mode, timeSettings]);

  // Fungsi Ganti Mode (bergantung pada timeSettings)
  const handleModeChange = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      setIsActive(false);
      setSecondsLeft(timeSettings[newMode] * 60);
    },
    [timeSettings]
  );

  // Fungsi Start/Pause (tidak bergantung pada apa-apa)
  const handleStartPause = useCallback(() => {
    setIsActive((prevIsActive) => !prevIsActive);
  }, []);

  // Fungsi Modal Settings
  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();

    const newSettings = {
      pomodoro: Number(pomoInputRef.current?.value) || 25,
      shortBreak: Number(shortInputRef.current?.value) || 5,
      longBreak: Number(longInputRef.current?.value) || 15,
    };

    setTimeSettings(newSettings);
    setShowSettings(false);

    // Update timer utama jika mode saat ini yang diubah & tidak berjalan
    if (!isActive) {
      if (mode === "pomodoro") setSecondsLeft(newSettings.pomodoro * 60);
      else if (mode === "shortBreak")
        setSecondsLeft(newSettings.shortBreak * 60);
      else if (mode === "longBreak") setSecondsLeft(newSettings.longBreak * 60);
    }
  };

  // --- Fungsi Tasks ---
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (taskInput.trim() === "") return;

    const newTask: Task = {
      id: Date.now(),
      text: taskInput,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskInput("");
  };

  const handleToggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // INI FUNGSI DELETE
  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // --- Effect untuk Timer (Auto-Ceklis) ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      if (interval) clearInterval(interval);
      setIsActive(false);
      alert(`${mode} session finished!`);

      // Logika Auto-Ceklis
      if (mode === "pomodoro") {
        setTasks((prevTasks) => {
          const firstIncompleteTaskIndex = prevTasks.findIndex(
            (t) => !t.completed
          );
          if (firstIncompleteTaskIndex === -1) return prevTasks;
          return prevTasks.map((task, index) =>
            index === firstIncompleteTaskIndex
              ? { ...task, completed: true }
              : task
          );
        });
      }

      handleReset(); // Reset timer
    }

    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, mode, handleReset]); // Dependencies sudah benar

  // --- Effect untuk Background (tidak berubah) ---
  useEffect(() => {
    document.body.classList.remove("pomodoro", "shortBreak", "longBreak");
    document.body.classList.add(mode);
  }, [mode]);

  // --- Fungsi Format Waktu (tidak berubah) ---
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // --- Tampilan JSX ---
  return (
    <>
      <div className={styles.container}>
        {/* Tombol Mode */}
        <div className={styles.modeButtons}>
          <button
            className={`${styles.modeBtn} ${
              mode === "pomodoro" ? styles.active : ""
            }`}
            onClick={() => handleModeChange("pomodoro")}
          >
            Pomodoro
          </button>
          <button
            className={`${styles.modeBtn} ${
              mode === "shortBreak" ? styles.active : ""
            }`}
            onClick={() => handleModeChange("shortBreak")}
          >
            Short Break
          </button>
          <button
            className={`${styles.modeBtn} ${
              mode === "longBreak" ? styles.active : ""
            }`}
            onClick={() => handleModeChange("longBreak")}
          >
            Long Break
          </button>
        </div>

        {/* Tampilan Timer */}
        <div className={styles.timer}>{formatTime(secondsLeft)}</div>

        {/* Tombol Kontrol */}
        <div className={styles.controlButtons}>
          <button onClick={handleStartPause} className={styles.mainBtn}>
            {isActive ? "Pause" : "Start"}
          </button>

          <button onClick={handleReset} className={styles.resetBtn}>
            Reset
          </button>
        </div>

        {/* --- Bagian Task --- */}
        <div className={styles.tasksWrapper}>
          <div className={styles.tasksHeader}>Tasks</div>
          <form onSubmit={handleAddTask} className={styles.taskInputWrapper}>
            <input
              type="text"
              className={styles.taskInput}
              placeholder="What are you working on?"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button type="submit" className={styles.taskAddBtn}>
              +
            </button>
          </form>
          <ul className={styles.taskList}>
            {tasks.map((task) => (
              <li key={task.id} className={styles.taskItem}>
                <input
                  type="checkbox"
                  className={styles.taskCheckbox}
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                />
                <div className={styles.taskTextWrapper}>
                  <span
                    className={
                      task.completed
                        ? styles.taskTextCompleted
                        : styles.taskText
                    }
                  >
                    {task.text}
                  </span>
                </div>
                {/* INI TOMBOL DELETE-NYA */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className={styles.taskDeleteBtn}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Tombol Settings --- */}
        <button
          onClick={() => setShowSettings(true)}
          className={styles.settingsBtn}
        >
          Settings
        </button>
      </div>

      {/* --- Modal Settings --- */}
      {showSettings && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowSettings(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Timer Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className={styles.modalCloseBtn}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveSettings}>
              <div className={styles.modalBody}>
                <div className={styles.settingInputGroup}>
                  <label htmlFor="pomodoro">Pomodoro (menit)</label>
                  <input
                    type="number"
                    id="pomodoro"
                    ref={pomoInputRef}
                    defaultValue={timeSettings.pomodoro}
                    min="1"
                  />
                </div>
                <div className={styles.settingInputGroup}>
                  <label htmlFor="shortBreak">Short Break (menit)</label>
                  <input
                    type="number"
                    id="shortBreak"
                    ref={shortInputRef}
                    defaultValue={timeSettings.shortBreak}
                    min="1"
                  />
                </div>
                <div className={styles.settingInputGroup}>
                  <label htmlFor="longBreak">Long Break (menit)</label>
                  <input
                    type="number"
                    id="longBreak"
                    ref={longInputRef}
                    defaultValue={timeSettings.longBreak}
                    min="1"
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.modalSaveBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
