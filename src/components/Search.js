import React, { useEffect, useState } from 'react';
import { RefreshControl, View, TextInput, FlatList, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { db } from '../../firebase';
import { collection, where, orderBy, limit, query, getDocs, startAfter } from "firebase/firestore"

const Search = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [titleResults, setTitleResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [lastVisible, setLastVisible] = useState(null); // to track pagination
    const [isLoadingMore, setIsLoadingMore] = useState(false); // to manage loading state for additional items

    const navigateToDetailScreen = (productId) => {
        navigation.navigate("detailscreen", { productId: productId });
    };

    const handleSearch = (query) => {
        const titleCaseQuery = query.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        setSearchQuery(titleCaseQuery);

        if (!titleCaseQuery.trim() || titleCaseQuery.length < 3) {
            setTitleResults([]);
            setLastVisible(null);
            return;
        }
        searchBook(titleCaseQuery, true);
    };

    const formatNumberWithDots = (number) => {
        return number
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const renderResultItem = ({ item }) => {
        return (
            <TouchableOpacity className="flex-1 m-2 bg-gray-100 rounded-lg items-center justify-center max-w-[45%] min-w-[45%] overflow-hidden" onPress={() => navigateToDetailScreen(item.id)}>
                <Image source={{ uri: item.image }} className="w-full h-40 mb-2" resizeMode='cover' />
                <Text className="font-bold text-base text-center mb-1">{item.bookName}</Text>
                <View className="bg-white p-2 rounded border border-gray-300 max-w-[80%] min-w-[80%] items-center mb-1">
                    <Text className="text-black font-medium text-xs text-center">{formatNumberWithDots(item.price)} VND</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const searchBook = async (queryInput, isNewSearch = false) => {
        if (loading || isLoadingMore) return; // Tránh gọi nhiều lần

        setLoading(isNewSearch); // Hiển thị loader cho tìm kiếm mới
        setIsLoadingMore(!isNewSearch); // Hiển thị loading more cho phân trang
        try {
            let pRef = collection(db, 'products');
            let q = query(pRef,
                where('bookName', '>=', queryInput),
                where('bookName', '<=', queryInput + '\uf8ff'),
                orderBy("bookName"),
                limit(6)
            );

            if (lastVisible && !isNewSearch) {
                q = query(q, startAfter(lastVisible)); // Phân trang dựa trên tài liệu cuối cùng
            }

            const snapshot = await getDocs(q);
            const newResults = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

            if (isNewSearch) {
                setTitleResults(newResults);
            } else {
                setTitleResults([...titleResults, ...newResults]);
            }

            setLastVisible(lastVisibleDoc); // Lưu tài liệu cuối cùng cho phân trang

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setIsLoadingMore(false);
        }
    };


    const handleLoadMore = () => {
        if (!isLoadingMore && lastVisible) {
            searchBook(searchQuery);
        }
    };

    useEffect(() => {
        if (refreshing && searchQuery) {
            searchBook(searchQuery, true); // Refresh search
        }
    }, [refreshing]);

    const renderIndependentResults = () => {
        return (
            <FlatList
                data={titleResults}
                keyExtractor={(item) => item.id}
                renderItem={renderResultItem}
                ListEmptyComponent={() => <Text className="text-center mt-5 text-gray-500">Không có kết quả</Text>}
                numColumns={2}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => setRefreshing(true)}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5} // Trigger when user scrolls to 50% from bottom
                ListFooterComponent={() => isLoadingMore ? <ActivityIndicator size="small" /> : null}
            />
        );
    };

    return (
        <View className="flex-1 pt-5 bg-white">
            <View className="flex-row items-center bg-white px-3 py-2 rounded-lg mb-3">
                <MaterialIcons name="search" size={24} color="#000" />
                <TextInput
                    className="flex-1 ml-3 text-base"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
            {loading ? <ActivityIndicator size="large" /> : renderIndependentResults()}
        </View>
    );
};

export default Search;
