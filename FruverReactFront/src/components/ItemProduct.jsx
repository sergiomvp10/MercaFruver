import React from "react";
import Swal from "sweetalert2";
import { edit } from "react-icons-kit/entypo/edit";
import { trash } from "react-icons-kit/entypo/trash";
import Icon from "react-icons-kit";
import Modal from "./Modal";
import UpdateProduct from "./UpdateProduct";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { serviceDeleteProduct } from "@/services/productsApi";

const ItemProduct = (props) => {
  const ref = useRef(null);
  const [openModal, setOpenModal] = useState(false);

  const handleUpdateProduct = () => {
    setOpenModal(!openModal);
  };

  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: 'Seguro que quiere eliminar este producto?',
      showDenyButton: true,
      confirmButtonText: 'Borrar',
      confirmButtonColor: "#A3E635",
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await serviceDeleteProduct({ id })
        await props.refetchingProducts()
        Swal.fire('Borrado!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('El producto no fue borrado', '', 'info')
      }
    })
  }

  const actions = props.actions;


  useEffect(() => {
    ref.current = document.querySelector("#portal");
  }, []);

  return (
    <div className="grid grid-cols-7 gap-10 max-w-2xl min-w-full items-center text-center p-2 rounded-lg bg-lime-50 ">
      {ref?.current != null &&
        openModal &&
        createPortal(
          <Modal handleModal={() => setOpenModal(!openModal)}>
            <UpdateProduct
              handleModal={() => setOpenModal(!openModal)}
              refetchingProducts={props.refetchingProducts}
              id={props.id}
              name={props.name}
              description={props.description}
              price_purchase={props.price_purchase}
              price_sale={props.price_sale}
              stock={props.stock}
            />
          </Modal>,
          ref.current
        )}
      <div className="font-bold break-words col-span-2 text-left">{props.name}</div>
      <div className="flex-1 col-start-3">{props.description}</div>
      <div className="flex-1 ">{props.price_sale}</div>
      <div className="flex-1">{props.stock}</div>
      {props.children}
      {actions?.edit && (
        <div
          className="flex-1  text-center rounded-full cursor-pointer"
          onClick={handleUpdateProduct}
        >
          <Icon className="hover:text-orange-400" icon={edit} size={20} />
        </div>
      )}
      {actions?.delete && (
        <div className="flex-1 text-center rounded-full cursor-pointer" onClick={() => handleDeleteProduct(props.id)}>
          <Icon className="hover:text-orange-400" icon={trash} size={20} />
        </div>
      )}
      {actions?.input && (
        <div className="flex-1 text-center rounded-full cursor-pointer">
          <input onKeyDown={props.onKeyDown} className="text-center w-16 border rounded-lg border-black" />
        </div>
      )}
    </div>
  );
};

export default ItemProduct;
