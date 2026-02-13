import React from 'react'
import Analatics from '../components/Analatics'
import CreateCategory from '../components/CreateCategory'
export default function Admin() {
  return (
    <div className={`flex gap-10 flex-wrap`}>
      <Analatics/>
      <CreateCategory/>
    </div>
  )
}
