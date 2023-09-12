export const addNoteAction = (todo) => ({
    type: 'SAVE_TODO',
    payload: todo,
  });

  export const deleteAction = (index)=> ({
    type: 'DELETE_ITEM',
    payload: index,
  });
  
//   export const restoreItem = (todoId) => ({
//     type: 'RESTORE_ITEM',
//     payload: todoId,
//   });
//   export const trashAll = (todoId) => ({
//     type: 'TRASH_ITEM',
//     payload: todoId,
//   });
//   export const reStoreAll = (todoId) => ({
//     type: 'RESTORE_ALL_ITEM',
//     payload: todoId,
//   });
//   export const deleteRestoreall = (todoId) => ({
//     type: 'DELETE_RESTORE_ITEM',
//     payload: todoId,
//   });