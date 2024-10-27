import React from "react";
import { Image, Text, View } from "react-native";

const NewArrivalsCard = ({ title, image, price, bookName }) => {
  const shortenedBookName = bookName.length > 15 ? bookName.substring(0, 15) + '...' : bookName;

  return (
    <View className="max-w-[150px] justify-center items-center overflow-hidden mr-6">
      <Image source={{ uri: image }} className="rounded-x1 h-36 w-32" />
      <View className="mt-2 justify-center items-center">
        <Text className="font-bold max-w-4">{shortenedBookName}</Text>
        <Text className="text-xs">{price} vnd</Text>
      </View>
    </View>
  );
};

export default NewArrivalsCard;
