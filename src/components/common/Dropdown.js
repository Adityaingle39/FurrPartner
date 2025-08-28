import React, { useState, useEffect, useRef } from 'react';
import {
    Platform,
    TouchableOpacity,
    Image,
    StyleSheet,
    Text,
    SafeAreaView,
    Dimensions,
    FlatList,
    ScrollView,
    View,
    Pressable,
    useColorScheme,
} from 'react-native';
import ActionSheet, {SheetProps, ActionSheetRef} from 'react-native-actions-sheet';
import { useFocusEffect } from '@react-navigation/native';
import {
    Button,
    RadioButton,
    Divider,
    IconButton,
    Searchbar,
    TextInput,
    SegmentedButtons,
    ProgressBar,
    useTheme,
} from 'react-native-paper';

import { btn, colors, inputText } from '../../utils/styles/gobalstyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RenderOptions = ({items, selectedValue}) => {
    const theme = useTheme();
    return (items.map((item, index) => <RadioButton.Item mode="android" key={`dropdown-option-${item.id}`} label={item.title} value={item} theme={theme} status={(selectedValue && selectedValue.id === item.id) ? 'checked' : 'unchecked'} />));
}

const Dropdown = ({
    sheetId,
    payload,
    label,
    value,
    icon,
    inputLabel,
    selectType,
    placeholder,
    selected,
    disabled,
}) => {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const actionSheetRef = useRef(null);
    const { width, height } = Dimensions.get('window');

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState(payload?.options);
    const [items, setItems] = useState([]);
    const [selectedValue, setSelectedValue] = useState(selected);
    const [checkedValue, setCheckedValue] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedObject, setSelectedObject] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const onChangeSearch = query => {
        setSearchQuery(query);
        if (query.length >= 3) {
            const filteredItems = options.filter(i => i[payload?.label]?.toLowerCase()?.includes(query?.toLowerCase()));
            setSearchResult(filteredItems);
        } else {
            setSearchResult([]);
        }
    };

    const onCancel = () => {
        actionSheetRef.current?.hide();
        setSearchQuery('');
    };

    const onSelected = () => {
        if ("onChange" in payload && typeof payload.onChange == 'function' && checkedValue !== null && checkedValue !== "") {
            payload.onChange(checkedValue);
            setSelectedObject(checkedValue)
            setCheckedValue(null);
            setSearchQuery('');
            actionSheetRef.current?.hide();
        } else {
            onCancel();
        }
    };

    const onOptionSelected = value => {
        // setCheckedValue(value);
    };

    const onSearchedOptionSelected = (value) => {
        // setCheckedValue(value);
    }

    const onClickInputEvent = async () => {
        setIsLoading(true);
        await actionSheetRef.current?.show();
        const selectedObject = options.find(i => i[label] === selected);
        setCheckedValue(selectedObject);
    };

    useEffect(() => {
        setItems(options && options.length > 0 ? options : []);
        if (payload?.selected) {
            setCheckedValue(payload?.selected);
        }
    }, [options]);

    return (
        <ActionSheet
            ref={actionSheetRef}
            // onOpen={(data) => setIsLoading(false)}
            id={sheetId}
            containerStyle={{ paddingHorizontal: 15, marginBottom: 0, backgroundColor: colorScheme == 'dark' ? theme.colors.background : theme.colors.surfaceVariant }}
            useBottomSafeAreaPadding={true}
            drawUnderStatusBar={true}
            gestureEnabled={true}
            safeAreaInsets={useSafeAreaInsets()}
            indicatorStyle={{
                width: 100,
                backgroundColor: theme.colors.outline
            }}
        >
            <View style={{ maxHeight: (height / 100) * 60, minHeight: width / 2.5 }}>
                <ScrollView style={{flex: 1 }}>
                    <View style={{ backgroundColor: colorScheme == 'dark' ? theme.colors.surface : theme.colors.surfaceVariant }}>
                        {items.length > 30 || searchQuery !== "" ? ( // Use 'items' instead of 'searchResult'
                            <Searchbar
                                placeholder="Search"
                                loading={refreshing}
                                onChangeText={onChangeSearch}
                                style={{ marginHorizontal: 15, marginTop: 10, backgroundColor: theme.colors.background }}
                                value={searchQuery}
                            />
                        ) : null}
                        {searchQuery !== "" && searchResult.length === 0 && (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, color: theme.colors.outline }}>No Results Found</Text>
                            </View>
                        )}
                        {searchQuery === "" && items.length === 0 && (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, color: theme.colors.outline }}>No Options Available</Text>
                            </View>
                        )}
                    </View>
                    {searchQuery !== "" && searchResult.length > 0 ? (
                        <RadioButton.Group onValueChange={value => onSearchedOptionSelected(value)}>
                            <RenderOptions items={searchResult} selectedValue={checkedValue} />
                        </RadioButton.Group>
                    ) : (
                        <RadioButton.Group onValueChange={value => setCheckedValue(value)}>
                            <RenderOptions items={items} selectedValue={checkedValue} />
                        </RadioButton.Group>
                    )}
                </ScrollView>
                <View style={{ marginHorizontal: 15, marginTop: 0 }}>
                    <Button disabled={!checkedValue} buttonColor={colors.primary} textColor={colors.white} style={[btn, { flexGrow: 1 }]} labelStyle={{ fontSize: 16, fontWeight: 700 }} onPress={onSelected}>Confirm</Button>
                </View>
            </View>
        </ActionSheet>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
    },
    heading: {
        flexGrow: 1,
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '600',
    },
});

export default Dropdown;
