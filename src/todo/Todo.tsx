/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon1 from 'react-native-vector-icons/Ionicons';
import moment, {isDate} from 'moment';

import {
  ScrollView,
  ToastAndroid,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Dimensions,
  View,
  FlatList,
  useAnimatedValue,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addNoteAction, deleteAction} from '../redux/todoActions';

const deviceHeight = Dimensions.get('screen').height;
const deviceWeight = Dimensions.get('screen').width;
const NOTES_KEY = 'NOTES';
const TRASH_KEY = 'TRASH';
type noteType = {
  text: string;
  date: string;
  //  index: number;
};
type todoListType = {
  todos: noteType[];
};
type RootState = {
  todo: todoListType;
  // Define your state properties here
  todos: noteType[];
};
const Todo = () => {
  const [note, setNote] = useState<Array<noteType>>([]);
  const [text, setText] = useState('');
  const [date, setDate] = useState([new Date().toLocaleString()]);
  const [trash, setTrash] = useState<Array<noteType>>([]);

  const dispatch = useDispatch();

  const data = useSelector((state: RootState) => state);

  console.log(data.todo, 'data');

    useEffect(() => {
      getnotes();

    }, [])

  useEffect(() => {

    if(note?.length !==0||trash?.length!==0){
      saveAsync()
    }

  }, [note,trash])

  const addNote = () => {
    // console.log(text);
    if (text?.length !== 0) {
      let notecopy = note;
      let dateValue = new Date().toLocaleString();
      let noteObj = {
        text: text,
        date: dateValue,
      };
      notecopy.push(noteObj);
      //  notecopy.unshift(text);
      setNote(notecopy);
      setText('');
      setDate(date);
      //  dispatch(addNoteAction(noteObj))
      // console.log(note);
    } else {
      Alert.alert('plz  enter note ');
    }
  };
  const okDelete = (index: number) => {
    let newtrash = trash;
    console.log(index);
    newtrash.push(note[index]);
    setTrash(newtrash);
    // dispatch(deleteAction(index))
    // let newnote = note.filter((item, i) => i !== index);
    // setNote(newnote);

    const updatedItems = [...note];
    updatedItems.splice(index, 1);
    setNote(updatedItems);
    console.log('setDeletenote', trash);
    ToastAndroid.show('Item Deleted Successfully !', ToastAndroid.SHORT);
  };

  const delteItem = (index: number) => {
    Alert.alert('Delete notes', 'Sure want to delete this note', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => okDelete(index)},
    ]);
  };

  const handleRestoreItem = (index: number) => {
    // note.push(trash[index])
    setNote([...note, trash[index]]);
    let newrestore = [...trash];
    console.log('index', newrestore);
    newrestore.splice(index, 1);
    setTrash([...newrestore]);

    ToastAndroid.show('Item Restored Successfully !', ToastAndroid.SHORT);
  };
  const saveAsync = async ()=>{
    await AsyncStorage.setItem(NOTES_KEY,JSON.stringify(note))

    await AsyncStorage.setItem(TRASH_KEY,JSON.stringify(trash))
  }

  const getnotes =async()=>{
    let asyncNote = await AsyncStorage.getItem(NOTES_KEY)
    asyncNote=asyncNote?JSON.parse(asyncNote):[]
    let asyncTrash = await AsyncStorage.getItem(TRASH_KEY)
    asyncTrash=asyncTrash?JSON.parse(asyncTrash):[]
    // console.log(asyncNote,"   asyncNoote");
    // console.log(asyncTrash,"asycTrash");

    setNote(asyncNote!);
    setTrash(asyncTrash!);

  }

  const deleteRestoreall = () => {
    setTrash([]);
   AsyncStorage.removeItem(TRASH_KEY)
    ToastAndroid.show('parmanent deleted Successfully !', ToastAndroid.SHORT);
  };
  const trashAll = () => {
    setNote([]);
    setTrash([...trash, ...note]);
    ToastAndroid.show('Move items in to Trash  !', ToastAndroid.SHORT);
  };
  const reStoreall = () => {
    setTrash([]);
    setNote([...note, ...trash]);
    ToastAndroid.show('restore  all items to the list !', ToastAndroid.SHORT);
  };

  const deleteRestoreItem = (index: any) => {
    let updaterestore = [...trash];
    updaterestore.splice(index, 1);
    setTrash([...updaterestore]);
  };
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.heading}> Todo List</Text>
      <View style={styles.todolist}>
        <TextInput
          editable
          multiline
          numberOfLines={1.7}
          maxLength={150}
          value={text}
          onChangeText={setText}
          // onChangeText={(e)=>setText(e)}
          style={styles.placeholder}
          placeholder="Enter task"
        />

        <TouchableOpacity onPress={addNote}>
          <View>
            <Icon1 name="add-circle-sharp" size={55} color="#900"></Icon1>
          </View>
        </TouchableOpacity>
      </View>

      {note?.length === 0 ? (
        <Text style={styles.textlist}> Nothing added yet in the List</Text>
      ) : (
        <View style={{height: '50%', width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 30,
              width: '95%',
            }}>
            <Text style={{fontSize: 18, color: '#900'}}> Trash All</Text>
            <TouchableOpacity>
              <Icon
                name="delete-forever"
                size={35}
                color="#900"
                onPress={() => trashAll()}
              />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.notes}>
            {note?.map((note, index) => (
              <View key={index} style={styles.list}>
                <View>
                  <Text> {note.text}</Text>
                </View>

                <View style={styles.icondate}>
                  <TouchableOpacity>
                    <Icon
                      name="delete"
                      size={25}
                      color="#900"
                      onPress={() => delteItem(index)}
                    />
                  </TouchableOpacity>

                  <View style={styles.noteview}>
                    <Text style={{color: 'blue'}}> {note.date}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View
        style={{
          height: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          flex: 1,
        }}>
        {trash.length != 0 && (
          <View style={styles.trashlist}>
            <Text style={{fontSize: 20, color: 'black'}}>
              Deleted item list
            </Text>
            <View>
              <TouchableOpacity onPress={() => deleteRestoreall()}>
                <Text style={{fontSize: 14, color: '#900'}}>Deleted All</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => reStoreall()}>
                <Text style={{fontSize: 14, color: 'blue'}}>Restore All</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            paddingHorizontal: 15,
            marginVertical: 5,
          }}>
          <FlatList
            data={trash}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <View
                style={{
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: 'black',
                  padding: 10,
                  width: '100%',
                  flexDirection: 'row',
                  marginBottom:15,
                }}>
                <Text style={{fontSize: 15, color: 'blue', width: '80%'}}>
                  {item.text}
                </Text>
                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <TouchableOpacity onPress={() => handleRestoreItem(index)}>
                    <Icon name="restore" size={25} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() => deleteRestoreItem(index)}>
                    <Icon name="delete" size={25} color="#900" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            //  keyExtractor={( index) => index.toString()}
          />
        </View>

       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: '#9fd4ab',
  },

  heading: {
    fontSize: 40,
    marginVertical: 10,
    alignSelf: 'center',
    color: 'black',
  },
  todolist: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    alignItems: 'center',
    
    padding: 5,
    width: '100%',
  },
  placeholder: {
    backgroundColor: 'lightblue',
    // width: 3 * (deviceWeight / 4),
    width: '75%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 15,
  },
  textlist: {
    color: 'blue',
    margin: 10,
    fontSize: 20,
  },
  noteview: {
    width: '90%',
    flexDirection: 'row',
    
    justifyContent: 'flex-end',
  },
  notes: {
    marginHorizontal: 15,
    alignContent: 'center',
    width: '100%',
  },
  trashlist: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  icondate: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  list: {
    width: '90%',
    borderWidth: 1,
    marginBottom: 15,
    borderColor: 'black',
    backgroundColor: 'lightblue',
    padding: 1,
  },
});

export default Todo;
