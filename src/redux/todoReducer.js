const initialState = {
    todos: [],
  };
  
  const todoReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SAVE_TODO':
        return {
            ...state,
            todos: [...state.todos,action.payload]
        };

   
      case 'DELETE_ITEM':
        const {index}= action.payload
        return {
            ...state,
            todos: state.todos.filter((todo) => todo.index !== index)
             
        };
      // Handle other actions here
      default:
        return state;
    }
  };
  
  export default todoReducer;