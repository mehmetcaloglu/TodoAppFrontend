"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
// take it fron env
const API_URL = 'http://127.0.0.1:5000/api/todo';


const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filePath, setFilePath] = useState("")
  const token = Cookies.get('token');
  const router = useRouter();

  useEffect(() => {
    fetchTodos();
  }, [page, search]);

  const fetchTodos = async () => {
    try {
      debugger
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tag: search, 
          page: page, 
        },
      });
      debugger
      console.log('response', response.data.todos);
      setTodos(response.data.todos);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Error fetching todos');
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      tags: '',
      image: null,
      file: null,
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('tags', values.tags);
      if (values.image) formData.append('image', values.image);
      if (values.file) formData.append('file', values.file);

      try {
        if (selectedTodo) {
          await axios.put(`${API_URL}/${selectedTodo._id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          toast.success('Todo updated successfully');
        } else {
          await axios.post(API_URL, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          toast.success('Todo added successfully');
        }
        fetchTodos();
        formik.resetForm();
        setSelectedTodo(null);
      } catch (error) {
        console.error('Error submitting todo:', error);
        toast.error('Error submitting todo');
      }
    },
  });

  const handleImageChange = (event) => {
    formik.setFieldValue('image', event.currentTarget.files[0]);
  };

  const handleFileChange = (event) => {
    formik.setFieldValue('file', event.currentTarget.files[0]);
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    formik.setValues({
      title: todo.title,
      description: todo.description,
      tags: todo.tags.join(', '),
      image: null,
      file: null,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTodos();
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Error deleting todo');
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };


  const handleDownload = (fileName) => {
    // download fron axios  
    axios.get(`http://127.0.0.1:5000/download?filename=${fileName}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
};

  
  
  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">To-Do App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by tag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 mb-2 border border-gray-300 rounded bg-gray-100 focus:bg-white focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className="mb-4">
        <div className="mb-2">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-2">
          <textarea
            name="description"
            placeholder="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>
        <div className="mb-2">
          <input
            name="tags"
            type="text"
            placeholder="Tags (comma separated)"
            value={formik.values.tags}
            onChange={formik.handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Select Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Select File:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          {selectedTodo ? 'Update' : 'Add'} To-Do
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="p-4 border border-gray-300 rounded mb-2 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{todo.title}</h3>
              <p>{todo.description}</p>
              <p>Tags: {todo.tags.join(', ')}</p>
              {todo.imageUrl && (
                <Image src={todo.imageUrl} width={"100"} height={"100"} alt="thumbnail" className="w-20 h-20 mt-2" />
              )}
              {todo.filePath && (
                <button onClick={() => handleDownload(todo.fileName)} className="text-blue-500 underline">
                  Download File
                </button>
                
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(todo)}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`p-2 rounded ${page <= 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className={`p-2 rounded ${page >= totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TodoApp;
