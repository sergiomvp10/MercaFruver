import { moneyFormat } from '@/utilities/formats';
import React from 'react'
import Icon from 'react-icons-kit';
import { u2716 } from "react-icons-kit/noto_emoji_regular/u2716";


const ItemSale = ({item, deleteItemSale}) => {
  return (
    <div className="bg-cyan-50 rounded-lg grid grid-cols-5 p-3 gap-12">
      <div className="font-bold">{item.name}</div>
      <div className="text-center">{item.amount}</div>
      <div className="text-left">{moneyFormat(item.price_sale)}</div>
      <div className="text-right">{moneyFormat(item.amount * item.price_sale)}</div>
      <div onClick={() => deleteItemSale(item)} className="text-right">
        <Icon className="cursor-pointer hover:scale-125" icon={u2716} />
      </div>
    </div>
  );
}

export default ItemSale