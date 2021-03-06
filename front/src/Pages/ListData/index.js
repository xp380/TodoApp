import React from "react";
import Todo from "./Todo";
import "./ListData.css";

const ListData = (props) => {
  const todoList = props;
  console.log("dataList", props.removeTodoListProp);
  const renderedList = todoList.list.map((item) => (
    <Todo
      title={item.title}
      removeTodoItemProp={(e) => props.removeTodoListProp(item._id)}
      editTodoItemProp={(updatedItem) =>
        props.editTodoListProp(item._id, updatedItem)
      }
      key={item.title}
      description={item.description}
      statut={item.statut}
    />
  ));
  return (
    <div>
      <h1 className="titleListData">Ma Liste</h1>
      {renderedList}
    </div>
  );
};

export default ListData;
