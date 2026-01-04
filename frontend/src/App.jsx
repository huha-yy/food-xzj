import React from 'react'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <h1>校园美食评价系统</h1>
      <Routes>
        <Route path="/" element={<div>首页</div>} />
      </Routes>
    </div>
  )
}

export default App

