import * as SQLite from 'expo-sqlite';
import { Image } from 'expo-image';
import { Button, FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCreateMergeableStore, useCreatePersister, useProvideStore, useSortedRowIds, useStore } from 'tinybase/ui-react';
import { createMergeableStore } from 'tinybase/mergeable-store';
import {createExpoSqlitePersister} from 'tinybase/persisters/persister-expo-sqlite';

const TABLE_NAME = "tasks";
const TEXT_CELL = "text";
const DONE_CELL = "done";

function AddTask() {
  const store = useStore(TABLE_NAME);

  const handleAddTask = () => { 
    store?.addRow(TABLE_NAME, {
      [TEXT_CELL]: getRandomTask(),
      [DONE_CELL]: false,
    })
  }
  return <Button title='Add Task' onPress={handleAddTask}/>
}

function TaskList() {
  const store = useStore(TABLE_NAME);
  console.log(store?.getRowIds(TABLE_NAME));
  return (
    <FlatList
      data={store?.getRowIds(TABLE_NAME)}
      renderItem={({ item: id }) => {
        const task = store?.getRow(TABLE_NAME, id);
        return (
          <Pressable onPress={() => store?.delRow(TABLE_NAME, id)}>
            <ThemedText>{ id } {task?.[TEXT_CELL]}</ThemedText>
          </Pressable>
        )
      }}
    />
  );
}
export default function HomeScreen() {

  const store = useCreateMergeableStore(() => createMergeableStore());
  useCreatePersister(store, (store) => createExpoSqlitePersister(store, SQLite.openDatabaseSync("tasks.db")),
  [],
    (persister) => persister.load().then(persister.startAutoSave),
  );
  useProvideStore(TABLE_NAME, store);
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50}}>
      <ThemedText type="title">Welcome!</ThemedText>
      <AddTask />
      <TaskList />
    </View>
  );
}

const generateRandomId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const getRandomTask = () => {
  const tasks = [
    "📚 Learn React Native",
    "📱 Build a mobile app",
    "ℹ️ Contribute to open source",
    "🗺️ Explore new technologies",
    "🧑🏻‍💻 Write clean code",
  ];
  return tasks[Math.floor(Math.random() * tasks.length)];
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
