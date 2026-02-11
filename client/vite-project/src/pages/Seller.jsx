import React from 'react'
import Dashboard from './Dashboard'
import CreateProduct from './CreateProduct';

export default function Seller() {
  return (
    <div>
      <Dashboard comp={<CreateProduct/>}/>
    </div>
  )
}
