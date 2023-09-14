import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      const images = await AsyncStorage.getItem("images");
      if (images === null) {
        setImages([]);
      } else {
        setImages(JSON.parse(images));
      }
      console.log(images);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const newImages = [...images, uri];
      setImages(newImages);
      await AsyncStorage.setItem("images", JSON.stringify(newImages));
    }
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {images.map((image, index) => {
          return (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
