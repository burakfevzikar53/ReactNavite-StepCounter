import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ProgressBarAndroid } from "react-native";
import { Pedometer } from "expo-sensors";

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [stepCount, setStepCount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10000); 

  useEffect(() => {
    const checkPedometerAvailability = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(available ? "available" : "not available");
    };

    const subscribe = () => {
      return Pedometer.watchStepCount((result) => {
        setStepCount(result.steps);
      });
    };

    checkPedometerAvailability();
    const subscription = subscribe();
    return () => subscription && subscription.remove();
  }, []);

  const progress = Math.min(stepCount / dailyGoal, 1); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Counter</Text>
      {isPedometerAvailable === "available" ? (
        <>
          <Text style={styles.steps}>Steps: {stepCount}</Text>
          <Text style={styles.goal}>
            Goal: {stepCount}/{dailyGoal}
          </Text>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress}
            color="#007b5e"
          />
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setStepCount(0)}
          >
            <Text style={styles.resetText}>Reset Steps</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>Pedometer is not available on this device.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  steps: {
    fontSize: 18,
    marginBottom: 10,
  },
  goal: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007b5e",
    borderRadius: 5,
  },
  resetText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
