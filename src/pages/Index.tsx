"use client";

import React, { useState, useEffect } from 'react';
import TodoInput from '@/components/TodoInput';
import TodoItem from '@/components/TodoItem';
import TodoFilters, { FilterType } from '@/components/TodoFilters';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showError } from '@/utils/toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    showError('Task removed');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Tasks<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Stay organized and focused on what matters.
          </p>
        </header>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-indigo-100/50 border border-white">
          <TodoInput onAdd={addTodo} />

          <div className="space-y-1 min-h-[300px]">
            {filteredTodos.length > 0 ? (
              filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm">Time to add some goals!</p>
              </div>
            )}
          </div>

          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
          />
        </div>

        <footer className="mt-12">
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;