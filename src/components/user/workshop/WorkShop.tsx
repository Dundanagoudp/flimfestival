import React from 'react'
import ShowWorkShop from './module/ShowWorkShop'
import WorkShopHeader from './module/WorkShopHeader'


export default function WorkShop() {

   
  return (
    <div  className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
        <WorkShopHeader/>
        <ShowWorkShop/>
        
    </div>
  )
}
