import React, { useState, useRef, useEffect } from "react";
import { View, Text, Animated, Image, StyleSheet, TouchableOpacity, Easing, PanResponder } from "react-native";
import book1 from '../../assets/bookCover/book1.jpg';
import book2 from '../../assets/bookCover/book2.jpg';
import book3 from '../../assets/bookCover/book3.jpg';
import book4 from '../../assets/bookCover/book4.jpg';
import book5 from '../../assets/bookCover/book5.jpg';

const OfferCard = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(2);

    const opacityValue = useRef(new Animated.Value(1)).current;
    const scaleValue = useRef(new Animated.Value(1.3)).current;
    const translateXValue = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        setInterval(() => {
            animateProperties('next')
        }, [3000])
    }, [])

    const goToScreen = (productId) => {
        navigation.navigate("detailscreen", { productId: productId });
    };

    const minimizeScrollFuncName = (name) => {
        return name.length > 25 ? name.substring(0, 25) + '...' : name;

    }

    const animateProperties = (direction) => {
        Animated.parallel([
            Animated.timing(opacityValue, {
                toValue: 0.3,
                duration: 250,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.cubic),
            }),
            Animated.timing(scaleValue, {
                toValue: 0.5,
                duration: 250,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.cubic),
            }),
            Animated.timing(translateXValue, {
                toValue: direction === 'next' ? 30 : 70,
                duration: 250,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.cubic),
            }),
        ]).start(() => {
            setCurrentIndex((prevIndex) =>
                direction === 'next'
                    ? prevIndex === images.length - 1
                        ? 0
                        : prevIndex + 1
                    : prevIndex === 0
                        ? images.length - 1
                        : prevIndex - 1
            );
            resetValues();
        });
    };

    const resetValues = () => {
        Animated.parallel([
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.cubic),
            }),
            Animated.timing(scaleValue, {
                toValue: 1.3,
                duration: 250,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.cubic),
            }),
            Animated.timing(translateXValue, {
                toValue: 50,
                duration: 250,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.cubic),
            }),
        ]).start();
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dx > 50) {
                // Swipe right (previous)
                animateProperties('previous');
            } else if (gestureState.dx < -50) {
                // Swipe left (next)
                animateProperties('next');
            }
        }
    });

    const images = [
        { id: 'uPLCWlSnqdXI8LjCT75k', source: book1, name: 'Php, Mysql, Javascript & Html5 All-In-One For Dummies' },
        { id: 'A7umBIS365ss5MIx8CYq', source: book2, name: 'Ngữ Pháp Tiếng  Anh Ôn Thi Toeic' },
        { id: 'LYKOpK8n40cAeL7Qscyj', source: book3, name: 'Bí Quyết Thành Công 100 Thương Hiệu Hàng Đầu Thế Giới' },
        { id: 'lMbwqepzXvuf5zRSMLFW', source: book4, name: 'Học Chơi Cờ Tướng' },
        { id: 'tnCAuRcvjaR7oKaP72CP', source: book5, name: 'Định Mức Dự Toán Xây Dựng Công Trình - Phần Lắp Đặt' },
    ];

    return (
        <View style={styles.mainContainer} {...panResponder.panHandlers}>
            <Animated.View
                style={{
                    flexDirection: 'row',
                    width: '65%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ translateX: translateXValue }],
                }}>
                {currentIndex > 0 ? (
                    <Animated.Image
                        source={images[currentIndex - 1].source}
                        style={[
                            styles.image,
                            { opacity: 0.3, transform: [{ scale: 0.5 }] },
                        ]}
                        blurRadius={5}
                    />
                ) : (
                    <Animated.Image
                        source={images[images.length - 1].source}
                        style={[
                            styles.image,
                            { opacity: 0.3, transform: [{ scale: 0.5 }] },
                        ]}
                        blurRadius={5}
                    />
                )}
                <TouchableOpacity
                    onPress={() => goToScreen(images[currentIndex].id)}
                    style={{ alignItems: 'center', minWidth: 100 }}>
                    <Animated.Image
                        source={images[currentIndex].source}
                        style={[
                            styles.image,
                            {
                                opacity: opacityValue,
                                transform: [{ scale: scaleValue }],
                            },
                        ]}
                    />
                    <Animated.Text style={[styles.scrollFuncName, { opacity: opacityValue, marginBottom: -35, marginTop: 35 }]}>
                        {minimizeScrollFuncName(images[currentIndex].name)}
                    </Animated.Text>
                </TouchableOpacity>
                {currentIndex < images.length - 1 ? (
                    <Animated.Image
                        source={images[currentIndex + 1].source}
                        style={[
                            styles.image,
                            { opacity: 0.3, transform: [{ scale: 0.5 }] },
                        ]}
                        blurRadius={5}
                    />
                ) : (
                    <Animated.Image
                        source={images[0].source}
                        style={[
                            styles.image,
                            { opacity: 0.3, transform: [{ scale: 0.5 }] },
                        ]}
                        blurRadius={5}
                    />
                )}
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'visible',
        alignItems:'center',
        width:'90%',
    },
    image: {
        width:140,
        height: 140,
        resizeMode: 'contain',
        marginHorizontal: 2,
    },
    scrollFuncName: {
        fontSize: 14,
        color: '#000',
        maxWidth:100,
        textAlign:'center'
    }
});

export default OfferCard;
