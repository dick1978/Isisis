
"use client";
import React, { useState, useEffect } from "react";
import "./styles.css";

const IceSchedule = () => {
  const iceRinks = ["A-hallen", "Ravemahallen", "Prolympiahallen", "D-hallen"];
  const [role, setRole] = useState("Admin");
  const [schedule, setSchedule] = useState({});
  const [descriptions, setDescriptions] = useState({});

  const startHour = 6;
  const endHour = 23;
  const interval = 10;

  useEffect(() => {
    const initialSchedule = {};
    const initialDescriptions = {};
    iceRinks.forEach(rink => {
      initialSchedule[rink] = [];
      initialDescriptions[rink] = "";
    });
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += interval) {
        const time = \`\${h.toString().padStart(2, "0")}:\${m.toString().padStart(2, "0")}\`;
        initialSchedule[iceRinks[0]].push(time); // default tider till första hallen
      }
    }
    setSchedule(initialSchedule);
    setDescriptions(initialDescriptions);
  }, []);

  const handleDragStart = (e, time, rink) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ time, rink }));
  };

  const handleDrop = (e, targetRink) => {
    const { time, rink } = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (rink === targetRink) return;
    setSchedule(prev => {
      const newSchedule = { ...prev };
      newSchedule[rink] = newSchedule[rink].filter(t => t !== time);
      newSchedule[targetRink] = [...newSchedule[targetRink], time].sort();
      return newSchedule;
    });
  };

  const handleDescriptionChange = (e, rink) => {
    setDescriptions({ ...descriptions, [rink]: e.target.value });
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Roll: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Publik">Publik</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {iceRinks.map(rink => (
          <div
            key={rink}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, rink)}
            className="ice-column"
            style={{ flex: 1, border: "1px solid gray", padding: "0.5rem", minHeight: "400px", backgroundColor: "#f9f9f9" }}
          >
            <h3>{rink}</h3>
            {role === "Admin" && (
              <input
                type="text"
                placeholder="Beskrivning (endast admin)"
                value={descriptions[rink]}
                onChange={(e) => handleDescriptionChange(e, rink)}
                className="description-field"
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
            )}
            <div>
              {(schedule[rink] || []).map(time => (
                <div
                  key={time}
                  className="time-slot"
                  draggable={role === "Admin"}
                  onDragStart={(e) => handleDragStart(e, time, rink)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IceSchedule;
