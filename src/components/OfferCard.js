import React from "react"
import { View, Text, Pressable, Image } from "react-native"
import cover from "../../assets/bookCover/book_cover.png"
const OfferCard = () =>{
    return(
        <View className="flex-row max-w-[280px] py-2 mr-6 max-h-[160px] overflow-hidden bg-[#c7c7c7] rounded-2xl">
            <View className="px-4 py-2">
                <Text className="font-extrabold text-2xl">100% Off</Text>
                <Text className="text-lg">All everything</Text>
                <Text className="text-xs my-2">With code: SachYnghia</Text>

                <Pressable className="bg-black w-20 rounded-2xl">
                    <Text className="text-white text-xs font-semibold mx-3 my-1">Get now!!!</Text>
                </Pressable>
            </View>
            <View>
                <Image source={cover} className="object-contain h-[150px] w-[95px] content-center"></Image>
            </View>
        </View>
    )
}

export default OfferCard
