import './Transactions.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, getDatabase } from 'firebase/database';
import { createTransaction } from '../CRUD';

const Transactions = () => {

   const database = getDatabase();
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(true);
   const [Cstmdata, setCstmData] = useState(true);
   const [Suppdata, setSuppData] = useState(true);
   const [Proddata, setProdData] = useState(true);
   const [newData, setNewData] = useState({ name: "", phone: "" });
   const [optionSelected, setOptionSelected] = useState();
   const [name,setName]=useState();
   const [ProdName,setProdName]=useState();
   const handleUpdate = () => {
      navigate('/edittransactions');
   }

   useEffect(() => {

      const fetchData = async () => {
         let datadb = [];
         let Supdatadb = [];
         let Proddatadb = [];
         let countertoCheckAllAreDone = 0;
         const cartRefCstm = await ref(database, 'customers/');
         const cartRefSup = await ref(database, 'suppliers/');
         const cartRefProd = await ref(database, 'rates/');

         //customer data
         onValue(cartRefCstm, (snapshot) => {
            try {
               datadb = Object.values(snapshot.val());
               if (!!datadb) {
                  setCstmData(datadb);
                  //setIsLoading(false);
                  countertoCheckAllAreDone = 1;
               } else {
                  console.log('Data not found');
                  setIsLoading(false);
               }
            } catch (error) {
               console.log("no values to display: TRANSACTIONS");
               setIsLoading(false);
            }
         });

         //supplier data
         onValue(cartRefSup, (snapshot) => {
            try {
               Supdatadb = Object.values(snapshot.val());
               if (!!Supdatadb) {
                  setSuppData(Supdatadb);
                  //setIsLoading(false);
                  countertoCheckAllAreDone = 2;
               } else {
                  console.log('Data not found');
                  setIsLoading(false);
               }
            } catch (error) {
               console.log("no values to display: TRANSACTIONS");
               setIsLoading(false);
            }
         });

         //Product data
         onValue(cartRefProd, (snapshot) => {
            try {
               Proddatadb = Object.values(snapshot.val());
               if (!!Proddatadb) {
                  setProdData(Proddatadb);
                  //setIsLoading(false);
                  countertoCheckAllAreDone = 3;
                  if (countertoCheckAllAreDone === 3) {
                     setIsLoading(false);
                  }
               } else {
                  console.log('Data not found');
                  setIsLoading(false);
               }
            } catch (error) {
               console.log("no values to display: TRANSACTIONS");
               setIsLoading(false);
            }
         });
      }
      fetchData();
   }, [database])

   const handleChange = (e) => {
      setNewData({
         ...newData,
         [e.target.name]: e.target.value
      });
   }
   const handleAdd = (e) => {
      e.preventDefault();
      if(optionSelected==="none"||name==="none"||ProdName==="none"||newData.quantity===""||newData.quantity===undefined){
         return console.log("some data is to be inserted");
      }
      createTransaction(optionSelected,name,ProdName,newData.quantity);
   }

   const handleSelectOption = (e) => {
      setOptionSelected(e.target.value);
      setName("none");
      console.log("options selected", e.target.value);
      if (e.target.value === "supplier") {
         const dropdownSup = document.getElementById("supoption");
         dropdownSup.style.visibility = "visible";
         dropdownSup.selectedIndex=0;
         const dropdownCst = document.getElementById("cstmoption");
         dropdownCst.selectedIndex=0;
         dropdownCst.style.visibility="hidden";
      } else if (e.target.value === "customer") {
         const dropdownCst = document.getElementById("cstmoption");
         dropdownCst.style.visibility = "visible";
         dropdownCst.selectedIndex=0;
         const dropdownSup = document.getElementById("supoption");
         dropdownSup.selectedIndex=0;
         dropdownSup.style.visibility="hidden";
      }
   }

   const handleOption=(e)=>{
      setName(e.target.value);
   }
   const handleProdOption=(e)=>{
      setProdName(e.target.value);
   }

   if (isLoading) {
      return <p>Loading...</p>
   }
   return (
      <div className='Transactions'>
         <h2>Transactions</h2>
         <div>
            <form>{/* puschase/sell- dropdown supplier/customer-dropdown product-dropdown quantity-input field */}

               <select onChange={handleSelectOption}>
                  <option>none</option>
                  <option>supplier</option>
                  <option>customer</option>
               </select>

               <select id='cstmoption' onChange={handleOption}>
                  <option>none</option>
                  {
                     Cstmdata.map((db) => (
                        <option value={db.name} key={db.name}>{db.name}</option>
                     ))
                  }
               </select>

               <select id='supoption' onChange={handleOption}>
                  <option>none</option>
                  {
                     Suppdata.map((db) => (
                        <option value={db.name} key={db.name}>{db.name}</option>
                     ))
                  }
               </select>

               <select onChange={handleProdOption}>
                  <option>none</option>
                  {
                     Proddata.map((db) => (
                        <option value={db.name} key={db.name}>{db.name}</option>
                     ))
                  }
               </select>

               <input value={newData.quantity} onChange={handleChange} placeholder='Quantity' type='phone' name='quantity' />
               <button onClick={handleAdd}>Add Transaction</button>
            </form>
         </div>
         <table>
            <thead>
               <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>

               </tr>
            </thead>
            <tbody>
               {Suppdata.map(item => (
                  <tr key={item.name}>
                     <td>{item.id}</td>
                     <td>{item.name}</td>
                     <td>{item.phone}</td>
                  </tr>
               ))}

            </tbody>
         </table>

         <button onClick={handleUpdate}>Add/Delete/Edit Transactions</button>
      </div>
   )
}


export default Transactions