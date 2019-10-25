import React, { Component } from "react";

import AppHeader from "./AppHeader/AppHeader";
import SearchPanel from "./SearchPanel/SearchPanel";
import TodoList from "./TodoList/TodoList";
import ItemStatusFilter from "./ItemStatusFilter/ItemStatusFilter";
import ItemAddForm from "./ItemAddForm/ItemAddForm";

import "./App.css";

export default class App extends Component {
  maxId = 100;

  state = {
    todoData: [
      this.createItem("drink"),
      this.createItem("fuck"),
      this.createItem("ypur mun"),
    ],
  };

  createItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++,
    };
  }

  addItem = text => {
    this.setState(({ todoData }) => {
      const item = this.createItem(text);
      const newArray = [...todoData, item];
      return {
        todoData: newArray,
      };
    });
  };

  deleteItem = id => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex(el => el.id === id);

      ///we don't use "todoData.splice" because it will change state
      ///like "this.state.todoData = smth"
      ///then we need to create new Array without element, which we will delete
      ///this is react's rule: don't change state directly

      const before = todoData.slice(0, idx);
      const after = todoData.slice(idx + 1);
      const newArray = [...before, ...after];

      return {
        todoData: newArray,
      };
    });
  };

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex(el => el.id === id);

    const oldItem = arr[idx];
    const newItem = { ...oldItem, [propName]: !oldItem[propName] };

    return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
  }

  onToggleImportant = id => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, "important"),
      };
    });
  };

  onToggleDone = id => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, "done"),
      };
    });
  };

  render() {
    const { todoData } = this.state;
    const doneCount = todoData.filter(el => el.done).length;

    const todoCount = todoData.length - doneCount;

    return (
      <div className="todo-app">
        <AppHeader todo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel />
          <ItemStatusFilter />
        </div>

        <TodoList
          todos={todoData}
          onDeleted={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
        />

        <ItemAddForm onAddItem={this.addItem} />
      </div>
    );
  }
}
