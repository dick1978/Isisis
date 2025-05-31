 "use client";
import React, { useState, useEffect } from "react";

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
        const time = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
        initialSchedule[iceRinks[0]].push(time);
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
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label>Roll: </label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Publik">Publik</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {iceRinks.map(rink => (
          <div
            key={rink}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(e, rink)}
            style={{
              flex: 1,
              border: "1px solid gray",
              padding: "0.5rem",
              minHeight: "400px",
              backgroundColor: "#eef",
              borderRadius: "8px"
            }}
          >
            <h3>{rink}</h3>
            {role === "Admin" ? (
              <input
                type="text"
                placeholder="Beskrivning för skärmvisning"
                value={descriptions[rink]}
                onChange={e => handleDescriptionChange(e, rink)}
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
            ) : (
              <p>
                <em>{descriptions[rink]}</em>
              </p>
            )}

            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {(schedule[rink] || []).map(time => (
                <div
                  key={time}
                  draggable={role === "Admin"}
                  onDragStart={e => handleDragStart(e, time, rink)}
                  style={{
                    background: "#cce",
                    padding: "4px",
                    margin: "2px 0",
                    borderRadius: "4px",
                    cursor: role === "Admin" ? "move" : "default",
                    fontSize: "0.8rem"
                  }}
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
