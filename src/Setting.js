import React, { useState } from "react";

function Setting({ isPlaying, onAcceptClick, ascending, setAscending}) {
    const [row, setRow] = useState(10);
    const [col, setCol] = useState(10);
    const [err, setErr] = useState(""); 
    function onAcceptClickSetting() {
      if (isPlaying) return;
      if (row < 5) { return setErr("Số hàng phải lớn hơn 5") }
      if (col < 5) { return setErr("Số cột phải lớn hơn 5") }
      onAcceptClick(row, col);
      setErr("")
    }
    return (
      <div className="game-setting">
        <p className="game-setting__title">Cấu hình game</p>
        <input type="number" min="5" placeholder="Nhập Số hàng" className="input_form"
          value={row}
          disabled = {isPlaying}
          onChange={(e) => setRow(parseInt(e.target.value))}
        ></input>
        <input type="number" min="5" placeholder="Nhập Số cột" className="input_form"
          value={col}
          name="col"
          disabled = {isPlaying}
          onChange={(e) => setCol(parseInt(e.target.value))}
        ></input>
        {err && <p>{err}</p>}
        <button onClick={onAcceptClickSetting} className="btn" >Thay đổi</button>
        <button onClick={()=>{ setAscending(!ascending); }} className="btn" >
          {ascending ? "Xếp trên xuống" : "Xếp dưới lên"}
        </button>
      </div>
    )
  }

export default Setting;
