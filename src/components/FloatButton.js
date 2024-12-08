import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, TouchableOpacity, Image } from 'react-native';


const FloatButton = ( {onPress} ) => {
    const pan = useRef(new Animated.ValueXY()).current;

    // PanResponder để xử lý các cử chỉ kéo
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // Kích hoạt nếu phát hiện ngón tay di chuyển
                return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
            },
            onPanResponderGrant: () => {
                pan.setOffset({ x: pan.x._value, y: pan.y._value });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (evt, gestureState) => {
                const finalX = 5;
                const finalY = gestureState.moveY > 400 ? 60 : gestureState.moveY;

                Animated.spring(pan, {
                    toValue: { x: finalX, y: finalY },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                pan.getLayout(),
                styles.floatingButton
            ]}
        >
            <TouchableOpacity onPress={() => onPress()}>
                <Image source={require('../../assets/Logo.png')} style={styles.icon} />
            </TouchableOpacity>
        </Animated.View >
    );
};

export default FloatButton;

const styles = StyleSheet.create({
    floatingButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007BFF',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 100,
        resizeMode: 'cover'
    }
});

