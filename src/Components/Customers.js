import './Customers.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCustomer, deleteCustomer } from '../CRUD';
import { ref, onValue, getDatabase } from 'firebase/database';


const Customers = () => {

   const database = getDatabase();
   const navigate = useNavigate();
   const [newData, setNewData] = useState({ name: "", phone: "" });
   const [isLoading, setIsLoading] = useState(true);
   const [data, setData] = useState(true);

   const handleNavigate = () => {
      navigate('/editcustomers');
   }
   useEffect(() => {
      const fetchData = async () => {
         let datadb = [];
         const cartRef = await ref(database, 'customers/');
         onValue(cartRef, (snapshot) => {
            try {
               datadb = Object.values(snapshot.val());
               if (!!datadb) {
                  console.log("customer data retrived");
                  setData(datadb);
                  setIsLoading(false);
               } else {
                  console.log('Data not found');
                  setIsLoading(false);
               }
            } catch (error) {
               console.log("no values to display: CRUD");
               setIsLoading(false);
            }
         });
      }
      fetchData();
   }, [database]);

   const handleChange = (e) => {
      setNewData({
         ...newData,
         [e.target.name]: e.target.value
      });
   }
   const handleAdd = (e) => {
      e.preventDefault();
      if (newData === undefined) {
         console.log("please enter values here : handleAdd");
      } else if (newData.name === '' || newData.phone === undefined || newData.phone === '') {
         console.log("please fill all values : handleAdd")
      } else {
         createCustomer(newData);
         setNewData({ name: "", phone: "" });
      }
   }

   const handleDelete = (e) => {
      e.preventDefault();
      if (window.confirm("confirm Delete? ") === true) {
         deleteCustomer(e.target.value);
      }
   }

   if (isLoading) {
      return <p>Loading...</p>
   }
   return (
      <div className='Customers'>
         <h2>Customers</h2>
         <form>
            <input value={newData.name} onChange={handleChange} placeholder='Name' type='text' name='name' />
            <input value={newData.phone} onChange={handleChange} placeholder='Phone no.' type='phone' name='phone' />
            <button onClick={handleAdd}>Add Customer</button>
         </form>
         <div className='CustomersTable'>
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Name</th>
                     <th>Phone</th>
                     <th>Edit</th>
                     <th>Delete</th>
                  </tr>
               </thead>
               <tbody>
                  {data.map(item => (
                     <tr key={item.name}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.phone}</td>
                        <td><button value={item.name} >edt</button></td>
                        <td><button value={item.name} onClick={handleDelete}>del</button></td>
                     </tr>
                  ))}
               </tbody>
            </table>

         </div>
         <div className='customers-operations'>
            <button onClick={handleNavigate}>Add/Delete/Edit Customer</button>
         </div>
      </div>
   )

}
export default Customers