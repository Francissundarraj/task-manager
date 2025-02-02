import React, { useContext,useState } from 'react'

import { TaskContext } from '../Dashboard'
import axios from "axios"
import { getAuth } from 'firebase/auth'
import close from "../../assets/close1.png"

const PopupForm = () => {

  const { tasks, setTasks, formData, setFormData,  showForm, setShowForm ,count, setCount } = useContext(TaskContext)
  
  

  if (!setShowForm) {
    console.error("setShowForm is undefined. Ensure TaskContext.Provider is set correctly.");
}


  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)
  const increaseCounter = () => setCount(count + 1)
  const decreaseCountet = () => setCount(count - 1)

  const handleInputChange = (e) => {

    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData, [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.taskName || !formData.description || !formData.date || !formData.priority || !formData.status) {
      alert("Please fill out all fields!");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser ;

      const token = await user.getIdToken();

      {
        

        const newTask = {  ...formData, createdDate: new Date(), userId: user.uid     }
      const response =await axios.post(import.meta.env.VITE_ADD_TASKS_KEY, { newtask: newTask  },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

       if (response.status === 201) {
            // Update the local state with the new task including userId
            setTasks((prevTasks) => [...prevTasks, response.data]); // Use the response data
        }

        // Reset form data
        setFormData({ taskName: "", description: "", date: "", priority: "", status: "" });
        closeForm();
      }

      
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("There was an error while creating/updating the task. Please try again.");
    }
  };

 

  return (
    <div>

      <div><button onClick={openForm} type='submit' className='bg-[#b3389e] px-4 py-2 rounded-3xl'>Add a new Tasks</button> </div>

      {
        showForm && (
          <div className="popup-overlay fixed top-40 left-20 w-96 md:top-[13%] md:left-[40%] md:w-[500px]  ">
            <form className='p-10' onSubmit={handleSubmit}>

              <div  >
                <img onClick={closeForm} className='absolute h-8 top-2 right-2' src={close} alt="" />
              </div>

              <div className='my-5'><label className='block'>Title</label>
                <input className='w-full rounded-xl bg-[#fdfeff] p-1 transition duration-500 ease-in-out border-2 
                border-transparent hover:border-green-500 focus:outline-none' type="text" name='taskName'
                  value={formData.taskName} onChange={handleInputChange} />
              </div>

              <div className='my-5'><label className='block'>Description</label> <textarea type="text" name='description' onChange={handleInputChange}
                value={formData.description} className='w-full rounded-xl bg-[#fdfeff] p-5 transition duration-500 ease-in-out
               border-2 border-transparent hover:border-green-500 focus:outline-none' /> </div>

              <div className='my-5'> <label className='block' >Select Priority</label> <select className='w-full rounded-xl bg-[#fdfeff] p-1
               transition duration-500 ease-in-out border-2 border-transparent hover:border-green-500 focus:outline-none'
                name="priority" value={formData.priority} onChange={handleInputChange} id="priority">
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option></select>
              </div>

              <div className='my-5'><label className='block'> Due Date</label> <input type="date" name='date' onChange={handleInputChange}
                value={formData.date} className='w-full rounded-xl bg-[#fdfeff] p-1 transition duration-500 ease-in-out 
              border-2 border-transparent hover:border-green-500 focus:outline-none' /> </div>

              <div className='my-5'> <label className='block'> Task Status</label> <select value={formData.status}
                onChange={handleInputChange} name="status" id="status" className='w-full rounded-xl
                bg-[#fdfeff] p-1 transition duration-500 ease-in-out border-2 border-transparent
                 hover:border-green-500 focus:outline-none'>
                <option value="">Select</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Planned">Planned</option></select>
              </div>

              <div className='flex gap-5'>
                <button className='bg-[#2bb866] w-full p-2 rounded-xl ' type='submit'>Create Task</button>

              </div>

            </form>

          </div>
        )
      }

    </div>
  )
}

export default PopupForm
