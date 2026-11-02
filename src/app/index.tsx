
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Activity = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export default function HomeScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [screen, setScreen] = useState("home");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const data = await AsyncStorage.getItem("activities");

    if (data != null) {
      setActivities(JSON.parse(data));
    }
  };

  const saveActivity = async () => {
    if (title.trim() === "") {
      Alert.alert("Napaka", "Vnesi ime aktivnosti.");
      return;
    }

    let newActivities = [...activities];

    if (editId !== "") {
      newActivities = newActivities.map((item) =>
        item.id === editId
          ? { ...item, title: title, description: description }
          : item
      );
    } else {
      const newActivity = {
        id: Date.now().toString(),
        title: title,
        description: description,
        completed: false,
      };

      newActivities.push(newActivity);
    }

    setActivities(newActivities);
    await AsyncStorage.setItem("activities", JSON.stringify(newActivities));

    setTitle("");
    setDescription("");
    setEditId("");
    setScreen("home");
  };

  const deleteActivity = async (id: string) => {
    const newActivities = activities.filter((item) => item.id !== id);

    setActivities(newActivities);
    await AsyncStorage.setItem("activities", JSON.stringify(newActivities));
  };

  const editActivity = (item: Activity) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditId(item.id);
    setScreen("form");
  };

  const toggleActivity = async (id: string) => {
    const newActivities = activities.map((item) =>
      item.id === id
        ? { ...item, completed: !item.completed }
        : item
    );

    setActivities(newActivities);
    await AsyncStorage.setItem("activities", JSON.stringify(newActivities));
  };

  const openForm = () => {
    setTitle("");
    setDescription("");
    setEditId("");
    setScreen("form");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {screen === "home" ? (
        <View>
          <Text style={styles.title}>School Planner</Text>
          <Text style={styles.subtitle}>Organiziraj svoje šolsko delo</Text>

          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Text style={styles.cardNumber}>{activities.length}</Text>
              <Text style={styles.cardText}>Vse aktivnosti</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardNumber}>
                {activities.filter((item) => item.completed).length}
              </Text>
              <Text style={styles.cardText}>Zaključene aktivnosti</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={openForm}>
            <Text style={styles.buttonText}>+ Dodaj aktivnost</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Moje aktivnosti</Text>

          {activities.length === 0 ? (
            <Text style={styles.emptyText}>Trenutno nimaš aktivnosti.</Text>
          ) : (
            activities.map((item) => (
              <View style={styles.activityCard} key={item.id}>
                <Text
                  style={[
                    styles.activityTitle,
                    item.completed && styles.completedText,
                  ]}
                >
                  {item.title}
                </Text>

                <Text style={styles.activityDescription}>
                  {item.description}
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => toggleActivity(item.id)}
                  >
                    <Text style={styles.smallButtonText}>
                      {item.completed ? "Razveljavi" : "Zaključi"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => editActivity(item)}
                  >
                    <Text style={styles.smallButtonText}>Uredi</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteActivity(item.id)}
                  >
                    <Text style={styles.deleteText}>Izbriši</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.title}>
            {editId === "" ? "Nova aktivnost" : "Uredi aktivnost"}
          </Text>

          <Text style={styles.label}>Ime aktivnosti</Text>
          <TextInput
            style={styles.input}
            placeholder="Npr. Matematika"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Opis aktivnosti</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Napiši nekaj o aktivnosti..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TouchableOpacity style={styles.addButton} onPress={saveActivity}>
            <Text style={styles.buttonText}>Shrani</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen("home")}
          >
            <Text style={styles.backButtonText}>Nazaj</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#2265e2",
    padding: 20,
    paddingTop: 60,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "white",
    fontSize: 16,
    marginTop: 8,
  },

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 25,
  },

  card: {
    flex: 1,
    minWidth: 130,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },

  cardNumber: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2265e2",
  },

  cardText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },

  addButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#2265e2",
    fontSize: 16,
    fontWeight: "bold",
  },

  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
  },

  emptyText: {
    color: "white",
    fontSize: 16,
  },

  activityCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
  },

  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },

  activityDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },

  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 15,
  },

  smallButton: {
    backgroundColor: "#2265e2",
    padding: 9,
    borderRadius: 7,
  },

  smallButtonText: {
    color: "white",
    fontSize: 12,
  },

  deleteButton: {
    backgroundColor: "#eeeeee",
    padding: 9,
    borderRadius: 7,
  },

  deleteText: {
    color: "#d32f2f",
    fontSize: 12,
  },

  label: {
    color: "white",
    fontSize: 16,
    marginTop: 25,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
  },

  descriptionInput: {
    height: 110,
    textAlignVertical: "top",
  },

  backButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },

  backButtonText: {
    color: "white",
    fontSize: 16,
  },
});
